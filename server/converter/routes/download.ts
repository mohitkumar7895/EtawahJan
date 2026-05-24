import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { jobOutputDir } from '../utils/storage';

export const downloadRouter = Router();

downloadRouter.get('/:jobId/:filename', (req, res) => {
  const { jobId, filename } = req.params;
  const safeName = path.basename(filename);
  const filePath = path.join(jobOutputDir(jobId), safeName);

  if (!filePath.startsWith(jobOutputDir(jobId))) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath, safeName);
});
