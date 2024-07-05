import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import CandidatesTableJb from './CandidatesTableJb';
import { Container, Row, Col, Card, Form, Modal, Button } from 'react-bootstrap';

const SelectionTable = () => {
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [openPositions, setOpenPositions] = useState([]);
    const [refreshAcceptedCandidates, setRefreshAcceptedCandidates] = useState(false);

    useEffect(() => {
        // Fetch all open positions
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
    
       
    };


  const handleCandidateAccepted = () => {
    setRefreshAcceptedCandidates(!refreshAcceptedCandidates);
  };

  return (
    <Container className="mt-4">
      <Navbar userType="hr" />
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
      {selectedJobId &&
        <CandidatesTableJb jobId={selectedJobId} onCandidateAccepted={handleCandidateAccepted} />}
    </Container>
  );
};

export default SelectionTable;
