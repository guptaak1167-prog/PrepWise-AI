import React, { useState, useRef } from 'react';
import '../style/home.scss';
import { useInterview } from '../hooks/useInterview.js';
import { useNavigate } from 'react-router';
import { logoutUser } from '../services/interview.api.js';


const Home = () => {
  const { loading, generateReport, reports = [] } = useInterview();

  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');

  const resumeInputRef = useRef(null);
  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files?.[0];

    if (!jobTitle.trim()) {
      alert('Please enter the job title.');
      return;
    }

    if (!jobDescription.trim()) {
      alert('Please enter the job description.');
      return;
    }

    if (!resumeFile && !selfDescription.trim()) {
      alert('Please upload your resume or enter your self-description.');
      return;
    }

    try {
      const generatedReport = await generateReport({
        jobTitle: jobTitle.trim(),
        jobDescription: jobDescription.trim(),
        selfDescription: selfDescription.trim(),
        resumeFile,
      });

      // Handle the response returned by the API
      const reportId = generatedReport?.interviewReport?._id || generatedReport?._id;

      if (!reportId) {
        console.error('Unexpected API response:', generatedReport);
        throw new Error('Interview report ID was not returned by the server.');
      }

      navigate(`/interview/${reportId}`);
    } catch (error) {
      console.error('Interview generation failed:', error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Failed to generate interview strategy.'
      );
    }
  };


  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
      alert(error.response?.data?.message || 'Logout failed');
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  return (
    <div className="home-page">
      <header className="page-header">
         <h1>Welcome to Interview Prep</h1>
        <header className="page-header">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>

          <h1>
            Create Your Custom <span className="highlight">Interview Plan</span>
          </h1>

          <p>
            Let our AI analyze the job requirements and your unique profile to build a winning
            strategy.
          </p>
        </header>
      </header>

      <div className="interview-card">
        <div className="interview-card__body">
          {/* Left Panel - Job Description */}
          <div className="panel panel--left">
            <div className="panel__header">
              <span className="panel__icon">💼</span>
              <h2>Target Job Description</h2>
              <span className="badge badge--required">Required</span>
            </div>

            <div className="job-title-section">
              <label className="section-label" htmlFor="jobTitle">
                Target Job Title
              </label>

              <input
                id="jobTitle"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Full Stack Developer Intern"
              />
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="panel__textarea"
              placeholder="Paste the full job description here..."
              maxLength={5000}
            />

            <div className="char-counter">{jobDescription.length} / 5000 chars</div>
          </div>

          <div className="panel-divider" />

          {/* Right Panel - Profile */}
          <div className="panel panel--right">
            <div className="panel__header">
              <span className="panel__icon">👤</span>
              <h2>Your Profile</h2>
            </div>

            {/* Upload Resume */}
            <div className="upload-section">
              <label className="section-label">
                Upload Resume
                <span className="badge badge--best">Best Results</span>
              </label>

              <label className="dropzone" htmlFor="resume">
                <span className="dropzone__icon">☁️</span>
                <p className="dropzone__title">Click to upload or drag &amp; drop</p>
                <p className="dropzone__subtitle">PDF or DOCX (Max 5MB)</p>

                <input
                  ref={resumeInputRef}
                  hidden
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.docx"
                />
              </label>
            </div>

            <div className="or-divider">
              <span>OR</span>
            </div>

            {/* Self Description */}
            <div className="self-description">
              <label className="section-label" htmlFor="selfDescription">
                Quick Self-Description
              </label>

              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                id="selfDescription"
                name="selfDescription"
                className="panel__textarea panel__textarea--short"
                placeholder="Describe your experience, skills, projects and education..."
              />
            </div>

            <div className="info-box">
              <span className="info-box__icon">ℹ️</span>
              <p>
                Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required
                to generate a personalized plan.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="interview-card__footer">
          <span className="footer-info">AI-Powered Strategy Generation • Approx 30s</span>

          <button onClick={handleGenerateReport} className="generate-btn" disabled={loading}>
            ✨ Generate My Interview Strategy
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      {reports.length > 0 && (
        <section className="recent-reports">
          <h2>My Recent Interview Plans</h2>

          <ul className="reports-list">
            {reports.map((report) => (
              <li
                key={report._id}
                className="report-item"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <h3>{report.title || 'Untitled Position'}</h3>

                <p className="report-meta">
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>

                <p className="match-score">Match Score: {report.matchScore ?? 0}%</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="page-footer">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Help Center</a>
      </footer>
    </div>
  );
};

export default Home;
