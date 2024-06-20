import React, { useState } from 'react';
import { Form, Button, Container, Image, Card } from 'react-bootstrap';
import axios from 'axios';

const PageForm = () => {
  const [formData, setFormData] = useState({
    content: '',
    imagePreview: null,
    image: null,
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' || name === 'file') {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        [`${name}Preview`]: name === 'image' ? URL.createObjectURL(file) : null,
        [name]: file,
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const displayError = (message) => {
    console.error(message);
    window.alert(message);
  };

  const uploadMedia = async (url, file, fileKey) => {
    const data = new FormData();
    data.append(fileKey, file);
    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status !== 200) throw new Error('Failed to upload media');
    } catch (error) {
      throw new Error(`Error during ${fileKey} upload: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
      return displayError('User is not logged in!');
    }

    try {
      const response = await axios.post(`/api/Post/add/${userId}`, {
        content: formData.content,
        userId,
      });

      if (response.status !== 201) throw new Error('Failed to create post');

      const { postId } = response.data;
      localStorage.setItem('postId', postId);

      if (formData.image) {
        await uploadMedia(`/api/PictureUpload/${postId}/upload-picture`, formData.image, 'picture');
      }

      if (formData.file) {
        await uploadMedia(`/api/FileUpload/${postId}/upload-file`, formData.file, 'file');
      }

      window.alert('Post, picture, and file uploaded successfully!');
      setFormData({ content: '', imagePreview: null, image: null, file: null });
    } catch (error) {
      displayError(error.message);
    }
  };

  return (
    <Container fluid className="h-100 d-flex flex-column justify-content-center">
      <Card className="h-100 w-100">
        <Card.Body className="d-flex flex-column justify-content-center">
          <Card.Title className="text-center">Write Post!</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formContent" className="mb-3">
              <Form.Label>Post Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your post here..."
              />
            </Form.Group>
            <Form.Group controlId="formImage" className="mb-3">
              <Form.Label>Upload Picture</Form.Label>
              <Form.Control type="file" name="image" onChange={handleInputChange} />
            </Form.Group>
            {formData.imagePreview && (
              <div className="mb-3 text-center">
                <Image src={formData.imagePreview}  alt="Selected Image" thumbnail />
              </div>
            )}
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload File</Form.Label>
              <Form.Control type="file" name="file" onChange={handleInputChange} />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button type="submit" className="btn-block" >
                SUBMIT POST
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PageForm;
