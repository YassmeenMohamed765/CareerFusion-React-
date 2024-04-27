import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './UserHome.css';

const OpenPositionCard = ({ title, description }) => {
  return (
    <Card>
      <Card.Img variant="top" className="img-responsive" src="https://placehold.it/150x80?text=IMAGE" style={{ width: '100%' }} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Button variant="primary">Apply</Button>
      </Card.Body>
    </Card>
  );
}

const OpenPositionsPage = () => {
  const positions = [
    { title: 'Software Engineer', description: 'A software engineer is responsible for designing, developing, and testing software applications. They work with programming languages, frameworks, and tools to create functional software solutions.' },
    { title: 'Web Developer', description: 'A web developer specializes in creating and maintaining websites and web applications. They use languages like HTML, CSS, and JavaScript to build user-friendly and interactive web experiences.' },
    { title: 'Data Analyst', description: 'A data analyst collects, processes, and analyzes data to provide insights and support decision-making. They use statistical methods and software tools to interpret data and present findings.' },
    // Add more position objects as needed
    { title: 'Data Analyst', description: 'A data analyst collects, processes, and analyzes data to provide insights and support decision-making. They use statistical methods and software tools to interpret data and present findings.' },
    // Add more position objects as needed
  ];

  return (
    <Container fluid className="bg-3 text-center mt-3">
      <h2 className="font-weight-bold" style={{ color: '#7A5AC9' }}>Open Positions</h2>
      <Row className="justify-content-md-center">
        {positions.map((position, index) => (
          <Col key={index} sm={3} className="mb-3">
            <OpenPositionCard title={position.title} description={position.description} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default OpenPositionsPage;
