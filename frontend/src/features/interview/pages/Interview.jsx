import React, { useState, useEffect } from 'react';
import '../style/interview.scss';
import { useInterview } from '../hooks/useInterview.js';
import { useParams } from 'react-router';
import { generateResumePdf } from '../services/interview.api.js';

const NAV_ITEMS = [
  {
    id: 'technical',
    label: 'Technical Questions',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: 'behavioral',
    label: 'Behavioral Questions',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 'roadmap',
    label: 'Road Map',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
];

// Question Card
const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="q-card">
      <div className="q-card__header" onClick={() => setOpen((previous) => !previous)}>
        <span className="q-card__index">Q{index + 1}</span>

        <p className="q-card__question">{item.question}</p>

        <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {open && (
        <div className="q-card__body">
          <div className="q-card__section">
            <span className="q-card__tag q-card__tag--intention">Intention</span>
            <p>{item.intention}</p>
          </div>

          <div className="q-card__section">
            <span className="q-card__tag q-card__tag--answer">Model Answer</span>
            <p>{item.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Roadmap Day
const RoadMapDay = ({ day }) => (
  <div className="roadmap-day">
    <div className="roadmap-day__header">
      <span className="roadmap-day__badge">Day {day.day}</span>

      <h3 className="roadmap-day__focus">{day.focus}</h3>
    </div>

    <ul className="roadmap-day__tasks">
      {day.tasks.map((task, index) => (
        <li key={index}>
          <span className="roadmap-day__bullet" />
          {task}
        </li>
      ))}
    </ul>
  </div>
);

// Main Component
const Interview = () => {
  const [activeNav, setActiveNav] = useState('technical');
  const [downloading, setDownloading] = useState(false);

  const { report, getReportById, loading } = useInterview();

  const { interviewId } = useParams();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  // Download tailored resume PDF
  const handleDownloadResume = async () => {
    if (!interviewId || downloading) return;

    try {
      setDownloading(true);

      const blob = await generateResumePdf({
        interviewReportId: interviewId,
      });

      if (!blob || blob.size === 0) {
        throw new Error('The generated PDF is empty.');
      }

      const pdfBlob = new Blob([blob], {
        type: 'application/pdf',
      });

      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');

      link.href = url;
      link.download = 'tailored-resume.pdf';

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Revoke URL after the browser starts downloading
      window.setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error('Resume Download Error:', error);

      // Axios may return backend JSON errors as a Blob
      if (error.response?.data instanceof Blob) {
        const errorText = await error.response.data.text();
        console.error('Backend Error:', errorText);
      } else {
        console.error('Backend Error:', error.response?.data || error.message);
      }

      alert('Unable to download resume. Please check the console for details.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading || !report) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  const scoreColor =
    report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low';

  return (
    <div className="interview-page">
      <div className="interview-layout">
        {/* Left Navigation */}
        <nav className="interview-nav">
          <div className="nav-content">
            <p className="interview-nav__label">Sections</p>

            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`interview-nav__item ${
                  activeNav === item.id ? 'interview-nav__item--active' : ''
                }`}
                onClick={() => setActiveNav(item.id)}
              >
                <span className="interview-nav__icon">{item.icon}</span>

                {item.label}
              </button>
            ))}
          </div>

          {/* Download Resume Button */}
          <button
            onClick={handleDownloadResume}
            disabled={downloading}
            className="button primary-button"
          >
            {downloading ? 'Generating PDF...' : 'Download Resume'}
          </button>
        </nav>

        <div className="interview-divider" />

        {/* Center Content */}
        <main className="interview-content">
          {activeNav === 'technical' && (
            <section>
              <div className="content-header">
                <h2>Technical Questions</h2>

                <span className="content-header__count">
                  {report.technicalQuestions.length} questions
                </span>
              </div>

              <div className="q-list">
                {report.technicalQuestions.map((question, index) => (
                  <QuestionCard key={index} item={question} index={index} />
                ))}
              </div>
            </section>
          )}

          {activeNav === 'behavioral' && (
            <section>
              <div className="content-header">
                <h2>Behavioral Questions</h2>

                <span className="content-header__count">
                  {report.behavioralQuestions.length} questions
                </span>
              </div>

              <div className="q-list">
                {report.behavioralQuestions.map((question, index) => (
                  <QuestionCard key={index} item={question} index={index} />
                ))}
              </div>
            </section>
          )}

          {activeNav === 'roadmap' && (
            <section>
              <div className="content-header">
                <h2>Preparation Road Map</h2>

                <span className="content-header__count">
                  {report.preparationPlan.length}-day plan
                </span>
              </div>

              <div className="roadmap-list">
                {report.preparationPlan.map((day) => (
                  <RoadMapDay key={day.day} day={day} />
                ))}
              </div>
            </section>
          )}
        </main>

        <div className="interview-divider" />

        {/* Right Sidebar */}
        <aside className="interview-sidebar">
          {/* Match Score */}
          <div className="match-score">
            <p className="match-score__label">Match Score</p>

            <div className={`match-score__ring ${scoreColor}`}>
              <span className="match-score__value">{report.matchScore}</span>

              <span className="match-score__pct">%</span>
            </div>

            <p className="match-score__sub">Strong match for this role</p>
          </div>

          <div className="sidebar-divider" />

          {/* Skill Gaps */}
          <div className="skill-gaps">
            <p className="skill-gaps__label">Skill Gaps</p>

            <div className="skill-gaps__list">
              {report.skillGaps.map((gap, index) => (
                <span key={index} className={`skill-tag skill-tag--${gap.severity}`}>
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Interview;
