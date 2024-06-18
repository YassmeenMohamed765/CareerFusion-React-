import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const PageForm = () => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here (e.g., send data to an API)
    console.log('Content:', content);
    console.log('File:', file);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="8">
          <h2>Write a Post</h2>
          <Form onSubmit={handleSubmit}>
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
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button style={{ backgroundColor: '#7A5AC9', borderColor: '#7A5AC9' }}  variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PageForm;
