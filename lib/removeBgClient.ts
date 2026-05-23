export type RemoveBgFormat = 'png' | 'jpg' | 'webp';

export interface RemoveBgOptions {
  bgColor?: string;
  format?: RemoveBgFormat;
}

/** Call our server proxy for remove.bg background removal. */
export async function removeBackgroundViaRemoveBg(
  file: File,
  options: RemoveBgOptions = {}
): Promise<Blob> {
  const formData = new FormData();
  formData.append('image_file', file);

  if (options.bgColor) {
    formData.append('bg_color', options.bgColor.replace('#', ''));
  }

  formData.append('format', options.format ?? 'png');

  const response = await fetch('/api/remove-background', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let message = 'Background removal failed';
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  return response.blob();
}
