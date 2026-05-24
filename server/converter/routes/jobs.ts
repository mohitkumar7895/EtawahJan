import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MAX_FILE_SIZE, MAX_FILES } from '../config';
import { createJobRecord, getJob, listJobs } from '../jobs/store';
import { enqueueJob } from '../queue';
import { createJobDirs, jobUploadDir } from '../utils/storage';
import { CONVERTER_TOOLS } from '../../../lib/converter/tools';

const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, _file, cb) => {
      const jobId = (req as Request & { jobId?: string }).jobId || uuidv4();
      (req as Request & { jobId?: string }).jobId = jobId;
      const dir = jobUploadDir(jobId);
      await createJobDirs(jobId);
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      cb(null, `${Date.now()}-${safe}`);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
});

export const jobsRouter = Router();

jobsRouter.get('/', (_req, res) => {
  res.json({ tools: CONVERTER_TOOLS.length, jobs: listJobs() });
});

jobsRouter.get('/analytics/summary', (_req, res) => {
  const { getAnalytics } = require('../jobs/store');
  res.json(getAnalytics());
});

jobsRouter.get('/:id', (req, res) => {
  const job = getJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

jobsRouter.post(
  '/',
  (req, _res, next) => {
    (req as Request & { jobId?: string }).jobId = uuidv4();
    next();
  },
  upload.array('files', MAX_FILES),
  async (req: Request, res: Response) => {
    try {
      const toolId = String(req.body.toolId || '');
      const tool = CONVERTER_TOOLS.find((t) => t.id === toolId);
      if (!tool) {
        return res.status(400).json({ error: 'Invalid tool' });
      }

      const files = req.files as Express.Multer.File[];
      if (!files?.length) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      if (files.length > tool.maxFiles) {
        return res.status(400).json({ error: `Max ${tool.maxFiles} files allowed` });
      }

      const jobId = (req as Request & { jobId?: string }).jobId!;
      const { output } = await createJobDirs(jobId);
      const options = req.body.options ? JSON.parse(String(req.body.options)) : {};

      const job = createJobRecord(jobId, toolId);
      const inputPaths = files.map((f) => f.path);

      await enqueueJob({
        jobId,
        toolId,
        inputPaths,
        outputDir: output,
        options,
      });

      res.status(201).json(job);
    } catch (err) {
      console.error('Job create error:', err);
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to create job',
      });
    }
  }
);
