import React, { useState } from 'react';
import './hiringPlane.css';
import './defineNeeds.css';

const DefineNeedsPage = () => {
  const [formData, setFormData] = useState({
    JobTitle: '',
    JobType: '',
    JobLocation: '',
    JobSkills: [{ SkillName: '' }],
    JobDescription: [{ Description: '' }],
    JobResponsibilities: [{ Responsibility: '' }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddField = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], { [getFieldName(field)]: '' }],
    }));
  };

  const handleFieldChange = (index, field, e) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = { [getFieldName(field)]: e.target.value };
    setFormData((prevData) => ({
      ...prevData,
      [field]: updatedArray,
    }));
  };

  const getFieldName = (field) => {
    if (field === 'JobSkills') {
      return 'SkillName';
    } else if (field === 'JobDescription') {
      return 'Description';
    } else if (field === 'JobResponsibilities') {
      return 'Responsibility';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const requestBody = {
      ...formData,
    };
    try {
      const response = await fetch(`/api/jobform/add/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const responseData = await response.json();
        const { jobId } = responseData.payload;
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
        savedJobs.push(jobId);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        localStorage.setItem('jobId', jobId);
        console.log('Form submitted successfully');
        alert('Form submitted successfully');
        // Reset form after successful submission if needed
      } else {
        console.error('Failed to submit form:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="hiring-plan define-needs">
      <div className="header">
        <h1>Define Needs</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Job Information */}
        <div className="section">
          <div className="section-title">
            <span>Job Information</span>
          </div>
          <div className="section-content">
            <label htmlFor="jobTitle">Job Title:</label>
            <input
              type="text"
              id="jobTitle"
              name="JobTitle"
              value={formData.JobTitle}
              onChange={handleChange}
              placeholder="Enter job title"
            />

            <label htmlFor="jobType">Job Type:</label>
            <input
              type="text"
              id="jobType"
              name="JobType"
              value={formData.JobType}
              onChange={handleChange}
              placeholder="Enter job type"
            />

            <label htmlFor="jobLocation">Job Location:</label>
            <input
              type="text"
              id="jobLocation"
              name="JobLocation"
              value={formData.JobLocation}
              onChange={handleChange}
              placeholder="Enter job location"
            />

            <label htmlFor="jobDescription">Job Description:</label>
            {formData.JobDescription.map((description, index) => (
    <div className="section-content" key={index}>
      <textarea
        id={`description-${index + 1}`}
        value={description.Description}
        onChange={(e) => handleFieldChange(index, 'JobDescription', e)}
        placeholder={`Enter description ${index + 1}`}
      />
      {index === formData.JobDescription.length - 1 && (
        <button
          type="button"
          onClick={() => handleAddField('JobDescription')}
        >
          Add
        </button>
      )}
    </div>
  ))}
          </div>
        </div>

        {/* Job Responsibilities */}
        <div className="section">
          <div className="section-title">
            <span>Job Responsibilities</span>
          </div>
          {formData.JobResponsibilities.map((responsibility, index) => (
            <div className="section-content" key={index}>
              <label htmlFor={`responsibility-${index + 1}`}>
                Responsibility {index + 1}:
              </label>
              <input
                type="text"
                id={`responsibility-${index + 1}`}
                value={responsibility.Responsibility}
                onChange={(e) =>
                  handleFieldChange(index, 'JobResponsibilities', e)
                }
                placeholder={`Enter responsibility ${index + 1}`}
              />
              {index === formData.JobResponsibilities.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleAddField('JobResponsibilities')}
                >
                  Add
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="section">
          <div className="section-title">
            <span>Skills</span>
          </div>
          {formData.JobSkills.map((skill, index) => (
            <div className="section-content" key={index}>
              <label htmlFor={`skill-${index + 1}`}>Skill {index + 1}:</label>
              <input
                type="text"
                id={`skill-${index + 1}`}
                value={skill.SkillName}
                onChange={(e) => handleFieldChange(index, 'JobSkills', e)}
                placeholder={`Enter skill ${index + 1}`}
              />
              {index === formData.JobSkills.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleAddField('JobSkills')}
                >
                  Add
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="section">
        <div className="section-title">
          <div className="submit-container"> {/* New container for the submit button */}
            <button type="submit">Submit</button>
          </div>
        </div>
      </div>
      </form>
    </div>
  );
};

export default DefineNeedsPage;
