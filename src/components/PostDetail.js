import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './post.css';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [cvs, setCvs] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedCvs, setSelectedCvs] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5266/api/Post/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const fetchCvs = async () => {
      try {
        const response = await axios.get(`http://localhost:5266/api/CVUpload/${postId}/cv-paths`);
        setCvs(response.data);
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
    if (selectAll) {
      setSelectedCvs([]);
      setSelectAll(false);
    } else {
      setSelectedCvs(cvs.map((_, index) => index));
      setSelectAll(true);
    }
  };

  const handleDownloadCvs = async () => {
    try {
      const response = await axios.get(`http://localhost:5266/api/CVUpload/${postId}/download-cvs`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cvs.zip'); // Specify the file name
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading CVs:', error);
    }
  };

  

  return (
    <Container className="post-detail-container mt-4">
      <Card className="mb-4">
        <Card.Header>
          <h4>Your Post</h4>
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
          <h5>Candidates Applied to This Post</h5>
          <div>
            <Button
              variant="outline-primary"
              onClick={() => {
                setShowCheckboxes(!showCheckboxes);
                if (showCheckboxes) {
                  setSelectedCvs([]);
                  setSelectAll(false);
                }
              }}
            >
              {showCheckboxes ? 'Cancel' : 'Select All'}
            </Button>
            {selectedCvs.length > 0 && (
              <Button
                variant="outline-secondary"
                style={{ marginLeft: '10px' }}
                onClick={handleDownloadCvs}
              >
                Download CVs
              </Button>
            )}
          </div>
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
                      checked={selectAll}
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
