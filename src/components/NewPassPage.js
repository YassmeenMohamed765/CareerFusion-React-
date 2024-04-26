import React, { useState } from 'react';
import "./authentication.css";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const NewPassPage = () => {
    const [enteredPass, setEnteredPass] = useState('');
    const [confPass, setConfPass] = useState('');

    const handleVerify = (e) => {
      e.preventDefault();
  
      console.log('Entered Pass:', enteredPass, ' Confirmed Pass:', confPass);
    };

    return ( 
      <section className="vh-100">
      <Container className="py-5 h-100">
        <Row className="d-flex align-items-center justify-content-center h-100">
          <Col md={6}>
            <img src={process.env.PUBLIC_URL + '/images/NewPass.png'} className="img-fluid" alt="NewPass" />
          </Col>
          <Col md={6}>
            <div className="newPass-content">
              <div className="text-content">
                {/* <h2>Reset Password</h2> */}
                <Form onSubmit={handleVerify}>
                  <Form.Group className="mb-3">
                    <Form.Label>Enter New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={enteredPass}
                      onChange={(e) => setEnteredPass(e.target.value)}
                      placeholder="Enter New Password"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confPass}
                      onChange={(e) => setConfPass(e.target.value)}
                      placeholder="Confirm Password"
                    />
                  </Form.Group>
                  <Row>
                  <Button type="submit" variant="primary" className="btn-lg btn-block">Save</Button>
                  </Row>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

      );
}
 
export default NewPassPage;