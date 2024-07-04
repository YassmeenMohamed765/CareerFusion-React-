import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import Navbar from './Navbar';
import './OpenPositions.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AddQuestions = () => {
    const { userId, jobId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [editQuestion, setEditQuestion] = useState(null);
    const [jobTitle, setJobTitle] = useState('');

    useEffect(() => {
        fetchJobDetails();
    }, [jobId]);

    useEffect(() => {
        if (jobTitle) {
            fetchQuestions();
        }
    }, [jobTitle]);

    const fetchJobDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5266/api/jobform/OpenPos/${userId}`);
            const data = await response.json();
            const job = data.find(j => j.jobId === parseInt(jobId));
            if (job) {
                setJobTitle(job.jobTitle);
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`http://localhost:5266/api/JobForm/getTelephoneInterviewQuestionsByJobTitle/${jobTitle}`);
            if (response.ok) {
                const data = await response.json();
                setQuestions(data);
            } else {
                console.error('Error fetching questions:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleAddQuestion = async () => {
        try {
            const response = await fetch(`http://localhost:5266/api/JobForm/add-telephone-interview-questions/${userId}/${jobId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([{ question: newQuestion, jobTitle }])
            });

            if (response.ok) {
                setShowModal(false);
                setNewQuestion('');
                fetchQuestions();
                alert('Added Successfully');
            } else {
                console.error('Failed to add question');
            }
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    const handleUpdateQuestion = async (id) => {
        try {
            const updatedQuestion = {
                question: editQuestion.question,
                jobTitle: jobTitle
            };
    
            const response = await fetch(`http://localhost:5266/api/JobForm/update-telephone-interview-question?questionId=${id}&jobTitle=${jobTitle}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedQuestion)
            });
    
            if (response.ok) {
                setEditQuestion(null);
                fetchQuestions();
                alert('Updated Successfully');
            } else {
                const errorResponse = await response.json();
                console.error('Failed to update question', response.status, response.statusText, errorResponse);
            }
        } catch (error) {
            console.error('Error updating question:', error);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            const response = await fetch(`http://localhost:5266/api/JobForm/deletetelephoneinterviewquestion/${id}/${jobTitle}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchQuestions();
                alert('Deleted Successfully');
            } else {
                console.error('Failed to delete question');
            }
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    return (
        <Container fluid className="p-4">
            <Navbar userType="hr" />
            <h1 className="positions-title mt-1">Telephone Interview Questions for {jobTitle}</h1>
            <Row xs={1} md={1} className="g-4">
                {questions.map((question) => (
                    <Col key={question.id}>
                        <Card className="timeline-card">
                            <Card.Body>
                                {editQuestion && editQuestion.id === question.id ? (
                                    <>
                                        <Form.Control
                                            type="text"
                                            value={editQuestion.question}
                                            onChange={(e) => setEditQuestion({ ...editQuestion, question: e.target.value })}
                                            className="mb-2"
                                        />
                                        <Button 
                                            variant="primary" 
                                            onClick={() => handleUpdateQuestion(question.id)} 
                                            className="custom-button"
                                        >
                                            Save
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Card.Text className="card-title">{question.question}</Card.Text>
                                        <div className="d-flex justify-content-end">
                                            <Button 
                                                variant="link" 
                                                onClick={() => setEditQuestion(question)} 
                                                className="me-2"
                                            >
                                                <FaEdit style={{ color: '#7C5ACB' }} />
                                            </Button>
                                            <Button 
                                                variant="link" 
                                                onClick={() => handleDeleteQuestion(question.id)}
                                            >
                                                <FaTrash style={{ color: '#7C5ACB' }} />
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className="d-flex justify-content-start mt-3">
                <Button 
                    variant="primary" 
                    onClick={() => setShowModal(true)} 
                    className="custom-button"
                >
                    Add Question
                </Button>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Enter new question"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddQuestion} className="custom-button">
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AddQuestions;
