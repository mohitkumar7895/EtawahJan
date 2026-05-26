'use client';

import type { RenderedLetter } from '@/lib/applications/renderer';
import type { Language } from '@/lib/applications/types';

/**
 * Client-side A4 PDF + Word (.doc) generators for application letters.
 *
 * PDF path:
 *   • html2canvas snapshots the live preview DOM (Devanagari renders
 *     natively in the browser — no font embedding needed).
 *   • jsPDF wraps the rasterised image into a multi-page A4 PDF.
 *
 * Word path:
 *   • We synthesise a Word-friendly HTML document with the right MSO
 *     namespace declarations and save it under a .doc extension. Word,
 *     LibreOffice and Google Docs all open these as editable rich-text
 *     documents — perfect for users who want to tweak the letter in
 *     MS Word after generating it.
 *
 * Why DOM-snapshot for PDF (and not pdf-lib):
 *   • Hindi (Devanagari) requires shaping for conjuncts that pdf-lib's
 *     built-in fonts cannot do, and embedding a custom Devanagari TTF
 *     needs @pdf-lib/fontkit (an extra runtime dep).
 *   • Snapshot is WYSIWYG — what the user fine-tuned in the editor is
 *     byte-identical to the downloaded PDF.
 *   • The libraries (html2canvas, jsPDF) are already shipped under
 *     /public/pdf-libs/ for the resume builder, so we incur zero extra
 *     bundle weight.
 */

type Html2CanvasFn = (
  element: HTMLElement,
  options?: Record<string, unknown>,
) => Promise<HTMLCanvasElement>;

interface JsPdf {
  internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
  addImage: (
    imageData: string,
    format: string,
    x: number,
    y: number,
    width: number,
    height: number,
    alias?: string,
    compression?: string,
  ) => void;
  addPage: () => void;
  save: (filename: string) => void;
  output: (type: 'arraybuffer') => ArrayBuffer;
  setProperties: (props: {
    title?: string;
    subject?: string;
    author?: string;
    creator?: string;
  }) => void;
}

type JsPdfConstructor = new (options?: {
  orientation?: 'portrait' | 'landscape';
  unit?: string;
  format?: string | number[];
}) => JsPdf;

interface PdfLibs {
  html2canvas: Html2CanvasFn;
  jsPDF: JsPdfConstructor;
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
      existing.addEventListener('error', () =>
        reject(new Error(`Failed to load ${src}`)),
      );
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
        // Fall back to a CDN copy if the in-repo asset is unreachable
        // (e.g. blocked by a corporate proxy serving the public/ dir).
        await loadScript(HTML2CANVAS_CDN);
        await loadScript(JSPDF_CDN);
      }

      const w = window as Window & {
        html2canvas?: Html2CanvasFn;
        jspdf?: { jsPDF: JsPdfConstructor };
      };

      if (!w.html2canvas || !w.jspdf?.jsPDF) {
        throw new Error('PDF libraries did not initialise');
      }

      return { html2canvas: w.html2canvas, jsPDF: w.jspdf.jsPDF };
    })();
  }
  return libsPromise;
}

export interface DownloadOptions {
  /** id of the DOM element holding the rendered letter. */
  elementId: string;
  /** Final file name (without extension). */
  fileName: string;
  /** Embedded PDF title metadata. */
  title: string;
  /** Optional applicant name — written into the PDF "author" field. */
  author?: string;
}

/**
 * Captures `elementId` with html2canvas and downloads the resulting
 * multi-page A4 PDF. The caller MUST ensure the element is rendered
 * in its preview (read-only) state before calling, otherwise the
 * snapshot will include the body-edit textarea.
 */
export async function downloadApplicationPdf(opts: DownloadOptions): Promise<void> {
  const el = document.getElementById(opts.elementId);
  if (!el) {
    throw new Error(`Element #${opts.elementId} not found for PDF export`);
  }

  const { html2canvas, jsPDF } = await loadPdfLibs();

  // Suspend any drop-shadow on the printable area so it doesn't bleed
  // into the captured canvas as a fuzzy halo.
  const prevShadow = el.style.boxShadow;
  el.style.boxShadow = 'none';

  try {
    // Two RAFs make sure React's flushed render is also painted.
    await new Promise<void>((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r())),
    );

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      // Always white background regardless of site theme — letters
      // are meant to be printed on paper.
      backgroundColor: '#ffffff',
      width: el.offsetWidth,
      height: el.offsetHeight,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
      onclone: (clonedDoc: Document) => {
        // Force light mode for the print — application letters are
        // always printed black-on-white regardless of the user's site
        // theme. We do this by stripping any "dark" class from
        // <html> + the cloned target.
        clonedDoc.documentElement.classList.remove('dark');
        const cloned = clonedDoc.getElementById(opts.elementId);
        if (!cloned) return;
        cloned.style.boxShadow = 'none';
        cloned.style.transform = 'none';
        cloned.style.margin = '0';
        cloned.style.backgroundColor = '#ffffff';
        cloned.style.color = '#0f172a'; // slate-900
      },
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    pdf.setProperties({
      title: opts.title,
      subject: 'Application Letter',
      author: opts.author || 'Applicant',
      creator: 'Jan Seva Kendra Application Maker',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

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

    const safe = (opts.fileName || 'application').replace(/[<>:"/\\|?*]/g, '').trim() || 'application';
    pdf.save(`${safe}.pdf`);
  } finally {
    el.style.boxShadow = prevShadow;
  }
}

// ─── MS Word (.doc) export ──────────────────────────────────────

export interface WordOptions {
  letter: RenderedLetter;
  /** Final file name (without extension). */
  fileName: string;
  /** Embedded document title. */
  title: string;
  /** Optional applicant name — written into Word's author metadata. */
  author?: string;
}

/**
 * Generate a Word-readable .doc file matching the live preview and
 * trigger a download. The output is a fully-editable rich-text
 * document — Hindi (Devanagari) renders correctly thanks to the
 * "Mangal" / "Nirmala UI" font hints, both pre-installed on every
 * Windows / Office build.
 */
export function downloadApplicationWord(opts: WordOptions): void {
  const { letter, fileName, title, author } = opts;
  const html = buildWordHtml(letter, title, author);

  // The "application/msword" MIME paired with a .doc extension lets
  // Word, LibreOffice and Google Docs all open the file as a real
  // editable document instead of plain HTML.
  const blob = new Blob([`\ufeff${html}`], {
    type: 'application/msword;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const safe = (fileName || 'application').replace(/[<>:"/\\|?*]/g, '').trim() || 'application';
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safe}.doc`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/** Escape a string for safe insertion into HTML element content. */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Build the Word-friendly HTML document. Includes Office namespace
 * declarations, A4 page setup, and font hints tuned for each language.
 */
function buildWordHtml(letter: RenderedLetter, title: string, author?: string): string {
  const lang: Language = letter.language;

  // Mangal / Nirmala UI ship with every Windows install and render
  // Devanagari out of the box. Calibri is Word's default English face.
  const bodyFont =
    lang === 'hi'
      ? '"Nirmala UI","Mangal","Noto Sans Devanagari","Arial Unicode MS",sans-serif'
      : '"Calibri","Arial",sans-serif';

  const subjectLabel = lang === 'hi' ? 'विषय: ' : 'Subject: ';
  const safeTitle = escapeHtml(title);
  const safeAuthor = escapeHtml(author || 'Applicant');

  const recipientHtml = letter.recipientLines
    .map((line, i) =>
      `<p style="margin:0;${i === 1 ? 'font-weight:bold;' : ''}">${escapeHtml(line)}</p>`,
    )
    .join('');

  const bodyHtml = letter.bodyParagraphs
    .map(
      (para) =>
        `<p style="margin:0 0 12pt 0;text-align:justify;line-height:1.55;">${escapeHtml(para)}</p>`,
    )
    .join('');

  const signatureHtml = letter.signatureLines
    .map((s) => `<p style="margin:0;font-weight:500;">${escapeHtml(s)}</p>`)
    .join('');

  // Word HTML preamble — the MSO namespaces unlock features like
  // page geometry and lang attributes; the @page rule sets A4 with
  // sensible margins matching the live preview.
  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="ProgId" content="Word.Document" />
  <meta name="Generator" content="Jan Seva Kendra Application Maker" />
  <meta name="Originator" content="Jan Seva Kendra Application Maker" />
  <meta name="author" content="${safeAuthor}" />
  <title>${safeTitle}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: A4;
      margin: 2.4cm 2.2cm 2.4cm 2.2cm;
    }
    body {
      font-family: ${bodyFont};
      font-size: 12pt;
      color: #000;
      line-height: 1.55;
    }
    p { margin: 0 0 8pt 0; }
    .subject { font-weight: bold; margin: 12pt 0; }
    .closing { margin-top: 28pt; }
    .signature { margin-top: 36pt; font-size: 11pt; }
  </style>
</head>
<body lang="${lang === 'hi' ? 'HI' : 'EN-IN'}">
  <div class="recipient">${recipientHtml}</div>
  ${letter.subjectLine ? `<p class="subject"><strong>${escapeHtml(subjectLabel)}</strong>${escapeHtml(letter.subjectLine)}</p>` : ''}
  <div class="body">${bodyHtml}</div>
  <p class="closing">${escapeHtml(letter.closing)}</p>
  <div class="signature">${signatureHtml}</div>
</body>
</html>`;
}
