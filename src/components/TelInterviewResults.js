import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Modal, Button } from 'react-bootstrap';
import { FaInfoCircle } from 'react-icons/fa';
import Navbar from './Navbar'; // Adjust the import path as per your project structure
import AcceptedCandidatesTableJf from './AcceptedCandidatesTableJf';

const TelInterviewResults = () => {
    const [openPositions, setOpenPositions] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);

    useEffect(() => {
        // Fetch all open positions
        const fetchOpenPositions = async () => {
            const userId = localStorage.getItem('userId');
            try {
                const response = await fetch(`http://localhost:5266/api/JobForm/OpenPos/${userId}`);
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
            const response = await fetch(`http://localhost:5266/api/OpenPosCV/telephone-interview-passed/${jobId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch passed candidates');
            }
            const data = await response.json();
    
    
            
        } catch (error) {
            console.error('Error fetching passed candidates and interview dates:', error);
        }
    };

   
    return (
        <Container>
            <Navbar userType="hr" /> {/* Ensure Navbar is within Router to enable routing */}
            <Row className="mb-4" style={{padding:"25px"}}>
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
            {selectedJobId &&
            <AcceptedCandidatesTableJf jobId={selectedJobId} />}
            </Container>
)};

export default TelInterviewResults;
