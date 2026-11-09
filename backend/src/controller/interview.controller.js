const {
  generateInterviewReport,
  generateInterviewReportPdf,
  generateResumePdf,
} = require('../services/ai.service.js');

const InterviewModel = require('../models/interviewReport.model.js');
const mongoose = require('mongoose');
const pdfParse = require('pdf-parse');

// 1. GENERATE AND SAVE INTERVIEW REPORT

async function generateInterviewReportController(req, res) {
  try {
    const { jobTitle, selfDescription, jobDescription } = req.body;

    // Validate required fields
    if (
      typeof jobTitle !== 'string' ||
      !jobTitle.trim() ||
      typeof jobDescription !== 'string' ||
      !jobDescription.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Job title and job description are required.',
      });
    }

    // Extract resume text
    let resumeText = '';

    if (req.file) {
      const parser = new pdfParse.PDFParse({
        data: new Uint8Array(req.file.buffer),
      });

      try {
        const resumeContent = await parser.getText();
        resumeText = resumeContent.text || '';
      } finally {
        await parser.destroy();
      }
    }

    // Require resume or self-description
    if (!resumeText.trim() && !selfDescription?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume or provide a self-description.',
      });
    }

    // Generate AI report
    const interviewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription: selfDescription || '',
      jobDescription: jobDescription.trim(),
    });

    // Validate AI report
    if (!interviewReportByAi) {
      throw new Error('AI returned an empty interview report.');
    }

    // Save report in MongoDB
    const savedInterviewReport = await InterviewModel.create({
      user: req.user.id,

      title: jobTitle.trim(),

      resume: resumeText,

      selfDescription: selfDescription || '',

      jobDescription: jobDescription.trim(),

      matchScore: interviewReportByAi.matchScore,

      technicalQuestions: interviewReportByAi.technicalQuestions,

      behavioralQuestions: interviewReportByAi.behavioralQuestions,

      skillGaps: interviewReportByAi.skillGaps,

      preparationPlan: interviewReportByAi.preparationPlan,
    });

    // Send response
    return res.status(201).json({
      success: true,
      message: 'Interview report generated successfully.',
      interviewReport: savedInterviewReport,
    });
  } catch (error) {
    console.error('Generate Interview Report Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to generate interview report.',
      error: error.message,
    });
  }
}

// 2. GENERATE AND DOWNLOAD INTERVIEW PDF

async function generateInterviewReportPdfController(req, res) {
  try {
    const { jobTitle, selfDescription, jobDescription } = req.body;

    if (
      typeof jobTitle !== 'string' ||
      !jobTitle.trim() ||
      typeof jobDescription !== 'string' ||
      !jobDescription.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Job title and job description are required.',
      });
    }

    // Extract resume
    let resumeText = '';

    if (req.file) {
      const parser = new pdfParse.PDFParse({
        data: new Uint8Array(req.file.buffer),
      });

      try {
        const result = await parser.getText();
        resumeText = result.text || '';
      } finally {
        await parser.destroy();
      }
    }

    if (!resumeText.trim() && !selfDescription?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume or provide a self-description.',
      });
    }

    // Generate report and PDF
    const { report, pdfBuffer } = await generateInterviewReportPdf({
      resume: resumeText,
      selfDescription: selfDescription || '',
      jobDescription: jobDescription.trim(),
    });

    // Save generated report in MongoDB
    const savedReport = await InterviewModel.create({
      user: req.user.id,
      title: jobTitle.trim(),
      resume: resumeText,
      selfDescription: selfDescription || '',
      jobDescription: jobDescription.trim(),

      matchScore: report.matchScore,
      technicalQuestions: report.technicalQuestions,
      behavioralQuestions: report.behavioralQuestions,
      skillGaps: report.skillGaps,
      preparationPlan: report.preparationPlan,
    });

    // Download PDF
    res.setHeader('Content-Type', 'application/pdf');

    res.setHeader('Content-Disposition', 'attachment; filename="interview-report.pdf"');

    res.setHeader('Content-Length', pdfBuffer.length);

    res.setHeader('X-Interview-Report-Id', savedReport._id.toString());

    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error('Generate Interview PDF Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to generate interview PDF.',
      error: error.message,
    });
  }
}

// 3. GET INTERVIEW REPORT BY ID

async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid interview report ID.',
      });
    }

    const interviewReport = await InterviewModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: 'Interview report not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Interview report fetched successfully.',
      interviewReport,
    });
  } catch (error) {
    console.error('Get Interview Report Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch interview report.',
      error: error.message,
    });
  }
}

// 4. GET ALL INTERVIEW REPORTS

async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await InterviewModel.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .select('-resume -selfDescription -jobDescription -__v');

    return res.status(200).json({
      success: true,
      message: 'Interview reports fetched successfully.',
      interviewReports,
    });
  } catch (error) {
    console.error('Get All Interview Reports Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch interview reports.',
      error: error.message,
    });
  }
}

async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewReportId)) {
      return res.status(400).json({
        message: 'Invalid interview report ID',
      });
    }

    const report = await InterviewModel.findOne({
      _id: interviewReportId,
      user: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        message: 'Interview report not found',
      });
    }

    const pdfBuffer = await generateResumePdf({
      resume: report.resume,
      selfDescription: report.selfDescription,
      jobDescription: report.jobDescription,
    });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="tailored-resume.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error('Generate Resume PDF Error:', error);

    return res.status(500).json({
      message: 'Failed to generate resume PDF',
      error: error.message,
    });
  }
}


module.exports = {
  generateInterviewReportController,
  generateInterviewReportPdfController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController
};
