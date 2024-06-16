import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';


const DefineNeeds = () => {
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
          } else {
            console.error('Failed to submit form:', response.statusText);
          }
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      };
    
      return (
        <div style={{ 
          backgroundImage: './img/homeBackground.jpeg', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          padding: '20px', 
          height: '100vh' 
        }}>
    
          <Container>
            <Card style={{ backgroundColor: '#DED8F3', padding: '20px', borderRadius: '10px' }}>
              <Card.Header style={{ textAlign: 'center', backgroundColor: '#7C5ACB', color: 'white' }}>
                <h1>Define Needs</h1>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">Job Title:</Form.Label>
                    <Col sm="10">
                      <Form.Control
                        type="text"
                        name="JobTitle"
                        value={formData.JobTitle}
                        onChange={handleChange}
                        placeholder="Enter job title"
                      />
                    </Col>
                  </Form.Group>
    
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">Job Type:</Form.Label>
                    <Col sm="10">
                      <Form.Control
                        type="text"
                        name="JobType"
                        value={formData.JobType}
                        onChange={handleChange}
                        placeholder="Enter job type"
                      />
                    </Col>
                  </Form.Group>
    
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">Job Location:</Form.Label>
                    <Col sm="10">
                      <Form.Control
                        type="text"
                        name="JobLocation"
                        value={formData.JobLocation}
                        onChange={handleChange}
                        placeholder="Enter job location"
                      />
                    </Col>
                  </Form.Group>
    
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">Job Description:</Form.Label>
                    <Col sm="10">
                      {formData.JobDescription.map((description, index) => (
                        <div key={index} className="mb-2">
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={description.Description}
                            onChange={(e) => handleFieldChange(index, 'JobDescription', e)}
                            placeholder={`Enter description ${index + 1}`}
                          />
                          {index === formData.JobDescription.length - 1 && (
                            <Button
                              variant="outline-primary"
                              className="mt-2"
                              onClick={() => handleAddField('JobDescription')}
                            >
                              Add
                            </Button>
                          )}
                        </div>
                      ))}
                    </Col>
                  </Form.Group>
    
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">Job Responsibilities:</Form.Label>
                    <Col sm="10">
                      {formData.JobResponsibilities.map((responsibility, index) => (
                        <div key={index} className="mb-2">
                          <Form.Control
                            type="text"
                            value={responsibility.Responsibility}
                            onChange={(e) => handleFieldChange(index, 'JobResponsibilities', e)}
                            placeholder={`Enter responsibility ${index + 1}`}
                          />
                          {index === formData.JobResponsibilities.length - 1 && (
                            <Button
                              variant="outline-primary"
                              className="mt-2"
                              onClick={() => handleAddField('JobResponsibilities')}
                            >
                              Add
                            </Button>
                          )}
                        </div>
                      ))}
                    </Col>
                  </Form.Group>
    
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">Skills:</Form.Label>
                    <Col sm="10">
                      {formData.JobSkills.map((skill, index) => (
                        <div key={index} className="mb-2">
                          <Form.Control
                            type="text"
                            value={skill.SkillName}
                            onChange={(e) => handleFieldChange(index, 'JobSkills', e)}
                            placeholder={`Enter skill ${index + 1}`}
                          />
                          {index === formData.JobSkills.length - 1 && (
                            <Button
                              variant="outline-primary"
                              className="mt-2"
                              onClick={() => handleAddField('JobSkills')}
                            >
                              Add
                            </Button>
                          )}
                        </div>
                      ))}
                    </Col>
                  </Form.Group>
    
                  <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Container>
        </div>
      );
    };
 
export default DefineNeeds;