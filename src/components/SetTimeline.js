import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SetTimeline.css';
import Navbar from "./Navbar";
import { FaEdit, FaTrash } from 'react-icons/fa';

function NewSetTimeline() {
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [timelines, setTimelines] = useState([]);
    const [timelinesVisible, setTimelinesVisible] = useState(true);
    const [editableTimelineId, setEditableTimelineId] = useState(null);
    const [updatedTimeline, setUpdatedTimeline] = useState({ description: '', startDate: '', endDate: '' });
    const [showMessage, setShowMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchTimelines();
    }, []);

    const fetchTimelines = async () => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:5266/api/HiringTimeline/GetTimelinesForUser/${userId}`);
            const timelinesData = await response.json();
            setTimelines(timelinesData);
        } catch (error) {
            console.error('Error fetching timelines:', error);
        }
    };

    const addTimeline = async () => {
        const userId = localStorage.getItem('userId');
        const requestBody = {
            "Stages": [
                {
                    "Description": description,
                    "StartTime": startTime,
                    "EndTime": endTime
                }
            ]
        };

        try {
            const response = await fetch(`http://localhost:5266/api/HiringTimeline/SetTimeline/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Failed to add timeline');
            }
            setDescription('');
            setStartTime('');
            setEndTime('');

            setSuccessMessage('Timeline added successfully');
            setShowMessage(true);

            fetchTimelines();
        } catch (error) {
            console.error('Error adding timeline:', error);
        }
    };

    const handleMessageBoxClose = () => {
        setShowMessage(false);
        setSuccessMessage('');
    };

    const updateTimeline = async (stageId) => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:5266/api/HiringTimeline/UpdateTimelineStage/${userId}/${stageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: updatedTimeline.description,
                    startTime: updatedTimeline.startDate,
                    endTime: updatedTimeline.endDate
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update timeline');
            }

            fetchTimelines();
        } catch (error) {
            console.error('Error updating timeline:', error);
        }
    };

    const deleteTimeline = async (stageId) => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:5266/api/HiringTimeline/DeleteTimelineStage/${userId}/${stageId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete timeline');
            }

            fetchTimelines();
        } catch (error) {
            console.error('Error deleting timeline:', error);
        }
    };

    const toggleTimelinesVisibility = () => {
        setTimelinesVisible(!timelinesVisible);
    };

    const handleEditClick = (timelineId) => {
        setEditableTimelineId(timelineId);
        const timelineToEdit = timelines.find(timeline => timeline.stageId === timelineId);
        const formattedStartDate = timelineToEdit.startTime.split('T')[0];
        const formattedEndDate = timelineToEdit.endTime.split('T')[0];

        setUpdatedTimeline({
            description: timelineToEdit.description,
            startDate: formattedStartDate,
            endDate: formattedEndDate
        });

        setStartTime(formattedStartDate);
        setEndTime(formattedEndDate);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedTimeline(prevTimeline => ({
            ...prevTimeline,
            [name]: value,
        }));
    };

    const handleSaveClick = (timelineId) => {
        updateTimeline(timelineId);
        setEditableTimelineId(null);
    };

    return (
        <Container fluid>
            <Navbar userType="hr" />
            <Row>
                <Col md={3} className="bg-light p-3">
                    <h1 className='title'>Set Timeline</h1>
                    <Form>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                                className='form-field'
                            />
                        </Form.Group>
                        <Form.Group controlId="startDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className='form-field'
                            />
                        </Form.Group>
                        <Form.Group controlId="endDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className='form-field'
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={addTimeline} className="custom-button mt-3">
                            Add Timeline
                        </Button>
                        {showMessage && (
                            <div className="message-box mt-3">
                                <p>{successMessage}</p>
                                <Button onClick={handleMessageBoxClose}>OK</Button>
                            </div>
                        )}
                    </Form>
                </Col>
                <Col md={9} className="p-3">
                    <div className="section">
                        <h1 className='timelines-title' onClick={toggleTimelinesVisibility}>
                            Timelines
                        </h1>
                        <div className={`section-content ${timelinesVisible ? '' : 'hidden'}`}>
                            <Row xs={1} md={1} className="g-4">
                                {timelines.map(timeline => (
                                    <Col key={timeline.stageId}>
                                        <Card className="timeline-card">
                                            <Card.Body>
                                                {editableTimelineId === timeline.stageId ? (
                                                    <>
                                                        <Form.Control
                                                            type="text"
                                                            name="description"
                                                            value={updatedTimeline.description}
                                                            onChange={handleInputChange}
                                                            className="mb-2"
                                                        />
                                                        <Form.Control
                                                            type="date"
                                                            name="startDate"
                                                            value={updatedTimeline.startDate}
                                                            onChange={handleInputChange}
                                                            className="mb-2"
                                                        />
                                                        <Form.Control
                                                            type="date"
                                                            name="endDate"
                                                            value={updatedTimeline.endDate}
                                                            onChange={handleInputChange}
                                                            className="mb-2"
                                                        />
                                                        <Button variant="primary" onClick={() => handleSaveClick(timeline.stageId)} className="custom-button">
                                                            Save
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Card.Title className="card-title">{timeline.description}</Card.Title>
                                                        <Card.Text>
                                                            <div><strong>Start Date:</strong> {new Date(timeline.startTime).toLocaleDateString()}</div>
                                                            <div><strong>End Date:</strong> {new Date(timeline.endTime).toLocaleDateString()}</div>
                                                        </Card.Text>
                                                        <div className="d-flex justify-content-end">
                                                            <Button variant="link" onClick={() => handleEditClick(timeline.stageId)} className="me-2">
                                                                <FaEdit style={{ color: '#7C5ACB' }} />
                                                            </Button>
                                                            <Button variant="link" onClick={() => deleteTimeline(timeline.stageId)}>
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
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default NewSetTimeline;
