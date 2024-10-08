import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaHome, FaUserCircle, FaFileContract, FaChartLine, FaFileAlt, FaChevronDown } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './Navbar.css';

const CustomNavbar = ({ userType }) => {
  const location = useLocation();

  const isHiringPlanActive = ['/setTimeline', '/define-needs', '/openPositions', '/postview', '/existing-cvs'].includes(location.pathname);
  const isRecruitmentActive = ['/cvScreening', '/prepareForms', '/selecProcess', '/viewResults', '/techProcess', '/techResults'].includes(location.pathname);

  const handleLogout = () => {
    // Perform logout actions if needed (e.g., clearing session/local storage)
    // Redirect to login page
    // Example: window.location.href = '/login';
  };

  return (
    <Navbar expand="lg" className="custom-navbar fixed-top">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="custom-brand">
        <i className="fa-solid fa-people-arrows" style={{ color: '#4655f7' }}></i>CareerFusion
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto custom-nav"> {/* Ensure ml-auto for aligning right */}
            {userType === 'hr' && (
              <Nav.Link as={NavLink} to="/home" className="custom-link" activeClassName="active">
                <FaHome style={{ marginRight: '5px', fontSize: '20px' }} /> Home
              </Nav.Link>
            )}
            {userType === 'candidate' && (
              <>
                <Nav.Link as={NavLink} to="/userHome" className="custom-link" activeClassName="active">
                  <FaHome style={{ marginRight: '5px', fontSize: '20px' }} /> Home
                </Nav.Link>
                <Nav.Link as={NavLink} to="/profileview" className="custom-link" activeClassName="active">
                  <FaUserCircle style={{ marginRight: '5px', fontSize: '20px' }} /> My Profile
                </Nav.Link>
                <Nav.Link as={NavLink} to="/dashboard" className="custom-link" activeClassName="active">
                  <FaChartLine style={{ marginRight: '5px', fontSize: '20px' }} /> Dashboard
                </Nav.Link>
              </>
            )}
            {userType === 'hr' && (
              <>
                <Nav.Link as={NavLink} to="/hrprofileview" className="custom-link" activeClassName="active">
                  <FaUserCircle style={{ marginRight: '5px', fontSize: '20px' }} /> My Profile
                </Nav.Link>
                <NavDropdown
                  title={<span><FaFileAlt style={{ marginRight: '5px', fontSize: '20px' }} />Hiring Plan</span>}
                  id="hiring-plan-dropdown"
                  className={`custom-link ${isHiringPlanActive ? 'active' : ''}`}
                >
                  <NavDropdown.Item as={NavLink} to="/setTimeline">
                    Set Timeline
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Header className="dropdown-header">Hiring Needs</NavDropdown.Header>
                  <NavDropdown.Item as={NavLink} to="/define-needs">
                    Define Needs
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/openPositions">
                    Open Positions
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Header className="dropdown-header">Available Strategies</NavDropdown.Header>
                  <NavDropdown.Item as={NavLink} to="/postview">
                    Write Post
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/existing-cvs">
                    Existing CVs
                  </NavDropdown.Item>
                </NavDropdown>
                
                <NavDropdown
                  title={<span><FaFileContract style={{ marginRight: '5px', fontSize: '20px' }} />Recruitment</span>}
                  id="recruitment-dropdown"
                  className={`custom-link ${isRecruitmentActive ? 'active' : ''}`}
                >
                  <NavDropdown.Item as={NavLink} to="/cvScreening">
                    CV Screening
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Header className="dropdown-header">Telephone Interview</NavDropdown.Header>
                  <NavDropdown.Item as={NavLink} to="/prepareForms">
                    Prepare Forms
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/selecProcess">
                    Selection Process
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/viewResults">
                    View Results
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Header className="dropdown-header">Technical Interview</NavDropdown.Header>
                  <NavDropdown.Item as={NavLink} to="/techProcess">
                    Selection Process
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/techResults">
                    View Result
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={NavLink} to="/appraisal" className="custom-link" activeClassName="active">
                  <FaChartLine style={{ marginRight: '5px', fontSize: '20px' }} /> Appraisal
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login" onClick={handleLogout} className="custom-link" style={{color:'red'}}>
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
