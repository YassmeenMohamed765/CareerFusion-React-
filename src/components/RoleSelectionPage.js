import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import "./authentication.css";

function RoleSelectionPage  ()  {
  const navigate = useNavigate();

  const handleRoleSelection = async (role) => {
    const userId = localStorage.getItem('userId');
    // console.log(userId);

    if (!userId) {
      alert("User ID not found. Please register again.");
      navigate('/register'); // Redirect back to registration if the ID is missing
      return;
    }

    try {
      const response = await fetch('/api/Auth/addrole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Ensure the role parameter matches what the backend expects
        body: JSON.stringify({ UserId: userId, Role: role }), 
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to assign role:', errorText);
        alert('Failed to assign role. Please try again.');
        return;
      }

      console.log('Role added successfully!');
      navigate('/hrHome'); // Navigate to the user home page or appropriate page
    } catch (error) {
      console.error('Error during role assignment:', error);
      alert('An error occurred. Please try again.');
    }
  };


  return (
    <section className="vh-100">
      <Container className="py-5 h-100">
        <Row className="d-flex align-items-center justify-content-center h-100">
          <Col>
            <img src={process.env.PUBLIC_URL + '/images/role-selection.png'} className="img-fluid" alt="Role Selection" />
          </Col>
          <Col>
            <div className="form-container">
              <div className="form-content">
                <h1 className="role-prompt mb-4">Choose your role</h1>
                {/* Adjust the button onClick handlers to pass the correct role names */}
                <Row>
                <Button variant="primary"className="btn-lg btn-block mb-3" onClick={() => navigate('/userHome')}>User</Button>
                </Row>
                <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
              </div>
                <Row>
                <Button variant="primary"className="btn-lg btn-block mb-4" onClick={() => handleRoleSelection('HR')}>Corporate HR Department</Button>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RoleSelectionPage;
