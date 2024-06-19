import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const PageForm = () => {
  const [content, setContent] = useState('');

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Retrieve the userId and auth token from localStorage
    const userId = localStorage.getItem('userId');
  
    // Check if userId is available
    if (!userId) {
      window.alert('User is not logged in!');
      return;
    }

    try {
      // Make the API call to add the post
      const response = await axios.post(`/api/Post/add/${userId}`, {
        content,
        userId
      }
      );

      // Check if the post creation was successful
      if (response.status === 201) {
        // Post created successfully, handle success (e.g., show a message, clear the form, etc.)
        console.log('Post created successfully:', response.data);
        window.alert('Post created successfully!');
        setContent(''); // Clear the content field
      } else {
        // Handle unsuccessful post creation
        console.error('Failed to create post:', response.data);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error during post creation:', error);
      window.alert('An error occurred while creating the post. Please try again later.');
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center" style={{ marginTop: '50px' }}>
      <Row className="justify-content-center w-100">
        <Col md="8" className="d-flex flex-column align-items-center">
          <h2>Write a Post</h2>
          <Form onSubmit={handleSubmit} className="w-100">
            <Form.Group controlId="formContent">
              <Form.Label>Post Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={content}
                onChange={handleContentChange}
                placeholder="Write your post here..." 
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId="formFile">
              <Form.Label>Upload Picture or File</Form.Label>
              <Form.Control type="file"  />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button type="submit" className='btn-lg btn-block mb-2'>
                Submit
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PageForm;
