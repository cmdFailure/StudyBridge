import axios from 'axios';

const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const apiService = {
  async extractPDF(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE}/extract-pdf`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async simplifyContent(content, readingLevel, disabilityType) {
    const response = await axios.post(`${API_BASE}/simplify-content`, {
      content,
      reading_level: readingLevel,
      disability_type: disabilityType
    });
    return response.data;
  },

  async generateStudyAids(content, aidType) {
    const response = await axios.post(`${API_BASE}/generate-study-aids`, {
      content,
      aid_type: aidType
    });
    return response.data;
  }
};