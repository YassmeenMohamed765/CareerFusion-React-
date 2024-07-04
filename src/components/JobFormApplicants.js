import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaFileAlt } from 'react-icons/fa';
import Navbar from './Navbar';
import './JobFormApplicants.css';

const JobFormApplicants = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await fetch(`http://localhost:5266/api/OpenPosCV/${jobId}/cvs`);
                if (!response.ok) {
                    throw new Error('Failed to fetch applicants');
                }
                const data = await response.json();
                setApplicants(data);
            } catch (error) {
                console.error('Error fetching applicants:', error);
            }
        };

        fetchApplicants();
    }, [jobId]);

    const handleDownloadAllCvs = async () => {
        try {
            const response = await fetch(`http://localhost:5266/api/OpenPosCV/${jobId}/download-cvs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/zip',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to download CVs');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `job_${jobId}_cvs.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error downloading CVs:', error);
        }
    };

    const getCvName = (filePath) => {
        const parts = filePath.split('/');
        return parts[parts.length - 1];
    };

    return (
        <Container>
            <Navbar userType="hr" />
            <div className="text-end mb-4" style={{padding:'20px'}}>
                <Button variant="primary" className="download-button" onClick={handleDownloadAllCvs}>
                    Download All CVs
                </Button>
            </div>
            <Row>
                {applicants.map((applicant, index) => (
                    <Col key={index} md={12} className="mb-4">
                        <Card className="applicant-card" style={{background:'#DED8F3'}}>
                            <Card.Body>
                                <div className="d-flex align-items-center">
                                    <FaFileAlt style={{ color: '#7C5ACB', marginRight: '10px' }} />
                                    <Card.Title className="mb-0" style={{ color: '#000' }}>
                                        {getCvName(applicant.filePath)}
                                    </Card.Title>
                                </div>
                                <a href={applicant.filePath} download className="btn btn-link mt-2">
                                    Download CV
                                </a>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default JobFormApplicants;
