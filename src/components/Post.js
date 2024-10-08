import React, { useState } from 'react';
import { Form, Button, Container, Image, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const PageForm = ({ addNewPost, closeModal }) => {
  const [formData, setFormData] = useState({
    content: '',
    imagePreview: null,
    image: null,
    file: null,
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' || name === 'file') {
      const file = files && files[0];
      if (file) {
        setFormData((prevData) => ({
          ...prevData,
          [`${name}Preview`]: name === 'image' ? URL.createObjectURL(file) : null,
          [name]: file,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [`${name}Preview`]: null,
          [name]: null,
        }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const uploadMedia = async (url, file, fileKey) => {
    const data = new FormData();
    data.append(fileKey, file);
    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(`Upload ${fileKey} response:`, response.data);
      if (response.status !== 200) throw new Error('Failed to upload media');
  
      const { pictureId } = response.data;
  
      // Fetch the picture URL using the pictureId
      if (fileKey === 'picture' && pictureId) {
        const pictureUrlResponse = await axios.get(`http://localhost:5266/api/PictureUpload/${pictureId}/picture-path`);
        console.log(`Fetched picture URL:`, pictureUrlResponse.data);
        return { url: pictureUrlResponse.data };
      }
  
      return response.data; // Ensure this returns the correct data structure containing the URL
    } catch (error) {
      console.error(`Error during ${fileKey} upload: ${error.message}`);
      throw new Error(`Error during ${fileKey} upload: ${error.message}`);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User is not logged in!');
      return;
    }
  
    if (!formData.content.trim()) {
      setError('Content field is required!');
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:5266/api/Post/add/${userId}`, {
        content: formData.content,
        userId,
      });
  
      if (response.status !== 201) throw new Error('Failed to create post');
  
      const { postId, createdAt } = response.data;
      localStorage.setItem('postId', postId);
  
      let pictureUrl = null;
      if (formData.image) {
        const imageResponse = await uploadMedia(`http://localhost:5266/api/PictureUpload/${postId}/upload-picture`, formData.image, 'picture');
        console.log('Image upload response:', imageResponse);
        pictureUrl = imageResponse.url;
      }
  
      if (formData.file) {
        await uploadMedia(`http://localhost:5266/api/FileUpload/${postId}/upload-file`, formData.file, 'file');
      }
  
      const newPost = {
        postId,
        content: formData.content,
        picture: pictureUrl, // Ensure pictureUrl is set correctly
        createdAt,
      };
  
      console.log('New post in PageForm:', newPost);
  
      addNewPost(newPost);
  
      setFormData({ content: '', imagePreview: null, image: null, file: null });
      setError(null);
      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <Container fluid className="h-100 d-flex flex-column justify-content-center">
      <Card className="h-100 w-100">
        <Card.Body className="d-flex flex-column justify-content-center">
          <Card.Title className="text-center">Write Post!</Card.Title>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
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
                <Image src={formData.imagePreview} alt="Selected Image" thumbnail />
              </div>
            )}
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload File</Form.Label>
              <Form.Control type="file" name="file" onChange={handleInputChange} />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button type="submit" className="btn-block">
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
