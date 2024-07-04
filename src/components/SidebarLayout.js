import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFileAlt, FaFileUpload, FaPhone, FaLaptopCode } from 'react-icons/fa';
import PostDetail from './PostDetail';
import TelephoneInterview from './TelephoneInterview'; // Import your TelephoneInterview component
import CVScreening from './CVScreening'; // Ensure this is the correct import
import TechnicalInterview from './TechnicalInterview'; // Import the new TechnicalInterview component
import './post.css';
import Navbar from './Navbar';

const SidebarLayout = () => {
  const [activeComponent, setActiveComponent] = useState('postDetail');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'postDetail':
        return <PostDetail />;
      case 'cvScreening':
        return <CVScreening />;
      case 'telephoneInterview':
        return <TelephoneInterview />; // Render TelephoneInterview component
      case 'technicalInterview':
        return <TechnicalInterview />; // Render TechnicalInterview component
      default:
        return <PostDetail />;
    }
  };

  return (
    <Container fluid className="recruitment-container">
      <Navbar userType="hr" />
      <Row>
        <Col md={2} className="recruitment-sidebar ms-3">
          <div className={`sidebar-item ${activeComponent === 'postDetail' ? 'active' : ''}`} onClick={() => setActiveComponent('postDetail')}>
            <FaFileAlt className="me-2" /> Your Post
          </div>
          <hr />
          <div className={`sidebar-item ${activeComponent === 'cvScreening' ? 'active' : ''}`} onClick={() => setActiveComponent('cvScreening')}>
            <FaFileUpload className="me-2" /> CV Screening
          </div>
          <hr />
          <div className={`sidebar-item ${activeComponent === 'telephoneInterview' ? 'active' : ''}`} onClick={() => setActiveComponent('telephoneInterview')}>
            <FaPhone className="me-2" /> Telephone Interview
          </div>
          <hr />
          <div className={`sidebar-item ${activeComponent === 'technicalInterview' ? 'active' : ''}`} onClick={() => setActiveComponent('technicalInterview')}>
            <FaLaptopCode className="me-2" /> Technical Interview
          </div>
        </Col>
        <Col md={9} className="recruitment-content">
          {renderComponent()}
        </Col>
      </Row>
    </Container>
  );
};

export default SidebarLayout;
