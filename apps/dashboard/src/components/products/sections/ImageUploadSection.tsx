"use client";

import { useRef, useState } from "react";
import { Upload, X, GripVertical } from "lucide-react";
import type { ImageFile } from "../hooks/useImageHandler";

interface ImageUploadSectionProps {
  selectedFiles: ImageFile[];
  onAddFiles: (files: File[]) => boolean;
  onRemoveFile: (id: string) => void;
  onReorderFiles: (startIndex: number, endIndex: number) => void;
  uploadError?: string;
  disabled?: boolean;
}

export function ImageUploadSection({
  selectedFiles,
  onAddFiles,
  onRemoveFile,
  onReorderFiles,
  uploadError,
  disabled,
}: ImageUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // ── Drag-over drop zone ──
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => setIsDragActive(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    onAddFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onAddFiles(Array.from(e.target.files));
      // Reset so the same file can be re-selected after removal
      e.target.value = "";
    }
  };

  // ── Thumbnail reorder via drag ──
  const handleThumbDragStart = (index: number) => setDraggedIndex(index);

  const handleThumbDragEnter = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorderFiles(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleThumbDragEnd = () => setDraggedIndex(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest text-brand-stone font-sans">
          Product Images
        </p>
        <span className="text-xs text-brand-stone font-sans">
          {selectedFiles.length} / 10 selected
        </span>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-lg border-2 border-dashed cursor-pointer transition-colors p-8 text-center
          ${isDragActive
            ? "border-brand-gold bg-brand-cream"
            : "border-brand-beige-dark hover:border-brand-gold/60 bg-white"
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <Upload size={28} className="text-brand-stone" />
          <div>
            <p className="text-sm font-medium font-sans text-brand-charcoal">
              Drag images here or click to select
            </p>
            <p className="text-xs text-brand-stone font-sans mt-0.5">
              JPEG, PNG, WebP, GIF — max 5 MB each, 50 MB total
            </p>
          </div>
        </div>
      </div>

      {uploadError && (
        <p className="text-xs text-red-500 font-sans">{uploadError}</p>
      )}

      {/* Thumbnail grid */}
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {selectedFiles.map((img, index) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => handleThumbDragStart(index)}
              onDragEnter={() => handleThumbDragEnter(index)}
              onDragEnd={handleThumbDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`relative group rounded-lg overflow-hidden border-2 aspect-square cursor-move transition-all
                ${draggedIndex === index
                  ? "border-brand-gold opacity-50 scale-95"
                  : "border-brand-beige-dark hover:border-brand-gold"
                }`}
            >
              <img
                src={img.preview}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />

              {/* Position badge */}
              <span className="absolute top-1.5 left-1.5 bg-brand-gold text-brand-cream text-[10px] font-sans font-bold px-1.5 py-0.5 rounded">
                {index + 1}
              </span>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 p-1.5 rounded cursor-grab">
                  <GripVertical size={14} className="text-brand-charcoal" />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(img.id);
                  }}
                  className="bg-red-500 hover:bg-red-600 p-1.5 rounded text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-brand-stone font-sans">
        First image is the primary thumbnail. Drag to reorder.
      </p>
    </div>
  );
}
