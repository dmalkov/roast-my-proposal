'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface PDFUploaderProps {
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

export default function PDFUploader({ onUpload, isProcessing }: PDFUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB');
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && validateFile(files[0])) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0] && validateFile(files[0])) {
      setSelectedFile(files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  if (isProcessing) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="gradient-animate rounded-2xl p-12 text-center">
          <div className="animate-pulse">
            <div className="text-6xl mb-4">🔥</div>
            <h3 className="text-xl font-semibold text-white mb-2">Roasting in progress...</h3>
            <p className="text-white/80 text-sm">This is gonna hurt a little</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
            transition-all duration-200
            ${isDragging
              ? 'border-panda-green bg-panda-green/10 scale-[1.02]'
              : 'border-panda-text/30 hover:border-panda-green hover:bg-panda-green/5'
            }
          `}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-12 h-12 mx-auto mb-4 text-panda-green" />
          <h3 className="text-lg font-semibold mb-2">Drop your proposal here</h3>
          <p className="text-panda-text/60 text-sm">or click to browse (PDF, max 10MB)</p>
        </div>
      ) : (
        <div className="border-2 border-panda-green rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-10 h-10 text-panda-green" />
              <div>
                <p className="font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                <p className="text-sm text-panda-text/60">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-2 hover:bg-panda-error/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-panda-error" />
            </button>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-panda-green hover:bg-panda-green/90 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span>🔥</span>
            <span>Roast This Proposal</span>
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-center text-panda-error text-sm">{error}</p>
      )}
    </div>
  );
}
