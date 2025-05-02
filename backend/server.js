require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { OpenAI } = require('openai');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { PDFDocument } = require('pdf-lib');
const { Document } = require('docx');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const uploadDir = path.join(__dirname, 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      console.error('Error creating upload directory:', error);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Μη επιτρεπτός τύπος αρχείου. Επιτρέπονται μόνο PDF και DOCX.'));
    }
  }
});

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1'
});

// Verify OpenAI API key
async function verifyOpenAIKey() {
  try {
    await openai.models.list();
    return true;
  } catch (error) {
    console.error('OpenAI API key verification failed:', error);
    return false;
  }
}

async function analyzeFormatting(filePath, fileType) {
  let formattingInfo = {
    pageCount: 0,
    layout: {},
    sections: []
  };

  try {
    if (fileType === 'application/pdf') {
      const pdfBytes = await fs.readFile(filePath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      
      // Analyze basic PDF structure
      formattingInfo.pageCount = pages.length;
      
      // Analyze first page layout
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      
      formattingInfo.layout = {
        pageSize: { width, height },
        orientation: width > height ? 'landscape' : 'portrait'
      };

      // Analyze page structure
      formattingInfo.sections = pages.map((page, index) => ({
        pageNumber: index + 1,
        size: page.getSize()
      }));

    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: filePath });
      
      // Basic DOCX analysis
      formattingInfo = {
        pageCount: 1, // Mammoth doesn't provide page count
        layout: {
          type: 'docx',
          contentLength: result.value.length
        },
        sections: []
      };
    }
  } catch (error) {
    console.error('Error analyzing formatting:', error);
  }
  
  return formattingInfo;
}

// Routes
app.post('/upload', upload.single('resume'), async (req, res) => {
  let filePath;
  try {
    console.log('Upload request received');
    
    const isKeyValid = await verifyOpenAIKey();
    if (!isKeyValid) {
      throw new Error('Το API key του OpenAI δεν είναι έγκυρο. Παρακαλώ ελέγξτε το API key σας.');
    }

    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'Δεν ανεβήκε κανένα αρχείο' });
    }

    console.log('File uploaded:', req.file.originalname);
    let textContent = '';
    filePath = req.file.path;
    let formattingInfo = {};

    try {
      console.log('Starting file parsing');
      if (req.file.mimetype === 'application/pdf') {
        console.log('Parsing PDF file');
        const data = await pdfParse(await fs.readFile(filePath));
        textContent = data.text;
      } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log('Parsing DOCX file');
        const result = await mammoth.extractRawText({ path: filePath });
        textContent = result.value;
      }
      console.log('File parsing completed');
    } catch (parseError) {
      console.error('File parsing error:', parseError);
      throw new Error('Το αρχείο είναι κατεστραμμένο ή δεν μπορεί να αναλυθεί. Παρακαλώ ελέγξτε το αρχείο και δοκιμάστε ξανά.');
    }

    // Analyze formatting
    formattingInfo = await analyzeFormatting(filePath, req.file.mimetype);

    // Send to OpenAI with formatting info
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `Είσαι ένας έμπειρος Career Coach και ειδικός στα βιογραφικά του κλάδου της ναυτιλίας. 
Η εμπειρία σου περιλαμβάνει την αξιολόγηση βιογραφικών ώστε να περάσουν επιτυχώς τα συστήματα ATS 
και να έχουν επαγγελματική εμφάνιση.

ΟΛΕΣ ΟΙ ΑΠΑΝΤΗΣΕΙΣ ΠΡΕΠΕΙ ΝΑ ΕΙΝΑΙ ΑΥΣΤΗΡΑ ΣΤΗΝ ΕΛΛΗΝΙΚΗ ΓΛΩΣΣΑ, 
με επαγγελματικό τόνο και σωστή ναυτιλιακή ορολογία.

ΚΡΙΣΙΜΟ: ΠΡΕΠΕΙ να απαντήσεις ΜΟΝΟ με ένα έγκυρο JSON object και ΤΙΠΟΤΑ άλλο. 
ΜΗΝ προσθέσεις εισαγωγικά γύρω από το JSON. 
ΜΗΝ προσθέσεις κανένα άλλο κείμενο πριν ή μετά το JSON.

Θα σου αποστείλω το περιεχόμενο ενός βιογραφικού και πληροφορίες για τη μορφοποίησή του.
Ζητώ από εσένα να αναλύσεις τόσο το περιεχόμενο όσο και την εμφάνιση του βιογραφικού, 
βασίζοντας τη βαθμολογία σου στις πραγματικές πληροφορίες που βλέπεις.

Πρέπει να παράγεις δύο βαθμολογίες 0-100:
- content_analysis.score: Κρίνε τη συνολική ποιότητα, πληρότητα και στόχευση του βιογραφικού για τη ναυτιλία.
- formatting_analysis.score: Κρίνε την αισθητική, τη δομή και την ευκολία ανάγνωσης. 

Χρησιμοποίησε αυτούς τους οδηγούς:
- 0-30 = Εξαιρετικά ελλιπές/κακό
- 31-60 = Μέτριο
- 61-80 = Καλό
- 81-90 = Πολύ καλό
- 91-100 = Εξαιρετικό

Η απάντησή σου ΠΡΕΠΕΙ να είναι ακριβώς σε αυτή τη μορφή JSON, χωρίς καμία άλλη προσθήκη:

{
  "content_analysis": {
    "score": <number 0-100>,
    "strong_points": ["point1", "point2", "point3"],
    "weak_points": ["point1", "point2", "point3"],
    "improvement_suggestions": ["suggestion1", "suggestion2", "suggestion3"]
  },
  "formatting_analysis": {
    "score": <number 0-100>,
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2", "weakness3"],
    "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
  }
}

Μορφοποίηση του βιογραφικού:
${JSON.stringify(formattingInfo)}

Περιεχόμενο του βιογραφικού:
${textContent}
`
        }
      ],
      response_format: { type: "json_object" }
    });

    let analysis;
    try {
      const content = completion.choices[0].message.content;
      // Αφαίρεση τυχόν backticks ή άλλων χαρακτήρων που μπορεί να έχουν προστεθεί
      const cleanContent = content.replace(/^```json\s*|\s*```$/g, '').trim();
      analysis = JSON.parse(cleanContent);
      
      // Επικύρωση της δομής του JSON
      if (!analysis.content_analysis || !analysis.formatting_analysis) {
        throw new Error('Η απάντηση δεν έχει την αναμενόμενη δομή');
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw response:', completion.choices[0].message.content);
      throw new Error('Σφάλμα κατά την ανάλυση της απάντησης. Παρακαλώ δοκιμάστε ξανά.');
    }
    
    res.json(analysis);

  } catch (error) {
    console.error('Error in upload route:', error);
    res.status(500).json({ 
      error: error.message || 'Σφάλμα κατά την επεξεργασία του αρχείου',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    // Clean up the file
    if (filePath) {
      try {
        await fs.unlink(filePath);
        console.log('File cleaned up successfully');
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Το αρχείο είναι πολύ μεγάλο. Μέγιστο μέγεθος: 5MB' });
    }
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Σφάλμα κατά την επεξεργασία του αρχείου' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 