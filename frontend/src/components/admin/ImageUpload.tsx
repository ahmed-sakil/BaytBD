import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Link as LinkIcon,
  Loader2,
  FileText,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { uploadApi, UploadResponse } from '../../services/api';

interface ImageMeta {
  name: string;
  size: number;
  format?: string;
  width?: number;
  height?: number;
}

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Image',
  helperText,
  placeholder = 'https://...',
  required = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [meta, setMeta] = useState<ImageMeta | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, WEBP, GIF, SVG)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    setUploading(true);
    const toastId = toast.loading('Uploading image to Cloudinary...');

    try {
      const response: UploadResponse = await uploadApi.uploadImage(file);
      if (response.success && response.url) {
        onChange(response.url);
        setMeta({
          name: response.originalName || file.name,
          size: response.size || file.size,
          format: response.format || file.name.split('.').pop()?.toUpperCase(),
          width: response.width,
          height: response.height,
        });
        toast.success('Image successfully uploaded to Cloudinary', { id: toastId });
      } else {
        toast.error('Failed to upload image. Please try again.', { id: toastId });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Image upload failed';
      toast.error(msg, { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (uploading) return;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClear = () => {
    onChange('');
    setMeta(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium ${
              mode === 'upload'
                ? 'bg-white text-slate-800 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium ${
              mode === 'url'
                ? 'bg-white text-slate-800 shadow-sm border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Image URL
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Mode 1: Direct File Upload Dropzone */}
      {mode === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 transition text-center cursor-pointer ${
            isDragOver
              ? 'border-slate-800 bg-slate-100/60'
              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
          } ${uploading ? 'opacity-70 pointer-events-none' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-4 text-slate-600">
              <Loader2 className="w-7 h-7 text-slate-800 animate-spin mb-2" />
              <p className="text-xs font-medium">Uploading to Cloudinary...</p>
              <p className="text-[11px] text-slate-400">Piping image buffer to secure cloud</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-2">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700 mb-0.5">
                Click to browse or drag & drop image
              </p>
              <p className="text-[11px] text-slate-400">
                Supports PNG, JPG, WEBP, GIF, SVG up to 10MB
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Manual URL Entry */}
      {mode === 'url' && (
        <div className="relative">
          <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="url"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setMeta(null);
            }}
            placeholder={placeholder}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-slate-700 outline-none transition bg-white"
          />
        </div>
      )}

      {/* Preview & Image Metadata Box */}
      {value && (
        <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Thumbnail */}
            <div className="relative w-14 h-14 rounded-lg border border-slate-200 bg-white overflow-hidden shrink-0">
              <img
                src={value}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80';
                }}
              />
            </div>

            {/* Metadata (Name, Size, Resolution, Format) */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-semibold text-slate-800 truncate">
                  {meta?.name || value.split('/').pop()?.split('?')[0] || 'Image File'}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                  Active
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500">
                {meta?.size ? (
                  <span className="font-mono">Size: {formatFileSize(meta.size)}</span>
                ) : (
                  <span className="font-mono truncate max-w-[200px]">{value}</span>
                )}
                {meta?.format && <span>Format: {meta.format.toUpperCase()}</span>}
                {meta?.width && meta?.height && (
                  <span className="font-mono">{meta.width} × {meta.height} px</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 rounded-md border border-slate-200 bg-white text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition flex items-center gap-1 shadow-sm"
              title="Replace image"
            >
              <RefreshCw className="w-3 h-3" />
              Replace
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md border border-red-200 bg-white text-red-600 hover:bg-red-50 transition"
              title="Remove image"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
    </div>
  );
};
