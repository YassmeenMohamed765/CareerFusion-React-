import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import "./authentication.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profile, setProfile] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const registrationData = {
      UserName: userName,
      FullName: fullName,
      Email: email,
      Password: password,
      PhoneNumber: phoneNumber,
    };

    try {
      const response = await fetch('http://localhost:5266/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data);
        localStorage.setItem('userId', data.userId);
        setSuccessMessage('Registration successful');
        alert('Registration successful');
        navigate('/role');
      } else {
        setErrorMessage(await response.text());
        console.error('Registration failed:', await response.text());
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (response) => handleGoogleSuccess(response),
    onError: (error) => console.log('Login Failed:', error),
  });

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
          Accept: 'application/json',
        },
      });
      const userData = res.data;
      console.log('Google login successful:', userData);

      const sanitizedUserName = sanitizeUsername(userData.name);
      const generatedPassword = generatePassword();

      const googleRegistrationData = {
        UserName: sanitizedUserName,
        FullName: userData.name,
        Email: userData.email,
        Password: generatedPassword,
      };

      const response = await fetch('http://localhost:5266/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleRegistrationData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Google Registration successful:', data);
        localStorage.setItem('userId', data.userId);
        setSuccessMessage('Google Registration successful');
        alert('Google Registration successful');
        navigate('/role');
      } else {
        setErrorMessage(await response.text());
        console.error('Google Registration failed:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching Google user data:', error);
    }
  };

  const sanitizeUsername = (username) => {
    return username.replace(/[^a-zA-Z0-9]/g, '');
  };

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  };

  return (
    <section className="vh-100">
      <Container className="py-5 h-100">
        <Row className="d-flex align-items-center justify-content-center h-100">
          <Col md={8} lg={7} xl={6}>
            <img src={process.env.PUBLIC_URL + '/images/register-image.png'} className="img-fluid" alt="Register" />
          </Col>
          <Col md={7} lg={5} xl={5} className="offset-xl-1">
            <Form onSubmit={handleRegister}>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              <Form.Group className="mb-2">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>User Name</Form.Label>
                <Form.Control type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <div className="checkbox-container mb-2">
                <Form.Check type="checkbox" checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} label="By checking the box, you agree to our Terms and Conditions" />
              </div>
              <Row>
                <Button type="submit" variant="primary" className="btn-lg btn-block mb-2">Register</Button>
              </Row>
              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
              </div>
              <Row>
                <Button variant="primary" className="btn-lg btn-block mb-2" onClick={() => login()} style={{ backgroundColor: '#db4437' }}>
                  <FontAwesomeIcon icon={faGoogle} className="me-2" />Continue with Google
                </Button>
              </Row>
              <Row>
                <Button variant="primary" href="#!" className="btn-lg btn-block mb-2" style={{ backgroundColor: '#3b5998' }}>
                  <FontAwesomeIcon icon={faFacebookF} className="me-2" />Continue with Facebook
                </Button>
              </Row>
            </Form>
            <p className="d-flex justify-content-center mt-4">
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default RegisterPage;
