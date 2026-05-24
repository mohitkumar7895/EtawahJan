'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { RbButton, RbLabel } from './ui';

const MAX_W = 480;
const MAX_H = 560;
const MAX_DATA_URL_CHARS = 1_200_000;

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blobUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(blobUrl);
      let { width, height } = img;
      const scale = Math.min(MAX_W / width, MAX_H / height, 1);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      let quality = 0.9;
      let data = canvas.toDataURL('image/jpeg', quality);
      while (data.length > MAX_DATA_URL_CHARS && quality > 0.45) {
        quality -= 0.08;
        data = canvas.toDataURL('image/jpeg', quality);
      }
      resolve(data);
    };
    img.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error('Invalid image'));
    };
    img.src = blobUrl;
  });
}

export default function ResumePhotoUpload({
  photoUrl,
  onPhoto,
}: {
  photoUrl?: string;
  onPhoto: (dataUrl: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Sirf image file chunein (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      alert('Photo 6MB se chhoti honi chahiye.');
      return;
    }
    setBusy(true);
    try {
      const data = await resizeImage(file);
      onPhoto(data);
    } catch {
      alert('Photo load nahi hui. Dobara try karein.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/15 bg-slate-900/40 p-3 space-y-2">
      <RbLabel>Passport size photo</RbLabel>
      <p className="text-[11px] text-slate-500">Gallery se photo upload karein — URL ki zaroorat nahi.</p>
      <div className="flex flex-wrap items-start gap-3">
        <div
          className="w-[92px] h-[110px] border-2 border-dashed border-white/25 rounded bg-slate-950/50 flex items-center justify-center overflow-hidden shrink-0"
        >
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-slate-500 text-center px-1">Photo yahan dikhegi</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = '';
            }}
          />
          <RbButton type="button" variant="secondary" disabled={busy} onClick={() => inputRef.current?.click()}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {busy ? 'Uploading…' : photoUrl ? 'Change photo' : 'Upload photo'}
          </RbButton>
          {photoUrl && (
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
              onClick={() => onPhoto(undefined)}
            >
              <X className="w-3 h-3" /> Remove photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
