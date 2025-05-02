# Resume Checker App

Μια web εφαρμογή που αναλύει βιογραφικά μέσω AI και παρέχει αναλυτική ανάλυση.

## Δομή Project

```
resume-checker-app/
├── backend/          # Node.js Express server
├── frontend/         # React.js client
├── README.md
└── .gitignore
```

## Προαπαιτούμενα

- Node.js (v18+)
- npm ή yarn
- OpenAI API key

## Εγκατάσταση

### Backend

```bash
cd backend
npm install
cp .env.example .env  # και συμπληρώστε το OpenAI API key
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Χρήση

1. Ανοίξτε το browser στο `http://localhost:5173`
2. Ανεβάστε το βιογραφικό σας (PDF ή DOCX)
3. Περιμένετε την ανάλυση
4. Δείτε τα αποτελέσματα

## Τεχνολογίες

- Frontend: React.js + Vite
- Backend: Node.js + Express
- AI: OpenAI GPT-4
- File Processing: pdf-parse, mammoth 