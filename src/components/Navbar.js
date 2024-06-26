import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './Navbar.css'; // Import the CSS file

const CustomNavbar = ({ userType }) => {
  const location = useLocation();
  
  const isHiringPlanActive = ['/setTimeline', '/define-needs', '/openPositions', '/write-post', '/existing-cvs'].includes(location.pathname);

  return (
    <Navbar expand="lg" className="custom-navbar fixed-top">
      <Container>
        <Navbar.Brand href="/" className="custom-brand">
          <i className="fa-solid fa-people-arrows" style={{ color: '#4655f7' }}></i> CareerFusion
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto custom-nav">
            {userType === 'hr' && (
              <Nav.Link as={NavLink} to="/hrHome" className="custom-link" activeClassName="active">
                Home
              </Nav.Link>
            )}
            {userType === 'candidate' && (
              <Nav.Link as={NavLink} to="/userHome" className="custom-link" activeClassName="active">
                Home
              </Nav.Link>
            )}
            {userType === 'candidate' && (
              <>
                <Nav.Link as={NavLink} to="/profileview" className="custom-link" activeClassName="active">
                  My Profile
                </Nav.Link>
                <Nav.Link as={NavLink} to="/dashboard" className="custom-link" activeClassName="active">
                  Dashboard
                </Nav.Link>
              </>
            )}
            {userType === 'hr' && (
              <>
                <Nav.Link as={NavLink} to="/profileviewhr" className="custom-link" activeClassName="active">
                  My Profile
                </Nav.Link>
                <NavDropdown title="Hiring Plan" id="hiring-plan-dropdown" className={`custom-link ${isHiringPlanActive ? 'active' : ''}`}>
                  <NavDropdown.Item as={NavLink} to="/setTimeline">
                    Set Timeline
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={NavLink} to="/define-needs">
                    Define Needs
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/openPositions">
                    Open Positions
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={NavLink} to="/postview">
                    Write Post
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/existing-cvs">
                    Existing CVs
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={NavLink} to="/recruitment" className="custom-link" activeClassName="active">
                  Recruitment
                </Nav.Link>
              </>
            )}
            <NavDropdown title="Notifications" id="basic-nav-dropdown">
              <NavDropdown.Item href="#notification1">Notification 1</NavDropdown.Item>
              <NavDropdown.Item href="#notification2">Notification 2</NavDropdown.Item>
              <NavDropdown.Item href="#notification3">Notification 3</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
