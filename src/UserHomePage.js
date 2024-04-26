import React, { useState } from 'react';
import Navbar from "./Navbar";
import './styles.css';
import { useNavigate } from 'react-router-dom';


// Mock job data, replace with your actual data fetching logic
const mockJobListings = [
    {
      id: 1,
      company: "Valeo",
      title: "Software Engineer",
      location: "Egypt, Cairo",
      type: "Full-Time",
      describtion:" Describtion : As a software Engineer with Valeo, you will be responsible for designing, developing, and maintaining high-quality software applications. ",
      qualifications:" Qualifications : Bachelor's degree in Computer Science or related field (or equivalent experience)",
      deadline:" Deadline : September 15, 2023"
      
    },
    {
      id: 2,
      company: "IBM",
      title: "Web Developer",
      location: "Egypt, Cairo",
      type: "Full-Time",
      describtion:" Describtion : As a Web Developer with IBM, you will be responsible for designing, developing, and maintaining high-quality web applications. ",
      qualifications:" Qualifications : Bachelor's degree in Computer Science or related field (or equivalent experience)",
      deadline:" Deadline : September 15, 2023"
    },
    // {
    //   id: 3,
    //   company: "Dell Technologies",
    //   title: "Software Engineer",
    //   location: "Egypt, Giza",
    //   type: "Full-Time"
    // }
  ];

const UserHomePage = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [jobListings, setJobListings] = useState([]);
    
    const handleFilterButtonClick = () => {
        setShowFilters(!showFilters);
    };

    const handleApplyFilters = () => {
        // You would fetch and filter your job listings here based on the selected filters
        setJobListings(mockJobListings);
    };
    const navigate = useNavigate();

    const handleJobClick = (jobId) => {
        const jobData = mockJobListings.find(job => job.id === jobId);
        navigate(`/job/${jobId}`, { state: { job: jobData } });
      };
    
    return ( 
        <div className="user-home">
            <Navbar userType="candidate" />
            <div className="welcome">
                <h1>Welcome Home!</h1>
                <div className="search-bar">
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input
                        type="text"
                        placeholder="Search for a job"
                        className="search"
                    />
                </div>
                <button className="filter-toggle-button" onClick={handleFilterButtonClick}>Filter</button>
                {showFilters && (
                    <div className="filter-form">
                        <input 
                            list="locations" 
                            name="location" 
                            className="filter" 
                            placeholder="Enter location or select"
                        />
                        <datalist id="locations">
                            <option value="Cairo" />
                            <option value="Giza" />
                            {/* More predefined locations */}
                        </datalist>
                        
                        <input 
                            list="industries" 
                            name="industry" 
                            className="filter" 
                            placeholder="Enter industry or select"
                        />
                        <datalist id="industries">
                            <option value="Front End" />
                            <option value="Back End" />
                            {/* More predefined industries */}
                        </datalist>
                        
                        <input
                            type="number"
                            name="experience"
                            placeholder="Experience level (years)"
                            className="filter"
                            min="0"
                            max="10"
                        />
                       
                        <button className="filter-button" onClick={handleApplyFilters}>Apply Filters</button>
                    </div>
                    
                
                )}
                {/* Job Listings */}
                <div className="job-listings">
                    {jobListings.map(job => (
                        <div key={job.id} className="job-listing" onClick={() => handleJobClick(job.id)}>
                            <div className="job-company">{job.company}</div>
                            <div className="job-title">Job Title: {job.title}</div>
                            <div className="job-location">Location: {job.location}</div>
                            <div className="job-type">Type: {job.type}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
     );
}

export default UserHomePage;
