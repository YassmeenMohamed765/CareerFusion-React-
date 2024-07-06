import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Modal, Form, Table } from 'react-bootstrap';
import { FaFileUpload, FaFileWord, FaFileExcel } from 'react-icons/fa';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './post.css';
import Navbar from './Navbar';

const CVScreeningJF = () => {
  const { postId } = useParams();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [position, setPosition] = useState('');
  const [skills, setSkills] = useState(['']);
  const [matchedCVs, setMatchedCVs] = useState([]);
  const [emails, setEmails] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [screeningCompleted, setScreeningCompleted] = useState(false); // Add state for screening completion
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchMatchedCVs();
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5266/api/JobForm/all-open-positions');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleJobSelect = (selectedJobId) => {
    setSelectedJobId(selectedJobId);
    setMatchedCVs([]);
    setScreeningCompleted(false); // Reset screening completion flag
  };

  const handleFileSelect = (event) => {
    setSelectedFiles([...selectedFiles, ...Array.from(event.target.files)]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('file', file));

    try {
      const response = await axios.post('https://cv-screening.onrender.com/upload-cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Files uploaded successfully:', response.data);
      setShowPositionModal(true);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handlePositionSubmit = async () => {
    try {
      const response = await axios.post('https://cv-screening.onrender.com/enter-positions', { position });
      console.log('Position entered successfully:', response.data);
      setShowPositionModal(false);
      setShowSkillsModal(true);
    } catch (error) {
      console.error('Error entering position:', error);
    }
  };

  const handleSkillsSubmit = async () => {
    try {
      const response = await axios.post('https://cv-screening.onrender.com/match-cvs', { skills });
      console.log('Skills submitted successfully:', response.data);
      setShowSkillsModal(false);
      fetchMatchedCVs();
      setPosition('');
      setSkills(['']);
      setSelectedFiles([]);
      setScreeningCompleted(true); // Update screening completion state
    } catch (error) {
      console.error('Error submitting skills:', error);
    }
  };

  const fetchMatchedCVs = async () => {
    try {
      const response = await axios.get('https://cv-screening.onrender.com/get-matched-cvs');
      const cvs = response.data;
      setMatchedCVs(cvs);
  
      // Extract emails from the matched CVs
      const extractedEmails = cvs.map(cv => cv.contact_info.email);
      setEmails(extractedEmails);
  
      // Send the emails to the PUT endpoint
      await updateScreenedEmails(extractedEmails);
    } catch (error) {
      console.error('Error fetching matched CVs:', error);
    }
  };
  

  const updateScreenedEmails = async (emails) => {
    try {
      const response = await axios.put(`http://localhost:5266/api/OpenPosCV/update-scores-for-screened/${selectedJobId}`, emails, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Screening status updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating screened emails:', error);
    }
  };

  const handleSkillChange = (index, event) => {
    const newSkills = skills.slice();
    newSkills[index] = event.target.value;
    setSkills(newSkills);
  };

  const handleAddSkill = () => {
    setSkills([...skills, '']);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    setSelectedFiles([...selectedFiles, ...Array.from(event.dataTransfer.files)]);
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleExportToExcel = async () => {
    try {
      const response = await axios.get('https://cv-screening.onrender.com/export-to-excel', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'matched_cvs.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  return (
    <div className="container cv-screening-container">
      <Navbar userType="hr" />
      <Card className="my-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          CV Screening
          <Button style={{ backgroundColor: '#7A5AC9'}} onClick={handleBrowseClick}>
            <FaFileUpload className="me-2" />
            Screen CVs
          </Button>
        </Card.Header>
        <Card.Body>
          <Form.Group controlId="jobSelect">
            <Form.Label>Select Job Position</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => handleJobSelect(e.target.value)}
              value={selectedJobId || ''}
            >
              <option value="" disabled>Select a job position</option>
              {jobs.map(job => (
                <option key={job.jobId} value={job.jobId}>{job.jobTitle}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          {selectedFiles.length === 0 ? (
            <div
              className={`wrapper ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="container">
                <h1>Upload a file</h1>
                <div className="upload-container">
                  <div className="border-container">
                    <div className="icons fa-4x">
                      <i className="fas fa-file-image" data-fa-transform="shrink-3 down-2 left-6 rotate--45"></i>
                      <i className="fas fa-file-alt" data-fa-transform="shrink-2 up-4"></i>
                      <i className="fas fa-file-pdf" data-fa-transform="shrink-3 down-2 right-6 rotate-45"></i>
                    </div>
                    <p>Drag and drop files here, or 
                      <label onClick={handleBrowseClick} className="file-browser"> browse </label>
                      your computer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="file-list">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <FaFileWord className="file-icon" />
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
              <Button style={{ backgroundColor: '#7A5AC9'}} onClick={handleFileUpload}> <FaFileUpload  /> Upload CVs </Button>
            </div>
          )}
        </Card.Body>

        <Card.Footer className="d-flex justify-content-between align-items-center">
          <Button style={{ backgroundColor: '#7A5AC9'}} onClick={handleExportToExcel}>
            <FaFileExcel className="me-2" />
            Export Results
          </Button>
        </Card.Footer>
      </Card>

      <Modal show={showPositionModal} onHide={() => setShowPositionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Position</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="position">
            <Form.Label>Position</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPositionModal(false)}>
            Close
          </Button>
          <Button style={{ backgroundColor: '#7A5AC9'}} onClick={handlePositionSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSkillsModal} onHide={() => setShowSkillsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Skills</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {skills.map((skill, index) => (
            <Form.Group key={index} controlId={`skill-${index}`}>
              <Form.Label>Skill {index + 1}</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Enter skill ${index + 1}`}
                value={skill}
                onChange={(e) => handleSkillChange(index, e)}
              />
            </Form.Group>
          ))}
          <Button style={{ backgroundColor: '#7A5AC9'}} onClick={handleAddSkill}>
            Add Skill
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSkillsModal(false)}>
            Close
          </Button>
          <Button style={{ backgroundColor: '#7A5AC9'}} onClick={handleSkillsSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Card className="mt-3">
        <Card.Header>Matched CVs</Card.Header>
        <Card.Body>
          {matchedCVs.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {matchedCVs.map(cv => (
                  <tr key={cv.cvId}>
                    <td>{cv.cvName}</td>
                    <td>{cv.contact_info.email}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No matched CVs found.</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CVScreeningJF;
