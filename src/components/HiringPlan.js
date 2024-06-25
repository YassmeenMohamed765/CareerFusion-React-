import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Accordion, Button } from 'react-bootstrap';
import Navbar from "./Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; // Import the CSS file
import './HiringPlan.css';

const HiringPlan = () => {
  const navigate = useNavigate();
  const [showHiringNeeds, setShowHiringNeeds] = useState(false);
  const [showStrategies, setShowStrategies] = useState(false);

  return (
    <div>
      <Navbar userType="hr" />
      <div className="hiring-plan-content">
        <Container>
          <Card style={{ backgroundColor: '#DED8F3', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' }}>
            <Card.Header style={{ textAlign: 'center', backgroundColor: '#7C5ACB', color: 'white' }}>
              <h1>Hiring Plan</h1>
            </Card.Header>
            <Card.Body>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header onClick={() => navigate('/setTimeline')}>
                    <i className="fa-solid fa-calendar-days"></i>
                    <span> Set Timeline</span>
                  </Accordion.Header>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header onClick={() => setShowHiringNeeds(!showHiringNeeds)}>
                    <i className="fa-solid fa-briefcase"></i>
                    <span> Hiring Needs</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    {showHiringNeeds && (
                      <div>
                        <Button variant="link" href="/define-needs">Define Needs</Button>
                        <Button variant="link" href="/openPositions">Open Positions</Button>
                      </div>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header onClick={() => setShowStrategies(!showStrategies)}>
                    <i className="fa-solid fa-lightbulb"></i>
                    <span> Available Strategies</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    {showStrategies && (
                      <div>
                        <Button variant="link" href="/write-post">Write Post</Button>
                        <Button variant="link" href="/existing-cvs">Existing CVs</Button>
                      </div>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default HiringPlan;
