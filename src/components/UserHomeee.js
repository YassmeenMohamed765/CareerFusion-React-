import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './UserHome.css';
import SearchPage from './SearchPage'; 
import RecommendedJobsPage from './RecommendedJobsPage';
import OpenPositionsPage from './OpenPositionsPage';
const UserHomeee = () => {
  return (
    <div>
      <Navbar expand="lg" className="custom-navbar">
        <Container>
          <Navbar.Brand href="#home" className="custom-brand">CareerFusion</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto custom-nav">
              <Nav.Link href="#home" className="active custom-link">Home</Nav.Link>
              <Nav.Link href="#profile" className="custom-link">My Profile</Nav.Link>
              <Nav.Link href="#dashboard" className="custom-link">Dashboard</Nav.Link>
              <NavDropdown title="Notifications" id="basic-nav-dropdown">
                <NavDropdown.Item href="#notification1">Notification1</NavDropdown.Item>
                <NavDropdown.Item href="#notification2">Notification2</NavDropdown.Item>
                <NavDropdown.Item href="#notification3">Notification3</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className=" jumbotron bg-3 text-center jumbotronn jumbotron-fluid ">
        <Container >
          <h1>Welcome Home!</h1>
          <SearchPage />
          
        </Container>
      </div>
      
      <OpenPositionsPage />
      <RecommendedJobsPage />
      <footer className="footer mt-auto py-3">
        <Container>
          <p className="text-center">Footer Text</p>
        </Container>
      </footer>
    </div>
  );
}

export default UserHomeee;
