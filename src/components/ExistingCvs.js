import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';
import Navbar from './Navbar';

const ExistingCvs = () => {
  const [cvs, setCvs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5266/api/OpenPosCV/all-cvs')
      .then(response => {
        setCvs(response.data);
      })
      .catch(error => {
        console.error('Error fetching CVs:', error);
      });
  }, []);

  const getCvName = (filePath) => {
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  };

  return (
    <Container>
      <Navbar userType="hr" />
      <div style={{padding:"20px"}}>
        <Row className="my-4">
        {cvs.map(cv => (
          <Col key={cv.userId} xs={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{getCvName(cv.filePath)}</Card.Title>
                <Card.Link href={cv.filePath} target="_blank" rel="noopener noreferrer">
                  Download CV
                </Card.Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row></div>
      
    </Container>
  );
};

export default ExistingCvs;
