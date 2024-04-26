// VerificationPage.js
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import "./authentication.css";

const VerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();

    console.log('Verification code:', verificationCode);
  };

  return (
    <section className="vh-100">
      <Container className="py-5 h-100">
        <Row className="d-flex align-items-center justify-content-center h-100">
          <Col md={6}>
            <img src={process.env.PUBLIC_URL + '/images/verification-image.png'} className="img-fluid" alt="Verification" />
          </Col>
          <Col md={6}>
            <div className="verification-content">
              <div className="text-content">
                <h2>Almost There!</h2>
                <p>
                  Please enter the 5-digit code sent to your email <strong>************@gmail.com</strong> for verification.
                </p>
                <Form onSubmit={handleVerify}>
                  <Form.Group className="mb-3">
                    <Form.Label>Verification Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                     
                    />
                  </Form.Group>
                  <Row>
                  <Button type="submit" variant="primary"className="btn-lg btn-block mb-4">Verify</Button>
                  </Row>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default VerificationPage;
