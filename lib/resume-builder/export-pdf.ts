'use client';

type Html2CanvasFn = (
  element: HTMLElement,
  options?: Record<string, unknown>
) => Promise<HTMLCanvasElement>;

type JsPDFConstructor = new (options?: {
  orientation?: 'portrait' | 'landscape';
  unit?: string;
  format?: string | number[];
}) => {
  internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
  addImage: (
    imageData: string,
    format: string,
    x: number,
    y: number,
    width: number,
    height: number,
    alias?: string,
    compression?: string
  ) => void;
  addPage: () => void;
  save: (filename: string) => void;
};

interface PdfLibs {
  html2canvas: Html2CanvasFn;
  jsPDF: JsPDFConstructor;
}

const HTML2CANVAS_SRC = '/pdf-libs/html2canvas.min.js';
const JSPDF_SRC = '/pdf-libs/jspdf.umd.min.js';
const HTML2CANVAS_CDN = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
const JSPDF_CDN = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js';

let libsPromise: Promise<PdfLibs> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-pdf-lib="${src}"]`);
    if (existing) {
      if ((existing as HTMLScriptElement).dataset.loaded === '1') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)));
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.pdfLib = src;
    script.onload = () => {
      script.dataset.loaded = '1';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

async function loadPdfLibs(): Promise<PdfLibs> {
  if (!libsPromise) {
    libsPromise = (async () => {
      try {
        await loadScript(HTML2CANVAS_SRC);
        await loadScript(JSPDF_SRC);
      } catch {
        await loadScript(HTML2CANVAS_CDN);
        await loadScript(JSPDF_CDN);
      }

      const w = window as Window & {
        html2canvas?: Html2CanvasFn;
        jspdf?: { jsPDF: JsPDFConstructor };
      };

      if (!w.html2canvas || !w.jspdf?.jsPDF) {
        throw new Error('PDF libraries did not initialize');
      }

      return { html2canvas: w.html2canvas, jsPDF: w.jspdf.jsPDF };
    })();
  }
  return libsPromise;
}

function sanitizeFileName(name: string) {
  return (name || 'Resume').replace(/[<>:"/\\|?*]/g, '').trim() || 'Resume';
}

function resetPreviewScale(root: HTMLElement) {
  const restored: { el: HTMLElement; transform: string }[] = [];
  let node: HTMLElement | null = root.parentElement;

  while (node && node !== document.body) {
    const { transform } = node.style;
    if (transform && transform !== 'none') {
      restored.push({ el: node, transform });
      node.style.transform = 'none';
    }
    node = node.parentElement;
  }

  return () => {
    for (const { el, transform } of restored) {
      el.style.transform = transform;
    }
  };
}

/**
 * Downloads a PDF that matches the on-screen resume preview (WYSIWYG).
 */
export async function exportResumeToPdf(elementId: string, fileName: string) {
  const el = document.getElementById(elementId);
  if (!el) {
    throw new Error('Resume preview not found');
  }

  const { html2canvas, jsPDF } = await loadPdfLibs();

  el.scrollIntoView({ block: 'center', inline: 'center' });
  const restoreScale = resetPreviewScale(el);

  const bg = window.getComputedStyle(el).backgroundColor || '#ffffff';
  const prevShadow = el.style.boxShadow;
  el.style.boxShadow = 'none';

  try {
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: bg === 'rgba(0, 0, 0, 0)' ? '#ffffff' : bg,
      width: el.offsetWidth,
      height: el.offsetHeight,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
      onclone: (clonedDoc: Document) => {
        const cloned = clonedDoc.getElementById(elementId);
        if (!cloned) return;
        cloned.style.boxShadow = 'none';
        cloned.style.transform = 'none';
        cloned.style.margin = '0';
      },
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    pdf.save(`${sanitizeFileName(fileName)}.pdf`);
  } finally {
    el.style.boxShadow = prevShadow;
    restoreScale();
  }
}
