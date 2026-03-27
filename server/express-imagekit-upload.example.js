/**
 * OPTIONAL: Standalone Express + multer + ImageKit mirror of POST /api/upload-video.
 * This Next.js app already implements uploads in app/api/upload-video/route.ts.
 *
 * Run (after setting IMAGEKIT_PRIVATE_KEY in .env or .env.local):
 *   node server/express-imagekit-upload.example.js
 *
 * Then point REACT_APP_UPLOAD_URL or your admin fetch to http://localhost:4001/api/upload-video
 */
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { ImageKit, toFile } = require('@imagekit/nodejs');

const VIDEO_MAX = 95 * 1024 * 1024;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: VIDEO_MAX },
});

const app = express();
app.use(cors());
app.use(express.json());

function getClient() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey?.trim()) {
    throw new Error('IMAGEKIT_PRIVATE_KEY is required');
  }
  return new ImageKit({ privateKey: privateKey.trim() });
}

/**
 * POST /api/upload-video
 * multipart field name: file (multer.single('file'))
 */
app.post('/api/upload-video', upload.single('file'), async (req, res) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ error: 'No file provided. Use form field "file".' });
    }

    const mime = req.file.mimetype || 'video/mp4';
    if (!mime.startsWith('video/')) {
      return res.status(400).json({ error: 'Only video/* uploads are allowed on this route.' });
    }

    const originalName = req.file.originalname || 'video.mp4';
    const client = getClient();
    const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_').slice(0, 180) || 'video.mp4';
    const uploadable = await toFile(req.file.buffer, safeName, { type: mime });

    const response = await client.files.upload({
      file: uploadable,
      fileName: safeName,
      folder: '/announcements/videos',
      useUniqueFileName: true,
    });

    const url = response.url?.trim();
    if (!url) {
      return res.status(500).json({ error: 'ImageKit did not return a URL' });
    }

    return res.status(201).json({
      message: 'Video uploaded successfully',
      fileUrl: url,
      videoUrl: url,
      mediaType: 'video',
    });
  } catch (err) {
    console.error(err);
    const msg = err instanceof Error ? err.message : 'Upload failed';
    const code = msg.includes('IMAGEKIT') ? 503 : 500;
    return res.status(code).json({ error: msg });
  }
});

const PORT = process.env.EXPRESS_UPLOAD_PORT || 4001;
app.listen(PORT, () => {
  console.log(`Express ImageKit upload listening on http://localhost:${PORT}`);
});
