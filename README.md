# StudyBridge - AI-Powered PDF Learning Companion

StudyBridge is a comprehensive web application that converts inaccessible PDF documents into multiple accessible formats using AI, specifically designed for students with disabilities.

## 🌟 Features

### Core Functionality
- **PDF Processing**: Upload and extract text from both text-based and scanned PDFs
- **AI Content Simplification**: Google Gemini-powered content adaptation for different disabilities and reading levels
- **Text-to-Speech**: Web Speech API integration with adjustable speed and voice selection
- **Visual Accessibility Controls**: Customizable fonts, sizes, contrast modes, and spacing
- **Study Tools**: AI-generated flashcards, summaries, key terms, and quizzes

### Accessibility Features
- WCAG 2.1 AA compliant
- Screen reader compatible
- Keyboard navigation support
- High contrast modes
- Dyslexic-friendly fonts
- Adjustable text spacing and sizing
- Multi-disability support (Dyslexia, ADHD, Autism, Visual/Hearing/Motor impairments)

## 🚀 Quick Start

### 1. Get Your Gemini API Key

**Important:** This app requires a Google Gemini API key for AI-powered content simplification.

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

### 2. Add API Key to Backend

Edit `/app/backend/.env` and add your key:

```bash
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. Restart Backend

```bash
sudo supervisorctl restart backend
```

### 4. Access the App

Open your browser and navigate to the app URL. The application is now ready to use!

## 📖 How to Use

1. **Set Up Profile**: Click "Profile" button → Select your accessibility needs → Save
2. **Upload PDF**: Drag & drop or browse for a PDF file
3. **Simplify Content**: Click "Simplify Content" to process with AI
4. **Explore Tools**:
   - Adjust visual settings (font size, spacing, contrast)
   - Use Text-to-Speech for audio playback
   - Generate study aids (flashcards, quizzes, summaries)

## 🎯 Key Benefits

- **Free Alternative**: Saves $2000+/year vs. commercial assistive technology
- **AI-Powered**: Google Gemini adapts content for different disabilities
- **Multi-Modal**: Text, audio, and visual accessibility options
- **Privacy-Focused**: All processing done securely, no data stored

## 🔧 Technical Details

### Tech Stack
- **Frontend**: React 19, Tailwind CSS, Shadcn UI
- **Backend**: FastAPI, Python 3.11
- **AI**: Google Gemini Pro
- **PDF**: pdfjs-dist, PyPDF2
- **TTS**: Web Speech API
- **Storage**: localStorage (profile), MongoDB (optional data)

### API Endpoints
- `POST /api/extract-pdf` - Extract text from PDF
- `POST /api/simplify-content` - Simplify with AI
- `POST /api/generate-study-aids` - Generate study materials

## 🐛 Troubleshooting

### Gemini API Issues
- **"API key not configured"**: Add key to `/app/backend/.env` and restart backend
- **"Failed to simplify"**: Check API key validity and quota limits

### PDF Processing
- **No text extracted**: File may be image-based (OCR coming soon)
- **Slow processing**: Large PDFs take time to process

### Text-to-Speech
- Use Chrome, Edge, or Safari for best TTS support
- Check browser permissions if audio doesn't work

## 📊 Accessibility Features

- **Visual**: Font controls, contrast modes, spacing adjustments
- **Cognitive**: Content simplification, chunking, reading level adaptation
- **Auditory**: Text-to-speech with speed/voice controls
- **Motor**: Large touch targets, keyboard navigation
- **Screen Readers**: Full ARIA support, semantic HTML

## 🎨 Design Philosophy

Accessibility-first design with:
- High contrast colors (Ocean Blue, Emerald Green)
- Modern, readable fonts (Manrope, Inter)
- Large touch targets (48px minimum)
- Clear visual hierarchy
- No gradient overload
- Smooth transitions

## 📝 Project Structure

```
/app/
├── backend/
│   ├── server.py          # FastAPI app with Gemini integration
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Configuration (ADD GEMINI KEY HERE)
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   └── utils/        # Helper functions
│   └── package.json      # Node dependencies
└── README.md            # This file
```

## 🤝 Support

For issues or questions:
1. Check this README
2. Verify Gemini API key configuration
3. Check browser console for errors
4. Ensure backend and frontend services are running

---

**Built for accessible education • Powered by Google Gemini AI**
