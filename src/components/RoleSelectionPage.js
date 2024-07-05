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
      const response = await fetch('http://localhost:5266/api/Auth/addrole', {
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
              <h4 className="role-prompt mb-4">We are pleased to inform you that you have been assigned to the Corporate HR Department, effective immediately. We are confident that your skills and experience will be a valuable addition to our team. Welcome to your new role!</h4>
                {/* Adjust the button onClick handlers to pass the correct role names */}
                <Row>
                {/* <Button variant="primary"className="btn-lg btn-block mb-3" onClick={() => navigate('/userHome')}>User</Button> */}
                </Row>
                {/* <div className="divider d-flex align-items-center my-4"> */}
                {/* <p className="text-center fw-bold mx-3 mb-0 text-muted">OR</p> */}
              {/* </div> */}
                <Row>
                <Button variant="primary"className="btn-lg btn-block mb-4" onClick={() => handleRoleSelection('HR')}>Confirm</Button>
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
