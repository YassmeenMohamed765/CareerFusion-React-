import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './post.css'; // Import the custom CSS

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [cvs, setCvs] = useState([]); // State to store CV URLs
  const [showCheckboxes, setShowCheckboxes] = useState(false); // State to toggle checkboxes
  const [selectedCvs, setSelectedCvs] = useState([]); // State to store selected CVs

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/Post/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const fetchCvs = async () => {
      try {
        const response = await axios.get(`/api/CVUpload/${postId}/cv-paths`);
        setCvs(response.data); // Store CV URLs in state
      } catch (error) {
        console.error('Error fetching CVs:', error);
      }
    };

    fetchPost();
    fetchCvs();
  }, [postId]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const handleSelectChange = (index) => {
    setSelectedCvs((prevSelected) => {
      const newSelected = [...prevSelected];
      if (newSelected.includes(index)) {
        return newSelected.filter((i) => i !== index);
      } else {
        newSelected.push(index);
        return newSelected;
      }
    });
  };

  const handleSelectAllChange = () => {
    if (selectedCvs.length === cvs.length) {
      setSelectedCvs([]);
    } else {
      setSelectedCvs(cvs.map((_, index) => index));
    }
  };

  return (
    <Container className="mt-4">
      <Card className="mb-4">
        <Card.Header>
          <h2>Your Post</h2>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={7}>
              <Card.Text>{post.content}</Card.Text>
            </Col>
            <Col md={5}>
              <Card.Img
                variant="top"
                src={post.picture || process.env.PUBLIC_URL + '/images/post.jpeg'}
                alt="Post image"
                style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
              />
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">{formatDateTime(post.createdAt)}</small>
        </Card.Footer>
      </Card>

      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h2>Candidates Applied to This Post</h2>
          <Button variant="primary" onClick={() => setShowCheckboxes(!showCheckboxes)}>
            Select
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Candidate</th>
                <th>CV</th>
                {showCheckboxes && (
                  <th>
                    <Form.Check
                      type="checkbox"
                      onChange={handleSelectAllChange}
                      checked={selectedCvs.length === cvs.length}
                      className="custom-checkbox"
                      label="Select All"
                    />
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {cvs.length === 0 ? (
                <tr>
                  <td colSpan={showCheckboxes ? 4 : 3} className="text-center">No CVs uploaded</td>
                </tr>
              ) : (
                cvs.map((cv, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>Candidate {index + 1}</td>
                    <td>
                      <a href={cv} target="_blank" rel="noopener noreferrer">Download CV</a>
                    </td>
                    {showCheckboxes && (
                      <td>
                        <Form.Check
                          type="checkbox"
                          onChange={() => handleSelectChange(index)}
                          checked={selectedCvs.includes(index)}
                          className="custom-checkbox"
                          label="Select"
                        />
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PostDetail;
