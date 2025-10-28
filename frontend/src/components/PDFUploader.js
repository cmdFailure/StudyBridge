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
        border-3 border-dashed rounded-2xl p-12 transition-all cursor-pointer
        min-h-[280px] flex flex-col items-center justify-center gap-4
        ${
          isDragActive
            ? 'border-sky-500 bg-sky-50 scale-[1.02]'
            : 'border-slate-300 hover:border-sky-400 hover:bg-slate-50'
        }
        ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}
      `}
      role="button"
      tabIndex={0}
      aria-label="Upload PDF file"
    >
      <input {...getInputProps()} />
      
      {isProcessing ? (
        <>
          <Loader2 className="w-16 h-16 text-sky-500 animate-spin" aria-hidden="true" />
          <p className="text-lg font-medium text-slate-700">Processing PDF...</p>
          <p className="text-sm text-slate-500">Extracting and analyzing content</p>
        </>
      ) : (
        <>
          <div className="bg-gradient-to-br from-sky-400 to-blue-500 p-5 rounded-2xl shadow-lg">
            {isDragActive ? (
              <FileText className="w-12 h-12 text-white" aria-hidden="true" />
            ) : (
              <Upload className="w-12 h-12 text-white" aria-hidden="true" />
            )}
          </div>
          
          <div className="text-center">
            <p className="text-xl font-semibold text-slate-800 mb-2">
              {isDragActive ? 'Drop your PDF here' : 'Upload PDF Document'}
            </p>
            <p className="text-base text-slate-600">
              Drag and drop or click to select a PDF file
            </p>
          </div>
          
          <Button 
            data-testid="browse-files-btn"
            className="mt-2 bg-sky-500 hover:bg-sky-600 text-white px-8 py-6 text-base rounded-xl"
            type="button"
          >
            Browse Files
          </Button>
          
          <p className="text-sm text-slate-500 mt-2"
             role="note"
             aria-label="Supported format information">
            Supports text-based and scanned PDFs
          </p>
        </>
      )}
    </div>
  );
};