import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Modal, Button } from 'react-bootstrap';
import { FaCalendarAlt, FaInfoCircle, FaArrowRight } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from './Navbar';

const SelectionProcess = () => {
    const [openPositions, setOpenPositions] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [screenedCandidates, setScreenedCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [interviewDate, setInterviewDate] = useState(new Date());

    useEffect(() => {
        const fetchOpenPositions = async () => {
            try {
                const response = await fetch(`http://localhost:5266/api/JobForm/all-open-positions`);
                if (!response.ok) {
                    throw new Error('Failed to fetch open positions');
                }
                const data = await response.json();
                setOpenPositions(data);
            } catch (error) {
                console.error('Error fetching open positions:', error);
            }
        };

        fetchOpenPositions();
    }, []);

    useEffect(() => {
        // Initialize the screened candidates with acceptance status from localStorage
        if (selectedJobId) {
            const fetchScreenedCandidates = async () => {
                try {
                    const response = await fetch(`http://localhost:5266/api/OpenPosCV/screened/${selectedJobId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch screened candidates');
                    }
                    const data = await response.json();
                    // Initialize the acceptance status for each candidate from localStorage
                    const candidatesWithAcceptance = data.map(candidate => ({
                        ...candidate,
                        accepted: localStorage.getItem(`accepted_${candidate.id}`) === 'true', // Retrieve from localStorage
                    }));
                    setScreenedCandidates(candidatesWithAcceptance);
                } catch (error) {
                    console.error('Error fetching screened candidates:', error);
                }
            };

            fetchScreenedCandidates();
        }
    }, [selectedJobId]);

    const handleJobSelect = async (event) => {
        const jobId = event.target.value;
        setSelectedJobId(jobId);
    };

    const handleToggleTelephoneInterview = async (cvId) => {
        try {
            const response = await fetch(`http://localhost:5266/api/OpenPosCV/${selectedJobId}/${cvId}/toggle-telephone-interview`, {
                method: 'PUT', // Change from POST to PUT
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to toggle telephone interview');
            }
    
            const updatedCandidates = screenedCandidates.map(candidate => {
                if (candidate.id === cvId) {
                    const newAcceptedStatus = !candidate.accepted;
                    localStorage.setItem(`accepted_${cvId}`, newAcceptedStatus); // Store in localStorage
                    return { ...candidate, accepted: newAcceptedStatus };
                }
                return candidate;
            });
    
            setScreenedCandidates(updatedCandidates);
        } catch (error) {
            console.error('Error toggling telephone interview:', error);
        }
    };
    

    const handleShowContactInfo = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5266/api/OpenPosCV/${userId}/contact-info`);
            if (!response.ok) {
                throw new Error('Failed to fetch contact info');
            }
            const data = await response.json();
            setSelectedCandidate(data);
            setShowContactModal(true);
        } catch (error) {
            console.error('Error fetching contact info:', error);
        }
    };

    const handleCloseContactModal = () => {
        setSelectedCandidate(null);
        setShowContactModal(false);
    };

    const handleSetInterviewDate = async () => {
        if (!selectedCandidate) {
            console.error('No candidate selected');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5266/api/OpenPosCV/${selectedCandidate.id}/jobform/${selectedJobId}/set-telephone-interview-date`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    interviewDate: interviewDate.toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to set interview date');
            }

            console.log('Interview date set successfully');
            setShowDatePicker(false);
        } catch (error) {
            console.error('Error setting interview date:', error);
        }
    };

    const handleDateChange = (date) => {
        setInterviewDate(date);
    };

    return (
        <Container>
            <Navbar userType="hr" />
            <Row className="mb-4" style={{ padding: '30px' }}>
                <Col>
                    <Form.Select onChange={handleJobSelect}>
                        <option>Select Job Title</option>
                        {openPositions.map((position) => (
                            <option key={position.jobId} value={position.jobId}>
                                {position.jobTitle}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                {screenedCandidates.map((candidate) => (
                    <Col key={candidate.id} md={12} className="mb-4">
                        <Card>
                            <Card.Body className="d-flex align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    checked={candidate.accepted}
                                    onChange={() => handleToggleTelephoneInterview(candidate.id)}
                                    label={candidate.userFullName}
                                />
                                <div className="ms-auto d-flex align-items-center">
                                    <FaCalendarAlt
                                        className="mx-2"
                                        style={{ cursor: 'pointer', color: '#7C5ACB' }}
                                        onClick={() => { setSelectedCandidate(candidate); setShowDatePicker(true); }}
                                    />
                                    <FaInfoCircle
                                        className="mx-2"
                                        style={{ cursor: 'pointer', color: '#7C5ACB' }}
                                        onClick={() => handleShowContactInfo(candidate.userId)}
                                    />
                                    
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {selectedCandidate && (
                <Modal show={showContactModal} onHide={handleCloseContactModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Contact Info</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Full Name:</strong> {selectedCandidate.fullName}</p>
                        <p><strong>Email:</strong> {selectedCandidate.email}</p>
                        <p><strong>Phone Number:</strong> {selectedCandidate.phoneNumber}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseContactModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {showDatePicker && selectedCandidate && (
                <Modal show={true} onHide={() => setShowDatePicker(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Set Interview Date and Time</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <DatePicker
                            selected={interviewDate}
                            onChange={handleDateChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            timeCaption="time"
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleSetInterviewDate}>
                            Set Date
                        </Button>
                        <Button variant="secondary" onClick={() => setShowDatePicker(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default SelectionProcess;
