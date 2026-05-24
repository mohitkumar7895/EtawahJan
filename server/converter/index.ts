import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PORT, CLEANUP_INTERVAL_MS, JOB_TTL_MS } from './config';
import { ensureDirs, cleanupOldJobs } from './utils/storage';
import { initQueue } from './queue';
import { jobsRouter } from './routes/jobs';
import { downloadRouter } from './routes/download';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: process.env.CONVERTER_CORS_ORIGIN?.split(',') || true,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.CONVERTER_RATE_LIMIT || 120),
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'file-converter', version: '1.0.0' });
});

app.use('/api/jobs', jobsRouter);
app.use('/api/download', downloadRouter);

async function start() {
  await ensureDirs();
  const queueOk = await initQueue();

  setInterval(() => {
    cleanupOldJobs(JOB_TTL_MS).catch(console.error);
  }, CLEANUP_INTERVAL_MS);

  app.listen(PORT, () => {
    console.log(`🚀 File Converter API http://localhost:${PORT}`);
    console.log(`   Queue: ${queueOk ? 'BullMQ + Redis' : 'inline (no Redis)'}`);
  });
}

start().catch((err) => {
  console.error('Failed to start converter server:', err);
  process.exit(1);
});
