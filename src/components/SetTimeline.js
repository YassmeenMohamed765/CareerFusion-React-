import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SetTimeline.css';

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
            const response = await fetch(`/api/HiringTimeline/GetTimelinesForUser/${userId}`);
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
            const response = await fetch(`/api/HiringTimeline/SetTimeline/${userId}`, {
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
            const response = await fetch(`/api/HiringTimeline/UpdateTimelineStage/${userId}/${stageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: updatedTimeline.description,
                    startTime: startTime,
                    endTime: endTime
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
            const response = await fetch(`/api/HiringTimeline/DeleteTimelineStage/${userId}/${stageId}`, {
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
        const formattedStartDate = new Date(timelineToEdit.startTime).toISOString().split('T')[0];
        const formattedEndDate = new Date(timelineToEdit.endTime).toISOString().split('T')[0];

        setUpdatedTimeline({
            description: timelineToEdit.description,
            startDate: formattedStartDate,
            endDate: formattedEndDate
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedTimeline(prevTimeline => ({
            ...prevTimeline,
            [name]: value,
        }));
    };

    return (
       <Container fluid>
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
                        <Button variant="primary" onClick={addTimeline} className="custom-button mt-3" >
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
                        <div className="section-title" onClick={toggleTimelinesVisibility}>
                            <span>Timelines</span>
                            <i className={`arrow ${timelinesVisible ? 'down' : 'up'}`}></i>
                        </div>
                        <div className={`section-content ${timelinesVisible ? '' : 'hidden'}`}>
                            {timelines.map(timeline => (
                                <div key={timeline.stageId} className="timeline-item p-2 border-bottom">
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
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                className="mb-2"
                                            />
                                            <Form.Control
                                                type="date"
                                                name="endDate"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                className="mb-2"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <div><strong>Description:</strong> {timeline.description}</div>
                                            <div><strong>Start Date:</strong> {new Date(timeline.startTime).toLocaleDateString()}</div>
                                            <div><strong>End Date:</strong> {new Date(timeline.endTime).toLocaleDateString()}</div>
                                        </>
                                    )}
                                    <Button variant="secondary" onClick={() => {
                                        if (editableTimelineId === timeline.stageId) {
                                            updateTimeline(timeline.stageId);
                                            setEditableTimelineId(null);
                                        } else {
                                            handleEditClick(timeline.stageId);
                                        }
                                    }} className="me-2">
                                        {editableTimelineId === timeline.stageId ? 'Save' : 'Edit'}
                                    </Button>
                                    <Button variant="danger" onClick={() => deleteTimeline(timeline.stageId)}>Delete</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default NewSetTimeline;
