import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFUploader } from '../components/PDFUploader';
import { apiService } from '../services/apiService';
import { toast } from 'sonner';
import { FileText, Upload, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-500/10"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-transparent rounded-full blur-3xl animate-pulse-custom pointer-events-none"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-transparent rounded-full blur-3xl animate-pulse-custom pointer-events-none" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12 animate-slide-in-up">
          <div className="inline-flex items-center gap-2 premium-card px-6 py-3 rounded-full mb-6 border border-blue-500/20">
            <FileText className="w-5 h-5 text-blue-400 animate-pulse-custom" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-semibold">PDF Learning</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
            <span className="block">Upload Your</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 animate-gradient">
              PDF Document
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your document into an accessible learning experience with AI-powered simplification
          </p>
        </div>
        </div>

        <PDFUploader 
          onFileProcess={handleFileProcess}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};