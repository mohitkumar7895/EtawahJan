/** Optional AI background removal via CDN (browser-only, no npm install required). */
export async function removeImageBackgroundAI(imageSource: string | Blob): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('Background removal runs in the browser only.');
  }

  const cdnUrl = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/+esm';
  const mod = (await new Function('u', 'return import(u)')(cdnUrl)) as {
    removeBackground?: (source: string | Blob) => Promise<Blob>;
    default?: { removeBackground?: (source: string | Blob) => Promise<Blob> };
  };

  const removeBackground = mod.removeBackground ?? mod.default?.removeBackground;
  if (typeof removeBackground !== 'function') {
    throw new Error('AI background removal module failed to load.');
  }

  return removeBackground(imageSource);
}

export function loadImageFromBlobUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = url;
  });
}

/** Sample corner pixels to guess backdrop color (passport / studio photos). */
export function detectBackgroundColorFromCanvas(
  canvas: HTMLCanvasElement
): [number, number, number] {
  const ctx = canvas.getContext('2d');
  if (!ctx) return [255, 255, 255];

  const w = canvas.width;
  const h = canvas.height;
  const patch = Math.max(4, Math.floor(Math.min(w, h) * 0.05));
  const corners: [number, number][] = [
    [0, 0],
    [w - patch, 0],
    [0, h - patch],
    [w - patch, h - patch],
  ];

  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  for (const [cx, cy] of corners) {
    for (let y = cy; y < cy + patch; y++) {
      for (let x = cx; x < cx + patch; x++) {
        const px = Math.min(x, w - 1);
        const py = Math.min(y, h - 1);
        const p = ctx.getImageData(px, py, 1, 1).data;
        r += p[0];
        g += p[1];
        b += p[2];
        count++;
      }
    }
  }

  const n = count || 1;
  return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
}

/** Build mask alpha directly from a PNG with transparency (after AI removal). */
export function applyAlphaChannelAsMask(
  srcData: Uint8ClampedArray,
  maskData: Uint8ClampedArray
): void {
  for (let i = 0; i < srcData.length; i += 4) {
    maskData[i] = 255;
    maskData[i + 1] = 255;
    maskData[i + 2] = 255;
    maskData[i + 3] = srcData[i + 3];
  }
}
