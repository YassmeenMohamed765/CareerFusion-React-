// LoginPage.js
import React, { useState } from 'react';
//import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./authentication.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';



function LoginPage ()  {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

 
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    // Make the API call
    const response = await axios.post('http://localhost:5266/api/Auth/token', { email, password });

    // Check if the login was successful
    if (response.status === 200) {
      // The login was successful, you can handle the token or other data here
      console.log('Login successful:', response.data);
      localStorage.setItem('userId', response.data.userId);
      console.log(localStorage.getItem('userId'))
      navigate('/userHome');
      window.alert('Login successful!');
      
    } else {
      // Handle unsuccessful login
      console.error('Login failed:', response.data);
    }
  } catch (error) {
    // Handle network or other errors
    console.error('Error during login:', error);

     // Display a user-friendly error message based on the response status
     if (error.response && error.response.status === 400) {
      console.error('Email or Password is incorrect!');
      window.alert('Email or Password is incorrect!');
    } else {
      console.error('An unexpected error occurred. Please try again later.');
    }
  }
  
};

  
  return (
    <section className="vh-100">
      <Container className="py-5 h-100">
        <Row className="d-flex align-items-center justify-content-center h-100">
          <Col md={8} lg={7} xl={6}>
            <img src={process.env.PUBLIC_URL + '/images/login-image.png'} className="img-fluid" alt="Login" />
          </Col>
          <Col md={7} lg={5} xl={5} className="offset-xl-1">
            <Form onSubmit={handleLogin}>
              {/* Email input */}
              <Form.Group className="mb-4">
                <Form.Label >Email address</Form.Label>
                <Form.Control size='lg'  type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>

              {/* Password input */}
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control size='lg'  type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Row>
              <div className="d-flex justify-content-around align-items-center mb-4">
                {/* Checkbox */}
                <Form.Check type="checkbox" id="form1Example3" label="Remember me" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                <Link to="/forgot-pass" className="text-decoration-none">Forgot password?</Link>
              </div>
              </Row>
              {/* Submit button */}
              <Row>
              <Button type="submit" variant="primary" className="btn-lg btn-block mb-4">Next</Button>
              </Row>
              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
              </div>

              {/* Continue with Facebook */}
              <Row>
              <Button variant="primary" href="#!" className="btn-lg btn-block mb-2" style={{ backgroundColor: '#3b5998' }}>
              <FontAwesomeIcon icon={faGoogle}className="me-2"/>Continue with Google
              </Button>
              </Row>
              <Row>
              {/* Continue with Twitter */}
              <Button variant="primary" href="#!" className="btn-lg btn-block mb-2" style={{ backgroundColor: '#55acee' }}>
              <FontAwesomeIcon icon={faFacebookF}className="me-2" />Continue with Facebook
              </Button>
              </Row>
            </Form>

            <p className="d-flex justify-content-center mt-4">
            Don't have an account?  <Link to="/register">Register now</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default LoginPage;
