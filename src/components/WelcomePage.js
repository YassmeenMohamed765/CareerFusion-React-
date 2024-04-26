import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "./authentication.css";
function WelcomePage() {
  const navigate = useNavigate();

  return (
    <section className="vh-100">
      <Container className="py-5 h-100">
        <Row className="d-flex align-items-center justify-content-center h-100">
          <Col md={8} lg={7} xl={6}>
            <img src={process.env.PUBLIC_URL + '/images/welcome-image.png'} alt="Welcome" className="img-fluid" />
          </Col>
          <Col md={7} lg={5} xl={5} className="offset-xl-1">
            <div >
              <div >
                <div className='mb-5' >
                  <h1 >Welcome to Career Fusion</h1>
                  {/* <h2>where we're dedicated to helping you find the perfect job. Let's unlock your potential together!</h2> */}
                </div>
                <Row className='align-items-center justify-content-center'>
                  <h3 >New User?</h3>
                <Button onClick={() => navigate('/register')} variant="primary" className="btn-lg btn-block mb-2">Create Account</Button>
                </Row>
                <div className="divider d-flex align-items-center my-4">
                  <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
                </div>
                <Row>
                <h3>Already have an account?</h3>
                <Button onClick={() => navigate('/login')} variant="secondary" className="btn-lg btn-block mb-2">Login</Button>
                </Row>
                <div className="divider d-flex align-items-center my-4">
                  <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
                </div>
                <Row>
                <h3>Admin?</h3>
                <Button onClick={() => navigate('/adminLogin')} variant="secondary" className="btn-lg btn-block mb-2">Login As Admin</Button>
                </Row>
                
                
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default WelcomePage;
