import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';

const CustomNavbar = ({ userType }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="/">CareerFusion <i className="fa-solid fa-people-arrows" style={{ color: '#4655f7' }}></i></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {userType === 'hr' && <Nav.Link as={NavLink} to="/hrHome" active={location.pathname === '/hrHome'}><i className="fa-solid fa-house"></i> Home</Nav.Link>}
            {userType === 'candidate' && <Nav.Link as={NavLink} to="/userHome" active={location.pathname === '/userHome'}><i className="fa-solid fa-house"></i> Home</Nav.Link>}
            {userType === 'candidate' && (
              <>
                <Nav.Link as={NavLink} to="/profileview" active={location.pathname === '/profileview'}><i className="fa-regular fa-id-badge"></i> My Profile</Nav.Link>
                <Nav.Link as={NavLink} to="/dashboard" active={location.pathname === '/dashboard'}><i className="fa-solid fa-bars"></i> Dashboard</Nav.Link>
              </>
            )}
            {userType === 'hr' && (
              <>
                <Nav.Link as={NavLink} to="/profileviewhr" active={location.pathname === '/profileviewhr'}><i className="fa-regular fa-id-badge"></i> My Profile</Nav.Link>
                <Nav.Link as={NavLink} to="/hiringPlan" active={location.pathname === '/hiringPlan'}><i className="fa-solid fa-briefcase"></i> Hiring Plan</Nav.Link>
                <Nav.Link as={NavLink} to="/recruitment" active={location.pathname === '/recruitment'}><i className="fa-regular fa-folder-open"></i> Recruitment</Nav.Link>
              </>
            )}
          </Nav>
          <Dropdown align="end">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              <i className="fa-solid fa-bell"></i> Notifications
            </Dropdown.Toggle>

            <Dropdown.Menu show={showNotifications} onClick={closeNotifications}>
              {/* Add your notification items here */}
              <Dropdown.Item href="#/action-1">Notification 1</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Notification 2</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Notification 3</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
