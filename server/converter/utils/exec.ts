import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function runCommand(
  cmd: string,
  args: string[],
  timeoutMs = 120000
): Promise<{ stdout: string; stderr: string }> {
  return execFileAsync(cmd, args, {
    timeout: timeoutMs,
    maxBuffer: 50 * 1024 * 1024,
  });
}

export async function commandExists(cmd: string): Promise<boolean> {
  try {
    if (process.platform === 'win32') {
      await execFileAsync('where', [cmd], { timeout: 5000 });
    } else {
      await execFileAsync('which', [cmd], { timeout: 5000 });
    }
    return true;
  } catch {
    return false;
  }
}
