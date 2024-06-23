import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom';
import PageForm from './Post';
import './post.css'; // Import the custom CSS

const PostView = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`/api/Post/HrPost/${userId}`);
        const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const formatDateTime = (dateString) => {
    const options = {
      year: 'numeric', month: 'long', day: 'numeric'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const truncateContent = (content, postId) => {
    const maxLength = 39; 
    if (content.length <= maxLength) {
      return content;
    }
    return (
      <>
        {content.slice(0, maxLength)}...
        <Link to={`/posts/${postId}`} className="text-primary">
          see more
        </Link>
      </>
    );
  };

  const addNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleCardClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb3">
        <h2>Your Posts</h2>
        <Button variant="primary" className="btn-block" onClick={() => setShowModal(true)}>
          <FaPlus /> Write Post 
        </Button>
      </div>
      {posts.length === 0 ? (
        <Alert variant="secondary">No posts yet</Alert>
      ) : (
        <Row>
          {posts.map((post) => (
            <Col key={post.postId} md={6} lg={4} className="mb-4">
              <Card className="custom-card" onClick={() => handleCardClick(post.postId)}>
                <Card.Img
                  variant="top"
                  src={post.picture || process.env.PUBLIC_URL + '/images/post.jpeg'}
                  className="custom-card-img"
                  alt="Post image"
                />
                <Card.Body className="custom-card-body">
                  <Card.Text>{truncateContent(post.content, post.postId)}</Card.Text>
                  <Button variant="primary" className="btn-block" as={Link} to={`/posts/${post.postId}`}>
                    View
                  </Button>
                </Card.Body>
                <Card.Footer className="custom-card-footer">
                  <small className="text-muted">
                    {formatDateTime(post.createdAt)}
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} scrollable size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Write Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PageForm addNewPost={addNewPost} closeModal={() => setShowModal(false)} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PostView;
