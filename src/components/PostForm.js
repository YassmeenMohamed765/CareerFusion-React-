import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Image, Card } from 'react-bootstrap';
import { FaImage } from 'react-icons/fa';
import axios from 'axios';
import './post.css';

const PageForm = () => {
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userId = localStorage.getItem('userId');
  
    if (!userId) {
      window.alert('User is not logged in!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5266/api/Post/add/${userId}', {
        content,
        userId
      });

      if (response.status === 201) {
        window.alert('Post created successfully!');
        setContent('');
        setImagePreview(null);
      } else {
        console.error('Failed to create post:', response.data);
      }
    } catch (error) {
      console.error('Error during post creation:', error);
      window.alert('An error occurred while creating the post. Please try again later.');
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center mt-4">
      <Row className="justify-content-center w-100">
        <Col md="8">
          <Card className="p-4" style={{ borderRadius: '10px' }}>
            <Card.Body>
              <Card.Title className="text-center mb-3">Write Post!</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formContent" className="position-relative mb-3">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Hi, what's on your mind today?"
                    className="bg-light"
                    style={{ padding: '15px 20px', borderRadius: '10px', color: '#616161', fontSize: '16px', letterSpacing: '1px', height: '150px' }}
                  />
                  <FaImage
                    style={{ position: 'absolute', bottom: '10px', right: '10px', cursor: 'pointer', color: '#757575', fontSize: '30px' }}
                    onClick={() => document.getElementById('fileInput').click()}
                  />
                  <Form.Control type="file" id="fileInput" style={{ display: 'none' }} onChange={handleImageChange} />
                </Form.Group>
                {imagePreview && (
                  <div className="mb-3 text-center">
                    <Image src={imagePreview} alt="Selected Image" thumbnail style={{ Width: '100%', height: 'auto', maxHeight: '500px' }} />
                  </div>
                )}
                <div className="d-flex justify-content-center">
                  <Button type="submit" className="btn-block" style={{ borderRadius: '20px', padding: '10px 30px' }}>
                    Post
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PageForm;
