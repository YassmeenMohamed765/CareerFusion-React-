import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import "./authentication.css";


const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if email and password match desired values
    if (email === 'hagarsami84@gmail.com' && password === 'Admin2024**') {
      navigate('/adminP');
      return;
    }

    // If email or password is incorrect, show error message
    window.alert('Email or Password is incorrect!');
  };

  return (
    <section className="vh-100">
      <Container className="py-5 h-100">
        <Row className="d-flex align-items-center justify-content-center h-100">
          <Col md={8} lg={7} xl={6}>
            <img src={process.env.PUBLIC_URL + '/images/admin-login.png'} className="img-fluid" alt="Login" />
          </Col>
          <Col md={7} lg={5} xl={5} className="offset-xl-1">
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-4">
                <Form.Label>Email address</Form.Label>
                <Form.Control size="lg" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control size="lg" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <div className="d-flex justify-content-around align-items-center mb-4">
                <Form.Check type="checkbox" id="form1Example3" label="Remember me" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                <Link to="/forgot-pass" className="text-decoration-none">Forgot password?</Link>
              </div>
              <Row>
              <Button type="submit" variant="primary" className="btn-lg btn-block mb-4">Next</Button>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AdminLogin;
