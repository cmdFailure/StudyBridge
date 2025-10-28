import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFUploader } from '../components/PDFUploader';
import { apiService } from '../services/apiService';
import { toast } from 'sonner';

export const UploadPage = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileProcess = async (file) => {
    setIsProcessing(true);
    
    try {
      const result = await apiService.extractPDF(file);
      
      // Store the extracted content in localStorage for dashboard
      localStorage.setItem('currentPDF', JSON.stringify({
        text: result.text,
        fileName: file.name,
        readingScore: result.reading_score,
        wordCount: result.word_count,
        pages: result.pages
      }));
      
      toast.success(`PDF extracted: ${result.pages} pages, ${result.word_count} words`);
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || error.response?.data?.detail || 'Failed to process PDF';
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Upload Your PDF
          </h1>
          <p className="text-xl text-slate-300">
            Transform your document into an accessible learning experience
          </p>
        </div>

        <PDFUploader 
          onFileProcess={handleFileProcess}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};