import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa'; // Importing the FaPlus icon
import { Link } from 'react-router-dom';
import  PageForm from './Post';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: true
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Posts</h2>
        <Button variant="primary" className="btn-block" onClick={() => setShowModal(true)}>
          <FaPlus /> Write Post {/* Using FaPlus icon */}
        </Button>
      </div>
      {posts.length === 0 ? (
        <Alert variant="secondary">No posts yet</Alert>
      ) : (
        <Row>
          {posts.map((post) => (
            <Col key={post.postId} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={post.picture || "https://placehold.it/150x80?text=IMAGE"}
                  alt="Post image"
                />
                <Card.Body>
                  <Card.Text>{post.content}</Card.Text>
                  <Button variant="primary" className='btn-block' as={Link} to={`/posts/${post.postId}`}>
                    View
                  </Button>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                    {formatDateTime(post.createdAt)}
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Write Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Ensure PageForm is correctly imported */}
          <PageForm />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PostsPage;
