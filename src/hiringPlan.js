import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import Navbar from "./Navbar";
import './hiringPlan';

const HiringPlanPage = () => {
  const [showHiringNeeds, setShowHiringNeeds] = useState(false);
  const [showStrategies, setShowStrategies] = useState(false);
  const navigate = useNavigate();
  // Placeholder for handling the timeline set action
  

  return (
    <div>
      <Navbar userType="hr" />
      <div className="hiring-plan">
        <div className="header">
          <h1>Hiring Plan</h1>
        </div>

         {/* "Set Timeline" section */}
         <div className="section">
          <div className="section-title" onClick={() => navigate('/setTimeline')}>
            <i className="fa-solid fa-calendar-days"></i>
            <span>Set Timeline</span>
            {/* Assuming you have classes like 'fa-chevron-up' and 'fa-chevron-down' for the arrow */}
            <i className={`fa-solid ${showHiringNeeds ? 'up' : 'down'}`}></i>
          </div>
        </div>
        <div className="section">
          <div className="section-title" onClick={() => setShowHiringNeeds(!showHiringNeeds)}>
            <i className="fa-solid fa-briefcase"></i>
            <span>Hiring Needs</span>
            <i className={`arrow ${showHiringNeeds ? 'up' : 'down'}`}></i>
          </div>
          {showHiringNeeds && (
            <div className="section-content">
              <a href="/define-needs" className="link">Define Needs</a>
              <a href="/openPositions" className="link">Open Positions</a>
            </div>
          )}
        </div>

        <div className="section">
          <div className="section-title" onClick={() => setShowStrategies(!showStrategies)}>
            <i className="fa-solid fa-lightbulb"></i>
            <span>Available Strategies</span>
            <i className={`arrow ${showStrategies ? 'up' : 'down'}`}></i>
          </div>
          {showStrategies && (
            <div className="section-content">
              <a href="/write-post" className="link">Write Post</a>
              <a href="/existing-cvs" className="link">Existing CVs</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HiringPlanPage;
