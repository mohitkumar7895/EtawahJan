import path from 'path';
import type { JobOptions } from './types';
import { updateJob } from './jobStore';
import { runConversion } from './engine/runConversion';

export interface JobPayload {
  jobId: string;
  toolId: string;
  inputPaths: string[];
  outputDir: string;
  options: JobOptions;
}

export async function processConversionJob(payload: JobPayload): Promise<void> {
  const { jobId, toolId, inputPaths, outputDir, options } = payload;

  const setProgress = (progress: number, message?: string) => {
    updateJob(jobId, { status: 'active', progress, message });
  };

  try {
    setProgress(5, 'Processing files…');
    const result = await runConversion({
      toolId,
      inputPaths,
      outputDir,
      options,
      onProgress: setProgress,
    });

    const outputs = result.outputs.map((o) => ({
      name: o.name,
      url: `/download/${jobId}/${encodeURIComponent(o.name)}`,
      size: o.size,
    }));

    const zipUrl = result.zipPath
      ? `/download/${jobId}/${encodeURIComponent(path.basename(result.zipPath))}`
      : undefined;

    updateJob(jobId, {
      status: 'completed',
      progress: 100,
      message: 'Done',
      completedAt: new Date().toISOString(),
      outputs,
      zipUrl,
    });
  } catch (err) {
    updateJob(jobId, {
      status: 'failed',
      progress: 0,
      error: err instanceof Error ? err.message : 'Conversion failed',
      message: 'Failed',
    });
  }
}
