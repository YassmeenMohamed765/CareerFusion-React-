import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Accordion } from 'react-bootstrap';
import axios from 'axios';
import './post.css'; // Import your custom CSS

const PostRecruitment = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleFileUpload = async () => {
    if (selectedFiles) {
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('file', selectedFiles[i]);
      }

      try {
        await axios.post('https://cv-screening.onrender.com/upload-cv', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Files uploaded successfully!');
      } catch (error) {
        console.error('Error uploading files:', error);
        alert('Failed to upload files.');
      }
    } else {
      alert('Please select files to upload.');
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Recruitment</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Body>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <img src="cv-icon.png" alt="CV Screening" className="me-2" />
                    CV Screening
                  </Accordion.Header>
                  <Accordion.Body>
                    <Form.Group controlId="formFile" className="mb-3">
                      <Form.Label>Select CV files to upload</Form.Label>
                      <Form.Control type="file" multiple accept=".doc,.docx" onChange={handleFileChange} />
                    </Form.Group>
                    <Button variant="primary" onClick={handleFileUpload}>Upload CVs</Button>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <img src="phone-icon.png" alt="Telephone Interview" className="me-2" />
                    Telephone Interview
                  </Accordion.Header>
                  <Accordion.Body>
                    <p><a href="#prepare-questions">Prepare questions</a></p>
                    <p><a href="#selection-process">Selection Process</a></p>
                    <p><a href="#view-result">View Result</a></p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    <img src="technical-icon.png" alt="Technical Interview" className="me-2" />
                    Technical Interview
                  </Accordion.Header>
                  <Accordion.Body>
                    <p><a href="#selection-process">Selection Process</a></p>
                    <p><a href="#assign-task">Assign exam/task</a></p>
                    <p><a href="#view-result">View Result</a></p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PostRecruitment;
