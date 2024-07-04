import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Updated import
import { Container, Card, Row, Col } from 'react-bootstrap';
import './OpenPositions.css';
import Navbar from './Navbar';

const TelephoneForms = () => {
    const [jobs, setJobs] = useState([]);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate(); // Updated usage

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await fetch(`http://localhost:5266/api/jobform/OpenPos/${userId}`);
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleCardClick = (jobId) => {
        navigate(`/add-questions/${userId}/${jobId}`); // Updated usage
    };

    return (
        <div style={{ padding: '40px', height: '80vh' }}>
            <Container>
                <Navbar userType="hr" />
                <h1 className='positions-title'>Open Positions</h1>
                <Row xs={1} md={3} className="g-4 justify-content-center">
                    {jobs.map((job, index) => (
                        <Col key={index} className="d-flex justify-content-center">
                            <Card 
                                style={{ backgroundColor: '#DED8F3', padding: '20px', borderRadius: '10px', cursor: 'pointer' }} 
                                onClick={() => handleCardClick(job.jobId)}
                            >
                                <Card.Img variant="top" src="https://cdn.pixabay.com/photo/2015/07/17/22/42/laptop-849800_1280.jpg" />
                                <Card.Body>
                                    <Card.Title style={{color:"#7C5ACB"}}>{job.jobTitle}</Card.Title>
                                    <Card.Text>
                                        <div>
                                            <i className="fas fa-briefcase job-icon"></i>
                                            <span>{" " + job.jobType}</span>
                                        </div>
                                        <div>
                                            <i className="fas fa-map-marker-alt job-icon"></i>
                                            <span>{" " + job.jobLocation}</span>
                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}

export default TelephoneForms;
