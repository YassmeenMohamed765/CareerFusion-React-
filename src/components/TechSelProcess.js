import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Modal, Button } from 'react-bootstrap';
import { FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from './Navbar';

const TechSelProcess = () => {
    const [openPositions, setOpenPositions] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [screenedCandidates, setScreenedCandidates] = useState([]);
    const [checkedCandidates, setCheckedCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showHrMessageModal, setShowHrMessageModal] = useState(false);
    const [showTechDatePicker, setShowTechDatePicker] = useState(false);
    const [showPhysicalDatePicker, setShowPhysicalDatePicker] = useState(false);
    const [technicalDate, setTechnicalDate] = useState(new Date());
    const [physicalDate, setPhysicalDate] = useState(new Date());
    const [hrMessage, setHrMessage] = useState('');

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
        if (selectedJobId) {
            const fetchScreenedCandidates = async () => {
                try {
                    const response = await fetch(`http://localhost:5266/api/OpenPosCV/telephone-interview-passed/${selectedJobId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch screened candidates');
                    }
                    const data = await response.json();
                    const candidatesWithAcceptance = data.map(candidate => ({
                        ...candidate,
                        accepted: false, // Initially, no candidates are accepted
                    }));
                    setScreenedCandidates(candidatesWithAcceptance);
    
                    // Fetch the list of checked candidates from the server
                    const checkedResponse = await fetch(`http://localhost:5266/api/OpenPosCV/technical-interview-passed-for-jobform/${selectedJobId}`);
                    if (!checkedResponse.ok) {
                        throw new Error('Failed to fetch checked candidates');
                    }
                    const checkedData = await checkedResponse.json();
                    setCheckedCandidates(checkedData.map(candidate => candidate.id));
                } catch (error) {
                    console.error('Error fetching screened candidates:', error);
                }
            };
    
            fetchScreenedCandidates();
        }
    }, [selectedJobId]); // Depend on selectedJobId to trigger the effect
    
    useEffect(() => {
        if (checkedCandidates.length > 0) {
            const updatedCandidates = screenedCandidates.map(candidate => ({
                ...candidate,
                accepted: checkedCandidates.includes(candidate.id),
            }));
            setScreenedCandidates(updatedCandidates);
        }
    }, [checkedCandidates, screenedCandidates]); // Depend on checkedCandidates and screenedCandidates
    
    const handleJobSelect = (event) => {
        const jobId = event.target.value;
        setSelectedJobId(jobId);
    };

    const handleToggleTechnicalInterview = async () => {
        try {
            if (!selectedCandidate) {
                console.error('No candidate selected');
                return;
            }

            const requestBody = {
                passed: !selectedCandidate.accepted,
                hrMessage: hrMessage,
            };

            const response = await fetch(`http://localhost:5266/api/OpenPosCV/${selectedJobId}/${selectedCandidate.id}/toggle-technical-interview`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to toggle technical interview: ${response.status} - ${errorText}`);
            }

            const updatedCandidates = screenedCandidates.map(candidate => {
                if (candidate.id === selectedCandidate.id) {
                    const newAcceptedStatus = !checkedCandidates.includes(candidate.id);
                    return { ...candidate, accepted: newAcceptedStatus };
                }
                return candidate;
            });

            setScreenedCandidates(updatedCandidates);

            const updatedCheckedCandidates = updatedCandidates.filter(candidate => candidate.accepted).map(candidate => candidate.id);
            setCheckedCandidates(updatedCheckedCandidates);
            console.log('Updated checked candidates:', updatedCheckedCandidates);

            setShowHrMessageModal(false);
            setSelectedCandidate(null);
            setHrMessage('');
        } catch (error) {
            console.error('Error toggling technical interview:', error);
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

    const handleShowHrMessageModal = (candidate) => {
        setSelectedCandidate(candidate);
        setShowHrMessageModal(true);
    };

    const handleCloseHrMessageModal = () => {
        setSelectedCandidate(null);
        setShowHrMessageModal(false);
    };

    const handleSetInterviewDates = async () => {
        if (!selectedCandidate) {
            console.error('No candidate selected');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5266/api/OpenPosCV/${selectedCandidate.id}/jobform/${selectedJobId}/set-technical-interview-date`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    technicalAssessmentDate: technicalDate.toISOString(), // Convert date to ISO string
                    physicalInterviewDate: physicalDate.toISOString(), // Convert date to ISO string
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to set interview dates');
            }

            console.log('Interview dates set successfully');
            setShowTechDatePicker(false);
            setShowPhysicalDatePicker(false);
        } catch (error) {
            console.error('Error setting interview dates:', error);
        }
    };

    const handleTechDateChange = (date) => {
        setTechnicalDate(date); // Update technicalDate state
    };

    const handlePhysicalDateChange = (date) => {
        setPhysicalDate(date); // Update physicalDate state
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
                                    onChange={() => handleShowHrMessageModal(candidate)}
                                    label={candidate.userFullName}
                                />
                                <div className="ms-auto d-flex align-items-center">
                                    <FaCalendarAlt
                                        className="mx-2"
                                        style={{ cursor: 'pointer', color: '#7C5ACB' }}
                                        onClick={() => { setSelectedCandidate(candidate); setShowTechDatePicker(true); }}
                                    />
                                    <FaCalendarAlt
                                        className="mx-2"
                                        style={{ cursor: 'pointer', color: '#7C5ACB' }}
                                        onClick={() => { setSelectedCandidate(candidate); setShowPhysicalDatePicker(true); }}
                                    />
                                    <FaInfoCircle
                                        className="mx-2"
                                        style={{ cursor: 'pointer', color: '#7C5ACB' }}
                                        onClick={() => handleShowContactInfo(candidate.userId)}
                                    />
                                </div>
                            </Card.Body>
                            <Card.Body>
                                <div>
                                    <strong>Technical Interview Date: </strong>{candidate.technicalAssessmentDate ? new Date(candidate.technicalAssessmentDate).toLocaleString() : 'Not set'}
                                </div>
                                <div>
                                    <strong>Physical Interview Date: </strong>{candidate.physicalInterviewDate ? new Date(candidate.physicalInterviewDate).toLocaleString() : 'Not set'}
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
            {selectedCandidate && (
                <Modal show={showHrMessageModal} onHide={handleCloseHrMessageModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>HR Message</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formHrMessage">
                            <Form.Label>HR Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={hrMessage}
                                onChange={(e) => setHrMessage(e.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseHrMessageModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleToggleTechnicalInterview}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
            {selectedCandidate && (
                <>
                    <Modal show={showTechDatePicker} onHide={() => setShowTechDatePicker(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Select Technical Interview Date</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <DatePicker selected={technicalDate} onChange={handleTechDateChange} showTimeSelect />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowTechDatePicker(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSetInterviewDates}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={showPhysicalDatePicker} onHide={() => setShowPhysicalDatePicker(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Select Physical Interview Date</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <DatePicker selected={physicalDate} onChange={handlePhysicalDateChange} showTimeSelect />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowPhysicalDatePicker(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSetInterviewDates}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </Container>
    );
};

export default TechSelProcess;
