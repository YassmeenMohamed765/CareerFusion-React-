import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Nav } from 'react-bootstrap';
import './profile.css';
const BACKEND_BASE_URL = "http://localhost:5266";

const HrProfile = () => {
  const [profile, setProfile] = useState({
    title: '',
    description: '',
    address: '',
    photo: '',
    fullName: '',
  });

  const fetchUserProfile = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await axios.get(`/api/UserProfile/${userId}`);
      const { title, description, address, fullName } = response.data;
  
      setProfile(prevState => ({
        ...prevState,
        title: title || '',
        description: description || '',
        address: address || '',
        fullName: fullName || '',
      }));

      const photoResponse = await axios.get(`/api/UserProfile/${userId}/profile-picture`);
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

  const handleTextChange = (field) => (event) => {
    setProfile({ ...profile, [field]: event.target.value });
  };

  const isFullyQualifiedUrl = (url) => {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  const handlePhotoChange = async (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const userId = localStorage.getItem('userId');
      const uploadUrl = `/api/UserProfile/upload-profile-picture/${userId}`;
      
      const formData = new FormData();
      formData.append('profilePicture', file);

      try {
        const response = await axios.post(uploadUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          alert('Profile picture uploaded successfully!');
          const imagePath = isFullyQualifiedUrl(response.data.imagePath)
            ? response.data.imagePath
            : BACKEND_BASE_URL + response.data.imagePath;
          setProfile(prevState => ({
            ...prevState,
            photo: imagePath
          }));
        } else {
          alert('Failed to upload profile picture.');
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Error uploading profile picture. Check the console for more details.');
      }
    }
  };

  const handleSaveProfile = async () => {
    const userId = localStorage.getItem('userId');
    const updateUrl = `/api/UserProfile/${userId}`;
    const requestBody = {
      ...(profile.title && { Title: profile.title }),
      ...(profile.description && { Description: profile.description }),
      ...(profile.address && { Address: profile.address }),
    };

    try {
      const response = await axios.put(updateUrl, requestBody);
      if (response.status === 200) {
        alert('Profile updated successfully!');
      } else {
        console.error('Failed to update profile:', response.data);
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error);
      alert('Error updating profile. Check the console for more details.');
    }
  };

  return (
    <div>
      
      <Container className="mt-4">
        <Row>
          <Col xl={4}>
            <Card className="mb-4 mb-xl-0">
              <Card.Header>Profile Picture</Card.Header>
              <Card.Body className="text-center">
                <img
                  className="img-account-profile rounded-circle mb-2"
                  src={profile.photo ? `${profile.photo}?${new Date().getTime()}` : 'http://bootdey.com/img/Content/avatar/avatar1.png'}
                  alt="Profile"
                />
                <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
                <Form.Group>
                  <Form.Control type="file" onChange={handlePhotoChange} />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={8}>
            <Card className="mb-4">
              <Card.Header>Profile Details</Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Username (how your name will appear to other users on the site)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      value={profile.fullName}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Job/Career</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Your Job/Career"
                      value={profile.title}
                      onChange={handleTextChange('title')}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Your Description"
                      value={profile.description}
                      onChange={handleTextChange('description')}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Your address"
                      value={profile.address}
                      onChange={handleTextChange('address')}
                    />
                  </Form.Group>
                  <Button
                    type="button"
                    onClick={handleSaveProfile}
                    style={{ backgroundColor: '#7A5AC9', borderColor: '#7A5AC9' }}
                  >
                    Save Changes
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HrProfile;
