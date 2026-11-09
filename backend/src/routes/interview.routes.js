const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const interviewController = require('../controller/interview.controller');
const upload = require('../middleware/file.middleware');

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post(
  '/',
  authMiddleware.authCheck,
  upload.single('resume'),
  interviewController.generateInterviewReportController
);



/**
 * @route GET /api/interview/
 * @description get all interview reports for the authenticated user.
 * @access private
 */
interviewRouter.get(
  '/',
  authMiddleware.authCheck,
  interviewController.getAllInterviewReportsController
);

/**
 * @route GET /api/interview/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get(
  '/:interviewId',
  authMiddleware.authCheck,
  interviewController.getInterviewReportByIdController
);

interviewRouter.post('/pdf', authMiddleware.authCheck, upload.single('resume'), interviewController.generateInterviewReportPdfController);

interviewRouter.post(
  '/resume/pdf/:interviewReportId',
  authMiddleware.authCheck,
  interviewController.generateResumePdfController
);

module.exports = interviewRouter;
