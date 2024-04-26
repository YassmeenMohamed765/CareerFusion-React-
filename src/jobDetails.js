import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './jobDetails.css';

const JobDetailsPage = () => {
    const { userId, jobId } = useParams();
    const [jobDetails, setJobDetails] = useState(null);
    const [editableSkills, setEditableSkills] = useState([]);
    const [editableResponsibilities, setEditableResponsibilities] = useState([]);
    const [isEditingSkills, setIsEditingSkills] = useState(false);
    const [isEditingResponsibilities, setIsEditingResponsibilities] = useState(false);

    const fetchJobDetails = async () => {
        try {
            const response = await fetch(`/api/jobform/jobDetails/${userId}/${jobId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch job details');
            }
            const data = await response.json();
            setJobDetails(data);
            setEditableSkills(data.jobSkills.map(skill => ({ ...skill, editedSkill: skill.skillName })));
            setEditableResponsibilities(data.jobResponsibilities.map(responsibility => ({ ...responsibility, editedResponsibility: responsibility.responsibility })));
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    useEffect(() => {
        fetchJobDetails();
    }, [userId, jobId]);

    const handleEditSkills = () => {
        setIsEditingSkills(!isEditingSkills);
    };

    const handleEditResponsibilities = () => {
        setIsEditingResponsibilities(!isEditingResponsibilities);
    };

    const handleSave = async () => {
        try {
            // Update skills
            await Promise.all(editableSkills.map(async (skill) => {
                const response = await fetch(`/api/jobform/updateSkill/${userId}/${jobId}/${skill.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ skillName: skill.editedSkill })
                });
                if (!response.ok) {
                    throw new Error('Failed to update skill');
                }
            }));
            // Update responsibilities
            await Promise.all(editableResponsibilities.map(async (responsibility) => {
                const response = await fetch(`/api/jobform/updateResponsibility/${userId}/${jobId}/${responsibility.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ responsibility: responsibility.editedResponsibility })
                });
                if (!response.ok) {
                    throw new Error('Failed to update responsibility');
                }
            }));
            // Reload job details after updates
            fetchJobDetails();
            alert('Changes saved successfully');
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Failed to save changes');
        } finally {
            // Exit edit mode
            setIsEditingSkills(false);
            setIsEditingResponsibilities(false);
        }
    };

    if (!jobDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="job-details">
            <h1>{jobDetails.jobTitle}</h1>
            <div className="box">
                <h2>Job Responsibilities</h2>
                {isEditingResponsibilities ? (
                    <div>
                        {editableResponsibilities.map((responsibility, index) => (
                            <input
                                key={index}
                                type="text"
                                value={responsibility.editedResponsibility}
                                onChange={(e) => {
                                    const updatedResponsibilities = [...editableResponsibilities];
                                    updatedResponsibilities[index].editedResponsibility = e.target.value;
                                    setEditableResponsibilities(updatedResponsibilities);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div>
                        {editableResponsibilities.map((responsibility, index) => (
                            <p key={index}>{responsibility.editedResponsibility}</p>
                        ))}
                    </div>
                )}
                <button onClick={isEditingResponsibilities ? handleSave : handleEditResponsibilities}>
                    {isEditingResponsibilities ? 'Save' : 'Edit'}
                </button>
            </div>
            <div className="box">
                <h2>Skills</h2>
                {isEditingSkills ? (
                    <div>
                        {editableSkills.map((skill, index) => (
                            <input
                                key={index}
                                type="text"
                                value={skill.editedSkill}
                                onChange={(e) => {
                                    const updatedSkills = [...editableSkills];
                                    updatedSkills[index].editedSkill = e.target.value;
                                    setEditableSkills(updatedSkills);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div>
                        {editableSkills.map((skill, index) => (
                            <p key={index}>{skill.editedSkill}</p>
                        ))}
                    </div>
                )}
                <button onClick={isEditingSkills ? handleSave : handleEditSkills}>
                    {isEditingSkills ? 'Save' : 'Edit'}
                </button>
            </div>
            <div className="box">
                <div className="box-title">
                    <h2>Job Type</h2>
                </div>
                <div className="box-info">
                    <p>{jobDetails.jobType}</p>
                </div>
            </div>
            <div className="box">
                <h2>Job Location</h2>
                <p>{jobDetails.jobLocation}</p>
            </div>
        </div>
    );
};

export default JobDetailsPage;

