import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const JobDetails = () => {
    const { userId, jobId } = useParams();
    const [jobDetails, setJobDetails] = useState(null);
    const [editableSkills, setEditableSkills] = useState([]);
    const [editableResponsibilities, setEditableResponsibilities] = useState([]);
    const [editableDescriptions, setEditableDescriptions] = useState([]);
    const [isEditing, setIsEditing] = useState({ skills: false, responsibilities: false, descriptions: false });
    const [modalInfo, setModalInfo] = useState({ show: false, itemType: '', itemId: null });
    const navigate = useNavigate();

    const fetchJobDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5266/api/JobForm/jobDetails/${userId}/${jobId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch job details');
            }
            const data = await response.json();
            setJobDetails(data);
            setEditableSkills(data.jobSkills.map(skill => ({ ...skill, editedSkill: skill.skillName })));
            setEditableResponsibilities(data.jobResponsibilities.map(responsibility => ({ ...responsibility, editedResponsibility: responsibility.responsibility })));
            setEditableDescriptions(data.jobDescriptions.map(description => ({ ...description, editedDescription: description.description })));
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    useEffect(() => {
        fetchJobDetails();
    }, [userId, jobId]);

    const handleEdit = (type, index) => {
        setIsEditing({ ...isEditing, [type]: index });
    };

    const handleSave = async () => {
        try {
            await Promise.all(editableSkills.map(async (skill) => {
                const response = await fetch(`http://localhost:5266/api/JobForm/updateSkill/${userId}/${jobId}/${skill.id}`, {
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

            await Promise.all(editableResponsibilities.map(async (responsibility) => {
                const response = await fetch(`http://localhost:5266/api/JobForm/updateResponsibility/${userId}/${jobId}/${responsibility.id}`, {
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

            await Promise.all(editableDescriptions.map(async (description) => {
                const response = await fetch(`http://localhost:5266/api/JobForm/updateDescription/${userId}/${jobId}/${description.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ description: description.editedDescription })
                });
                if (!response.ok) {
                    throw new Error('Failed to update description');
                }
            }));

            fetchJobDetails();
        } catch (error) {
            console.error('Error saving changes:', error);
        } finally {
            setIsEditing({ skills: false, responsibilities: false, descriptions: false });
        }
    };

    const handleDelete = async () => {
        const { itemType, itemId } = modalInfo;
        let endpoint = '';
        switch (itemType) {
            case 'skill':
                endpoint = `DeleteJobSkill/${userId}/${jobId}/${itemId}`;
                break;
            case 'responsibility':
                endpoint = `DeleteJobResponsibility/${userId}/${jobId}/${itemId}`;
                break;
            case 'description':
                endpoint = `DeleteJobDescription/${userId}/${jobId}/${itemId}`;
                break;
            default:
                return;
        }
        try {
            const response = await fetch(`http://localhost:5266/api/JobForm/${endpoint}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`Failed to delete ${itemType}`);
            }
            fetchJobDetails();
        } catch (error) {
            console.error(`Error deleting ${itemType}:`, error);
        } finally {
            setModalInfo({ show: false, itemType: '', itemId: null });
        }
    };

    const handleShowApplicants = () => {
        navigate(`/applicants/${jobId}`);
    };

    const handleModalClose = () => setModalInfo({ show: false, itemType: '', itemId: null });
    const handleModalShow = (itemType, itemId) => setModalInfo({ show: true, itemType, itemId });

    if (!jobDetails) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Navbar userType="hr" />
            <h1 className="text-center my-4">{jobDetails.jobTitle}</h1>
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Job Type</Card.Title>
                            <Card.Text>{jobDetails.jobType}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Job Location</Card.Title>
                            <Card.Text>{jobDetails.jobLocation}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Job Responsibilities</Card.Title>
                            {editableResponsibilities.map((responsibility, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                    {isEditing.responsibilities === index ? (
                                        <Form.Control
                                            type="text"
                                            value={responsibility.editedResponsibility}
                                            onChange={(e) => {
                                                const updatedResponsibilities = [...editableResponsibilities];
                                                updatedResponsibilities[index].editedResponsibility = e.target.value;
                                                setEditableResponsibilities(updatedResponsibilities);
                                            }}
                                            className="me-2"
                                        />
                                    ) : (
                                        <Card.Text>{responsibility.editedResponsibility}</Card.Text>
                                    )}
                                    <div>
                                        {isEditing.responsibilities === index ? (
                                            <Button onClick={handleSave} className="me-2">Save</Button>
                                        ) : (
                                            <Button variant="link" onClick={() => handleEdit('responsibilities', index)} className="me-2">
                                                <FaEdit style={{ color: '#7C5ACB' }} />
                                            </Button>
                                        )}
                                        <Button variant="link" onClick={() => handleModalShow('responsibility', responsibility.id)}>
                                            <FaTrash style={{ color: '#7C5ACB' }} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Skills</Card.Title>
                            {editableSkills.map((skill, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                    {isEditing.skills === index ? (
                                        <Form.Control
                                            type="text"
                                            value={skill.editedSkill}
                                            onChange={(e) => {
                                                const updatedSkills = [...editableSkills];
                                                updatedSkills[index].editedSkill = e.target.value;
                                                setEditableSkills(updatedSkills);
                                            }}
                                            className="me-2"
                                        />
                                    ) : (
                                        <Card.Text>{skill.editedSkill}</Card.Text>
                                    )}
                                    <div>
                                        {isEditing.skills === index ? (
                                            <Button onClick={handleSave} className="me-2">Save</Button>
                                        ) : (
                                            <Button variant="link" onClick={() => handleEdit('skills', index)} className="me-2">
                                                <FaEdit style={{ color: '#7C5ACB' }} />
                                            </Button>
                                        )}
                                        <Button variant="link" onClick={() => handleModalShow('skill', skill.id)}>
                                            <FaTrash style={{ color: '#7C5ACB' }} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Job Descriptions</Card.Title>
                            {editableDescriptions.map((description, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                    {isEditing.descriptions === index ? (
                                        <Form.Control
                                            type="text"
                                            value={description.editedDescription}
                                            onChange={(e) => {
                                                const updatedDescriptions = [...editableDescriptions];
                                                updatedDescriptions[index].editedDescription = e.target.value;
                                                setEditableDescriptions(updatedDescriptions);
                                            }}
                                            className="me-2"
                                        />
                                    ) : (
                                        <Card.Text>{description.editedDescription}</Card.Text>
                                    )}
                                    <div>
                                        {isEditing.descriptions === index ? (
                                            <Button onClick={handleSave} className="me-2">Save</Button>
                                        ) : (
                                            <Button variant="link" onClick={() => handleEdit('descriptions', index)} className="me-2">
                                                <FaEdit style={{ color: '#7C5ACB' }} />
                                            </Button>
                                        )}
                                        <Button variant="link" onClick={() => handleModalShow('description', description.id)}>
                                            <FaTrash style={{ color: '#7C5ACB' }} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col className="text-center">
                    <Button variant="primary" onClick={handleShowApplicants} style={{ backgroundColor: '#7C5ACB', borderColor: '#7C5ACB' }}>
                        Show Applicants
                    </Button>
                </Col>
            </Row>

            <Modal show={modalInfo.show} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this {modalInfo.itemType}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default JobDetails;
