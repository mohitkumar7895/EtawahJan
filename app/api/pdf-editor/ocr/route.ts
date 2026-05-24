import { NextRequest, NextResponse } from 'next/server';

type OcrWord = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
};

function wordsFromTesseractData(data: {
  words?: Array<{ text: string; confidence: number; bbox: { x0: number; y0: number; x1: number; y1: number } }>;
  lines?: Array<{ text: string; confidence: number; bbox: { x0: number; y0: number; x1: number; y1: number } }>;
}): OcrWord[] {
  const source = data.words?.length ? data.words : data.lines || [];
  return source
    .filter((w) => w.text?.trim() && w.confidence > 40)
    .map((w) => ({
      text: w.text,
      x: w.bbox.x0,
      y: w.bbox.y0,
      width: w.bbox.x1 - w.bbox.x0,
      height: w.bbox.y1 - w.bbox.y0,
      confidence: w.confidence,
    }));
}

/** Server-side OCR proxy — accepts page image as PNG/JPEG via FormData */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File | null;

    if (!image || image.size === 0) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const Tesseract = await import('tesseract.js');
    const result = await Tesseract.recognize(buffer, 'eng');
    const words = wordsFromTesseractData(result.data);

    return NextResponse.json({ words });
  } catch (error) {
    console.error('OCR error:', error);
    return NextResponse.json({ error: 'OCR processing failed' }, { status: 500 });
  }
}
