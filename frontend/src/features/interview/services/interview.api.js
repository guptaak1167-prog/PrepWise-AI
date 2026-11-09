import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Generate interview report
export const generateInterviewReport = async ({
  jobTitle,
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  try {
    const formData = new FormData();

    // Add form fields
    formData.append('jobTitle', jobTitle || '');
    formData.append('jobDescription', jobDescription || '');
    formData.append('selfDescription', selfDescription || '');

    // Add resume if uploaded
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    // DEBUG LOGS
    console.log('========== INTERVIEW REQUEST ==========');
    console.log('Job Title:', jobTitle);
    console.log('Job Description:', jobDescription);
    console.log('Self Description:', selfDescription);
    console.log('Resume:', resumeFile);

    console.log('========== FORMDATA CONTENTS ==========');

    for (const [key, value] of formData.entries()) {
      console.log(
        key,
        value instanceof File ? `File: ${value.name}, Size: ${value.size} bytes` : value
      );
    }

    console.log('========================================');

    // Send request to backend
    const response = await api.post('/api/interview/', formData);

    console.log('Interview API response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Interview API Error:', error.response?.data || error.message);

    throw error;
  }
};

// Get interview report by ID
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/${interviewId}`);

  return response.data;
};

// Get all interview reports
export const getAllInterviewReports = async () => {
  const response = await api.get('/api/interview/');

  return response.data;
};

// Generate tailored resume PDF
export const generateResumePdf = async ({ interviewReportId }) => {
  const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
    responseType: 'blob',
  });

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.get('/api/auth/logout');
  return response.data;
};
