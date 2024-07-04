import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import Navbar from "./Navbar";
// const BACKEND_BASE_URL = "http://localhost:5266";

const HrProfileView = () => {
  const [profile, setProfile] = useState({
    title: '',
    description: '',
    address: '',
    photo: '',
    fullName: '',
  });

  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.get(`http://localhost:5266/api/UserProfile/${userId}`);
      const { title, description, address, fullName } = response.data;

      setProfile({
        title: title || '',
        description: description || '',
        address: address || '',
        fullName: fullName || '',
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

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEditProfile = () => {
    navigate('/hrprofile'); // Adjust the path to match your routing setup
  };

  return (
    <div>
      <Container className="mt-4">
      <Navbar userType="hr" />
        <Row>
          <Col xl={4}>
            <Card className="mb-4 mb-xl-0">
              <Card.Header>Profile Picture</Card.Header>
              <Card.Body className="text-center">
                <Image
                  className="img-account-profile rounded-circle mb-2"
                  src={profile.photo ? `${profile.photo}?${new Date().getTime()}` : 'https://via.placeholder.com/150'}
                  roundedCircle
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
                <Button
                  type="button"
                  onClick={handleEditProfile}
                  style={{ backgroundColor: '#7A5AC9', borderColor: '#7A5AC9' }}
                >
                  Edit Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default HrProfileView;
