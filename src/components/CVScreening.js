import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Modal, Form, Table } from 'react-bootstrap';
import { FaFileUpload, FaFileWord, FaFileExcel } from 'react-icons/fa';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './post.css';

const CVScreening = () => {
  const { postId } = useParams(); // Get the postId from the URL
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [position, setPosition] = useState('');
  const [skills, setSkills] = useState(['']);
  const [matchedCVs, setMatchedCVs] = useState([]);
  const [emails, setEmails] = useState([]); // Store the extracted emails
  const fileInputRef = useRef(null);

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
      const response = await axios.put(`http://localhost:5266/api/CVUpload/update-screened/${postId}`, emails, {
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
      <Card className="my-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          CV Screening
          <Button style={{ backgroundColor: '#7A5AC9'}} onClick={handleBrowseClick}>
            <FaFileUpload className="me-2" />
            Screen CVs
          </Button>
        </Card.Header>
        <Card.Body>
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
            <Button style={{ backgroundColor: '#7A5AC9'}} onClick={handlePositionSubmit}>Submit</Button>
          </Modal.Footer>
        </Modal>

        {/* Skills Modal */}
        <Modal show={showSkillsModal} onHide={() => setShowSkillsModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Enter Skills</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {skills.map((skill, index) => (
                <Form.Group key={index} controlId={`skill${index}`}>
                  <Form.Label>Skill {index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e)}
                    placeholder={`Enter skill ${index + 1}`}
                  />
                </Form.Group>
              ))}
              <Button variant="outline-primary" className="my-3" onClick={handleAddSkill}>Add More</Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSkillsModal(false)}>Close</Button>
            <Button style={{ backgroundColor: '#7A5AC9'}} onClick={handleSkillsSubmit}>Submit</Button>
          </Modal.Footer>
        </Modal>
      </Card>

      {/* Results Card */}
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5>Results of the CV Screening</h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Candidate</th>
                <th>CV</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {matchedCVs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">No CVs matched</td>
                </tr>
              ) : (
                matchedCVs.map((cv, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>Candidate {index + 1}</td>
                    <td>
                      <a href={cv.file_path} target="_blank" rel="noopener noreferrer">Download CV</a>
                    </td>
                    <td>{cv.contact_info.email}</td>
                    <td>{cv.contact_info.phone_number}</td>
                    <td>{cv.position}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end">
          <Button variant="outline-success" onClick={handleExportToExcel}>
            <FaFileExcel className="me-2" />
            Export to Excel
          </Button>
        </Card.Footer>
      </Card>
      </div>
  );
};

export default CVScreening;
