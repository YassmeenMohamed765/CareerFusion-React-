import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Row, Col } from 'react-bootstrap';
import './OpenPositions.css'; // Ensure this CSS file contains the necessary styles
import Navbar from './Navbar';

const OpenPositions = () => {
    const [jobs, setJobs] = useState([]);
    const userId = localStorage.getItem('userId');

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

    return (
        <div className="open-positions-container" > {/* Renamed with unique class name */}
            <Navbar userType="hr" />
            <Container className="open-positions-content" style ={{paddingTop:"25px"}}> {/* Renamed with unique class name */}
                <h1 className='positions-title'>Open Positions</h1>
                <Row xs={1} md={3} className="g-4 open-positions-row"> {/* Renamed with unique class name */}
                    {jobs.map((job, index) => (
                        <Col key={index} className="open-positions-col"> {/* Renamed with unique class name */}
                            <Card className="open-positions-card"> {/* Renamed with unique class name */}
                                <Card.Img variant="top" src="https://cdn.pixabay.com/photo/2015/07/17/22/42/laptop-849800_1280.jpg" />
                                <Card.Body>
                                    <Link to={`/job/${userId}/${job.jobId}`} className="open-positions-link"> {/* Renamed with unique class name */}
                                        <Card.Title className="open-positions-cardTitle">{job.jobTitle}</Card.Title>
                                    </Link>
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

export default OpenPositions;
