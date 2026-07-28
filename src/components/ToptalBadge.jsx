import React from 'react';
import './ToptalBadge.css';

const ToptalBadge = () => {
  return (
    <a 
      href="https://www.toptal.com/developers/resume/zoran-panev#gz1yJW"
      target="_blank"
      rel="noopener noreferrer"
      className="toptal-badge-link"
      aria-label="View my Toptal profile"
      title="Toptal - Top 3% Talent"
    >
      <div className="toptal-badge-compact">
        <svg viewBox="0 0 60 17" className="toptal-logo" xmlns="http://www.w3.org/2000/svg">
          <path d="m20.85 6.38 6.06-.89 2.72-5.49 2.71 5.49 6.06.89-4.39 4.28 1.04 6.03-5.42-2.85-5.43 2.85 1.04-6.03zm33.06 7.17 1.85-.27.82-1.67.83 1.67 1.84.27-1.33 1.31.31 1.83-1.65-.87-1.66.87.32-1.83zm-3.38-3.01-3.61-.52-1.61-3.26-1.62 3.26-3.6.52 2.6 2.55-.61 3.59 3.23-1.69 3.21 1.69-.61-3.59zm-45.19 3.01-1.85-.27-.82-1.67-.83 1.67-1.84.27 1.33 1.31-.31 1.83 1.65-.87 1.65.87-.31-1.83zm3.38-3.01 3.61-.52 1.61-3.26 1.61 3.26 3.61.52-2.6 2.55.61 3.59-3.23-1.69-3.22 1.69.62-3.59z" fill="currentColor"/>
        </svg>
        <span className="toptal-text">Top 3%</span>
      </div>
    </a>
  );
};

export default ToptalBadge;
