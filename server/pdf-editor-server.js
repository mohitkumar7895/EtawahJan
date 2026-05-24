/**
 * Optional Express server for PDF editor heavy operations (OCR, batch export).
 * Run: npm run pdf-server  (default port 3001)
 */
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const upload = multer({ limits: { fileSize: 25 * 1024 * 1024 } });
const PORT = process.env.PDF_SERVER_PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '25mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'pdf-editor-server' });
});

app.post('/api/pdf/ocr', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const Tesseract = require('tesseract.js');
    const result = await Tesseract.recognize(req.file.buffer, 'eng');

    const words = (result.data.words || [])
      .filter((w) => w.text?.trim() && w.confidence > 40)
      .map((w) => ({
        text: w.text,
        x: w.bbox.x0,
        y: w.bbox.y0,
        width: w.bbox.x1 - w.bbox.x0,
        height: w.bbox.y1 - w.bbox.y0,
        confidence: w.confidence,
      }));

    res.json({ words });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OCR failed' });
  }
});

app.listen(PORT, () => {
  console.log(`PDF Editor Express server running on http://localhost:${PORT}`);
});
