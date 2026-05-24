'use client';

import { useCallback, useState } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

interface DropZoneProps {
  accept: string;
  multiple: boolean;
  maxFiles: number;
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export default function DropZone({
  accept,
  multiple,
  maxFiles,
  files,
  onFilesChange,
}: DropZoneProps) {
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      const merged = multiple ? [...files, ...list].slice(0, maxFiles) : [list[0]].filter(Boolean);
      onFilesChange(merged);
    },
    [files, maxFiles, multiple, onFilesChange]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed px-6 py-14 cursor-pointer transition-all duration-200 ${
          dragging ? 'scale-[1.02]' : 'scale-100'
        } ${
          dragging
            ? 'border-rose-400 bg-rose-50/80 dark:bg-rose-500/10'
            : 'border-slate-300 bg-slate-50/50 hover:border-rose-300 hover:bg-rose-50/30 dark:border-slate-600 dark:bg-slate-900/50 dark:hover:border-rose-500/50'
        }`}
      >
        <input
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/25">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div className="text-center">
          <p className="font-bold text-lg">Drag & drop files here</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            or click to browse · up to {maxFiles} file{maxFiles > 1 ? 's' : ''}
          </p>
        </div>
      </label>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:bg-slate-900 dark:border-slate-700"
            >
              <FileIcon className="w-5 h-5 text-rose-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{f.name}</p>
                <p className="text-xs text-slate-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
