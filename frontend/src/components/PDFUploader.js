import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

export const PDFUploader = ({ onFileProcess, isProcessing }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      onFileProcess(file);
    } else {
      toast.error('Please upload a PDF file');
    }
  }, [onFileProcess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isProcessing
  });

  return (
    <div
      {...getRootProps()}
      data-testid="pdf-upload-zone"
      className={`
        border-3 border-dashed rounded-3xl p-12 transition-all cursor-pointer
        min-h-[400px] flex flex-col items-center justify-center gap-6
        premium-card backdrop-blur-xl
        ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/20 scale-[1.02] glow-border'
            : 'border-gray-700 hover:border-blue-400 hover:bg-blue-500/10'
        }
        ${isProcessing ? 'opacity-60 cursor-not-allowed' : 'card-lift'}
      `}
      role="button"
      tabIndex={0}
      aria-label="Upload PDF file"
    >
      <input {...getInputProps()} />
      
      {isProcessing ? (
        <>
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-500/30 rounded-full"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white mb-2">Processing PDF...</p>
            <p className="text-gray-400">Extracting and analyzing content with AI</p>
            <div className="mt-6 w-64 bg-gray-800 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-gradient"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 p-8 rounded-3xl shadow-2xl">
              {isDragActive ? (
                <FileText className="w-16 h-16 text-white" aria-hidden="true" />
              ) : (
                <Upload className="w-16 h-16 text-white" aria-hidden="true" />
              )}
            </div>
          </div>
          
          <div className="text-center space-y-3">
            <p className="text-2xl font-bold text-white">
              {isDragActive ? 'Drop your PDF here' : 'Upload PDF Document'}
            </p>
            <p className="text-lg text-gray-300">
              Drag and drop or click to select a PDF file
            </p>
          </div>
          
          <Button 
            data-testid="browse-files-btn"
            className="mt-4 cyber-button text-white px-10 py-6 text-lg rounded-2xl font-bold"
            type="button"
          >
            Browse Files
          </Button>
          
          <div className="flex items-center gap-2 mt-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-custom"></div>
            <p className="text-sm text-gray-400">
              Supports text-based and scanned PDFs
            </p>
          </div>
        </>
      )}
    </div>
  );
};