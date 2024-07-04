import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Modal, Button } from 'react-bootstrap';
import { FaInfoCircle } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from './Navbar';

const TechResults = () => {
    const [openPositions, setOpenPositions] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [passedCandidates, setPassedCandidates] = useState([]);
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

    const handleJobSelect = async (event) => {
        const jobId = event.target.value;
        setSelectedJobId(jobId);

        try {
            const response = await fetch(`http://localhost:5266/api/OpenPosCV/technical-interview-passed/${jobId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch passed candidates');
            }
            const data = await response.json();

            // Fetch interview dates for each candidate
            const candidatesWithDates = await Promise.all(data.map(async (candidate) => {
                const dateResponse = await fetch(`http://localhost:5266/api/OpenPosCV/${candidate.id}/jobform/${jobId}/technical-assessment-date`);
                if (!dateResponse.ok) {
                    throw new Error(`Failed to fetch interview date for candidate ${candidate.id}`);
                }
                const dateData = await dateResponse.json();
                candidate.interviewDate = dateData.data; // Assuming dateData.data contains the interview date string
                return candidate;
            }));

            setPassedCandidates(candidatesWithDates);
        } catch (error) {
            console.error('Error fetching passed candidates and interview dates:', error);
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

    const formatDate = (dateString) => {
        if (!dateString) return ''; // Handle case where dateString is undefined or null

        // Assuming dateString is in the format "0001-01-01T00:00:00"
        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return ''; // Handle case where date string is not valid
        }

        // Format the date as month/day/year
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        return formattedDate;
    };

    const handleDateChange = (date) => {
        setInterviewDate(date);
    };

    return (
        <Container>
            <Navbar userType="hr" />
            <h1 className="text-center my-4">Technical Interview Results</h1>
            <Row className="mb-4">
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
                {passedCandidates.map((candidate) => (
                    <Col key={candidate.id} md={4} className="mb-4">
                        <Card>
                            <Card.Body className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title>{candidate.userFullName}</Card.Title>
                                    <p>Interview Date: {formatDate(candidate.interviewDate)}</p>
                                </div>
                                <FaInfoCircle
                                    className="mx-2"
                                    style={{ cursor: 'pointer', color: '#7C5ACB' }}
                                    onClick={() => handleShowContactInfo(candidate.userId)}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Contact Info Modal */}
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
        </Container>
    );
};

export default TechResults;
