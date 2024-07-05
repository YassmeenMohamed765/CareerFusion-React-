import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Modal, Form, Table } from 'react-bootstrap';
import { FaFileUpload, FaFileWord, FaFileExcel } from 'react-icons/fa';
import axios from 'axios';
import './post.css';
import Navbar from './Navbar';

const CVScreening = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [position, setPosition] = useState('');
  const [skills, setSkills] = useState(['']);
  const [matchedCVs, setMatchedCVs] = useState([]); // Initialize with an empty array
  const [emails, setEmails] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
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
      const response = await axios.get('/api/JobForm/all-open-positions');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
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
    } catch (error) {
      console.error('Error submitting skills:', error);
    }
  };

  const fetchMatchedCVs = async () => {
    try {
      const response = await axios.get('https://cv-screening.onrender.com/get-matched-cvs');
      const cvs = response.data;
      setMatchedCVs(cvs);
      console.log('Matched CVs:', cvs);

      const extractedEmails = cvs.map(cv => cv.contact_info.email);
      setEmails(extractedEmails);

      await updateScreenedEmails(extractedEmails);
    } catch (error) {
      console.error('Error fetching matched CVs:', error);
    }
  };

  const updateScreenedEmails = async (emails) => {
    try {
      const response = await axios.put(`/api/OpenPosCV/update-scores-for-screened/${selectedJobId}`, emails, {
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
          <Button style={{ backgroundColor: '#7A5AC9' }} onClick={handleBrowseClick}>
            <FaFileUpload className="me-2" />
            Screen CVs
          </Button>
        </Card.Header>
        <Card.Body>
          <Form.Group controlId="jobSelect">
            <Form.Label>Select Job Position</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setSelectedJobId(e.target.value)}
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
              <Button style={{ backgroundColor: '#7A5AC9' }} onClick={handleFileUpload}>
                <FaFileUpload /> Upload CVs
              </Button>
            </div>
          )}
        </Card.Body>

        {/* Position Modal */}
        <Modal show={showPositionModal} onHide={() => setShowPositionModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Enter Position</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="position">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Enter position"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPositionModal(false)}>Close</Button>
            <Button style={{ backgroundColor: '#7A5AC9' }} onClick={handlePositionSubmit}>Submit</Button>
          </Modal.Footer>
        </Modal>

        {/* Skills Modal */}
        <Modal show={showSkillsModal} onHide={() => setShowSkillsModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Enter Skills</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="skills">
                <Form.Label>Skills</Form.Label>
                {skills.map((skill, index) => (
                  <Form.Control
                    key={index}
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e)}
                    placeholder={`Enter skill #${index + 1}`}
                    className="mb-2"
                  />
                ))}
                <Button style={{ backgroundColor: '#7A5AC9' }} onClick={handleAddSkill}>Add Skill</Button>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSkillsModal(false)}>Close</Button>
            <Button style={{ backgroundColor: '#7A5AC9' }} onClick={handleSkillsSubmit}>Submit</Button>
          </Modal.Footer>
        </Modal>

        {/* Matched CVs Table */}
        <Card.Body>
          <Card.Title>Matched CVs</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Skills</th>
              </tr>
            </thead>
            <tbody>
              {matchedCVs.map((cv, index) => (
                <tr key={cv.id}>
                  <td>{index + 1}</td>
                  <td>{cv.name}</td>
                  <td>{cv.contact_info.email}</td>
                  <td>{cv.contact_info.phone}</td>
                  <td>{cv.skills.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>

        {/* Export to Excel Button */}
        <Card.Footer>
          <Button style={{ backgroundColor: '#7A5AC9' }} onClick={handleExportToExcel}>
            <FaFileExcel className="me-2" />
            Export to Excel
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default CVScreening;
