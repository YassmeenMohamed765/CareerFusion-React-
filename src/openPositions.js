import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './openPositions.css';

const OpenPositionsPage = () => {
    const [jobs, setJobs] = useState([]);
    const userId = localStorage.getItem('userId');
    const jobId = localStorage.getItem('jobId');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`/api/jobform/OpenPos/${userId}`);
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    return (
        <div className="open-positions">
            <h1 className="page-title">Open Positions</h1>
            <div className="job-boxes-container">
            {jobs.map((job, index) => (
                <div className="job-box" key={index}>
                    <Link to={`/job/${userId}/${jobId}`} style={{ textDecoration: 'none' }}>
                        <h2 className="job-title">{job.jobTitle}</h2>
                    </Link>
                    <hr className="title-line" /> {/* Separate line */}
                    <div className="job-details">
                        <div>
                            <i className="fas fa-briefcase job-icon"></i>
                            <span>{job.jobType}</span>
                        </div>
                        <div>
                            <i className="fas fa-map-marker-alt job-icon"></i>
                            <span>{job.jobLocation}</span>
                        </div>
                    </div>
                </div>
            ))}
            </div>
            
        </div>
    );
};

export default OpenPositionsPage;


