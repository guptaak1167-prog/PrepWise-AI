// import {
//   getAllInterviewReports,
//   generateInterviewReport,
//   getInterviewReportById,
//   generateResumePdf,
// } from '../services/interview.api';
// import { useContext, useEffect } from 'react';
// import { InterviewContext } from '../interview.context';
// import { useParams } from 'react-router';

// export const useInterview = () => {
//   const context = useContext(InterviewContext);
//   const { interviewId } = useParams();

//   if (!context) {
//     throw new Error('useInterview must be used within an InterviewProvider');
//   }

//   const { loading, setLoading, report, setReport, reports, setReports } = context;

//   const generateReport = async (data) => {
//     try {
//       setLoading(true);

//       const response = await generateInterviewReport(data);

//       // The API function already returns response.data
//       const generatedReport = response?.interviewReport;

//       if (!generatedReport) {
//         console.error('Unexpected backend response:', response);
//         throw new Error('Interview report was not returned by the server');
//       }

//       setReport(generatedReport);

//       return generatedReport;
//     } catch (error) {
//       console.error('Interview generation failed:', error.response?.data || error.message);

//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getReportById = async (interviewId) => {
//     setLoading(true);
//     let response = null;
//     try {
//       response = await getInterviewReportById(interviewId);
//       setReport(response.interviewReport);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//     return response.interviewReport;
//   };

//   const getReports = async () => {
//     setLoading(true);
//     let response = null;
//     try {
//       response = await getAllInterviewReports();
//       setReports(response.interviewReports);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }

//     return response.interviewReports;
//   };

//   const getResumePdf = async (interviewReportId) => {
//     setLoading(true);
//     let response = null;
//     try {
//       response = await generateResumePdf({ interviewReportId });
//       const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `resume_${interviewReportId}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (interviewId) {
//       getReportById(interviewId);
//     } else {
//       getReports();
//     }
//   }, [interviewId]);

//   return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf };
// };




import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
} from '../services/interview.api';

import { useContext, useEffect } from 'react';
import { InterviewContext } from '../interview.context';
import { useParams } from 'react-router';

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();

  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }

  const { loading, setLoading, report, setReport, reports, setReports } = context;

  // Generate interview report
  const generateReport = async (data) => {
    try {
      setLoading(true);

      const response = await generateInterviewReport(data);

      const generatedReport = response?.interviewReport;

      if (!generatedReport) {
        console.error('Unexpected backend response:', response);

        throw new Error('Interview report was not returned by the server.');
      }

      setReport(generatedReport);

      return generatedReport;
    } catch (error) {
      console.error('Interview generation failed:', error.response?.data || error.message);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get report by ID
  const getReportById = async (id) => {
    setLoading(true);

    try {
      const response = await getInterviewReportById(id);

      setReport(response.interviewReport);

      return response.interviewReport;
    } catch (error) {
      console.error('Fetching interview report failed:', error.response?.data || error.message);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get all reports
  const getReports = async () => {
    setLoading(true);

    try {
      const response = await getAllInterviewReports();

      setReports(response.interviewReports || []);

      return response.interviewReports || [];
    } catch (error) {
      console.error('Fetching interview reports failed:', error.response?.data || error.message);

      setReports([]);

      return [];
    } finally {
      setLoading(false);
    }
  };

  // Download tailored resume PDF
  const getResumePdf = async (interviewReportId) => {
    setLoading(true);

    try {
      const response = await generateResumePdf({
        interviewReportId,
      });

      const url = window.URL.createObjectURL(
        new Blob([response], {
          type: 'application/pdf',
        })
      );

      const link = document.createElement('a');

      link.href = url;

      link.setAttribute('download', `resume_${interviewReportId}.pdf`);

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Resume PDF download failed:', error.response?.data || error.message);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId).catch(() => {});
    } else {
      getReports();
    }
  }, [interviewId]);

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
  };
};
