import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PostView from './PostView';
import Navbar from "./Navbar";
import OpenPositions from './OpenPositions';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-4">
      <Navbar userType="hr" />
      
      <PostView limit={3} />
      <div className="d-flex justify-content-center mt-4">
        <Button variant="outline-secondary" onClick={() => navigate('/postview')}>
          Show More
        </Button>
      </div>
      <OpenPositions/>
    </Container>
  );
};

export default HomePage;
