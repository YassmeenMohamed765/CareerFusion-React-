//import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import "./authentication.css";
const ForgotPassowrd = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    
    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        console.log('Request URL:', `/api/Auth/forgetpassword?email=${encodeURIComponent(email)}`);

    const response = await fetch(`/api/Auth/forgetpassword?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log('Response:', response);
    console.log('Data:', data);

  
        if (response.ok) {
          // Handle success
          setMessage(data.message);
        } else {
          // Handle error
          setMessage(data.message);

          // Display specific validation errors
        if (data.errors) {
            console.log('Validation Errors:', data.errors);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Something went wrong.');
      }
    };


    return ( 
      <section className="vh-100">
      <Container className="py-5 h-100">
        <Row className="d-flex align-items-center justify-content-center h-100">
          <Col>
            <img src={process.env.PUBLIC_URL + '/images/forgotPass.png'} className="img-fluid" alt="Forgot" />
          </Col>
          <Col>
            <div className="forgotPass-content">
              <div>
                {message && <p className='message'>{message}</p>}
              </div>
              <div className="text-content">
                <h2>Forgot Password</h2>
                <p>
                  Provide your email and we will send you a link to reset your password
                </p>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Control type="email" className='mb-3'size='lg' value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Form.Group>
                  <Row>
                  <Button variant="primary"className='"btn-lg btn-block mb-4' type="submit">
                    Reset Password
                  </Button>
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
 
export default ForgotPassowrd;