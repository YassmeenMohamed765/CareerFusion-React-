import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import Navbar from './Navbar';
//import './AdminView.css';

const AdminView = () => {
  const { userId } = useParams();

  // State variables
  const [profile, setProfile] = useState({
    fullName: '',
    title: '',
    description: '',
    address: '',
    photo: '',
  });

  const [timelines, setTimelines] = useState([]);
  const [jobs, setJobs] = useState([]);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5266/api/UserProfile/${userId}`);
      const { title, description, address, fullName } = response.data;

      setProfile({
        fullName: fullName || '',
        title: title || '',
        description: description || '',
        address: address || '',
        photo: '',
      });

      const photoResponse = await axios.get(`http://localhost:5266/api/UserProfile/${userId}/profile-picture`);
      if (photoResponse.status === 200 && photoResponse.data.profilePictureUrl) {
        setProfile(prevState => ({
          ...prevState,
          photo: photoResponse.data.profilePictureUrl
        }));
      }
    } catch (error) {
      console.error('Failed to fetch user profile or profile picture:', error);
    }
  };

  // Fetch timelines for user
  const fetchTimelines = async () => {
    try {
      const response = await axios.get(`http://localhost:5266/api/HiringTimeline/GetTimelinesForUser/${userId}`);
      setTimelines(response.data);
    } catch (error) {
      console.error('Error fetching timelines:', error);
    }
  };

  // Fetch open positions for user
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`http://localhost:5266/api/jobform/OpenPos/${userId}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching open positions:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchTimelines();
    fetchJobs();
  }, []);

  return (
    <div className="admin-view">
      <Navbar userType="admin" />
      <Container className="mt-4">
        <Row>
          <Col xl={4}>
            <Card className="mb-4 mb-xl-0">
              <Card.Header>Profile Picture</Card.Header>
              <Card.Body className="text-center">
                <img
                  className="img-account-profile rounded-circle mb-2"
                  src={profile.photo || 'https://via.placeholder.com/150'}
                  alt="Profile"
                />
                {profile.fullName && <div className="profile-fullName">{profile.fullName}</div>}
              </Card.Body>
            </Card>
          </Col>
          <Col xl={8}>
            <Card className="mb-4">
              <Card.Header>Account Details</Card.Header>
              <Card.Body>
                <Row className="mb-4">
                  <Col sm={3}><strong>Full Name</strong></Col>
                  <Col sm={9}><p className="text-muted mb-0">{profile.fullName || 'No full name yet'}</p></Col>
                </Row>
                <hr />
                <Row className="mb-4 mt-2">
                  <Col sm={3}><strong>Title</strong></Col>
                  <Col sm={9}><p className="text-muted mb-0">{profile.title || 'No title yet'}</p></Col>
                </Row>
                <hr />
                <Row className="mb-4 mt-2">
                  <Col sm={3}><strong>Description</strong></Col>
                  <Col sm={9}><p className="text-muted mb-0">{profile.description || 'No description yet'}</p></Col>
                </Row>
                <hr />
                <Row className="mb-4 mt-2">
                  <Col sm={3}><strong>Address</strong></Col>
                  <Col sm={9}><p className="text-muted mb-0">{profile.address || 'No address yet'}</p></Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Card className="mb-4">
              <Card.Header>Timelines</Card.Header>
              <Card.Body>
                {timelines.map(timeline => (
                  <div key={timeline.stageId} className="timeline-item">
                    <p><strong>Description:</strong> {timeline.description}</p>
                    <p><strong>Start Date:</strong> {new Date(timeline.startTime).toLocaleDateString()}</p>
                    <p><strong>End Date:</strong> {new Date(timeline.endTime).toLocaleDateString()}</p>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Card className="mb-4">
              <Card.Header>Open Positions</Card.Header>
              <Card.Body>
                <Row xs={1} md={3} className="g-4 justify-content-center">
                  {jobs.map(job => (
                    <Col key={job.jobId} className="d-flex justify-content-center">
                      <Card style={{ backgroundColor: '#DED8F3', padding: '20px', borderRadius: '10px' }}>
                        <Card.Img variant="top" src="https://cdn.pixabay.com/photo/2015/07/17/22/42/laptop-849800_1280.jpg" />
                        <Card.Body>
                          <Card.Title style={{ color: "#7C5ACB" }}>{job.jobTitle}</Card.Title>
                          <Card.Text>
                            <div><i className="fas fa-briefcase job-icon"></i> {job.jobType}</div>
                            <div><i className="fas fa-map-marker-alt job-icon"></i> {job.jobLocation}</div>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminView;
