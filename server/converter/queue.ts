import { Queue, Worker, type Job } from 'bullmq';
import IORedis from 'ioredis';
import { REDIS_URL, USE_REDIS } from './config';
import { processJobPayload, type JobPayload } from './workers/processJob';

let connection: IORedis | null = null;
let conversionQueue: Queue<JobPayload> | null = null;
let worker: Worker<JobPayload> | null = null;

export function redisAvailable(): boolean {
  return USE_REDIS;
}

function getConnection(): IORedis {
  if (!connection) {
    connection = new IORedis(REDIS_URL, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    });
  }
  return connection;
}

export async function initQueue(): Promise<boolean> {
  if (!USE_REDIS) return false;
  try {
    const conn = getConnection();
    await conn.connect();
    await conn.ping();

    conversionQueue = new Queue<JobPayload>('file-conversions', { connection: conn });
    worker = new Worker<JobPayload>(
      'file-conversions',
      async (job: Job<JobPayload>) => processJobPayload(job.data, job),
      {
        connection: conn,
        concurrency: Number(process.env.CONVERTER_WORKERS || 2),
      }
    );

    worker.on('failed', (job, err) => {
      console.error('❌ Job failed', job?.id, err.message);
    });

    console.log('✅ BullMQ worker connected');
    return true;
  } catch (err) {
    console.warn('⚠️ Redis unavailable — using inline processing:', (err as Error).message);
    return false;
  }
}

export async function enqueueJob(payload: JobPayload): Promise<void> {
  if (conversionQueue) {
    await conversionQueue.add('convert', payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 },
      removeOnComplete: 100,
      removeOnFail: 50,
    });
    return;
  }
  setImmediate(() => {
    processJobPayload(payload).catch((e) =>
      console.error('Inline job error:', e)
    );
  });
}
