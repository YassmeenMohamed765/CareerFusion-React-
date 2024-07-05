import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import PageForm from './Post';
import './post.css'; // Import the custom CSS
import Navbar from "./Navbar";

const PostView = ({ limit }) => {
  const [posts, setPosts] = useState([]);
  const [postImages, setPostImages] = useState({});
  const [postFiles, setPostFiles] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:5266/api/Post/HrPost/${userId}`);
        const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
        await fetchPostResources(sortedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const fetchPostResources = async (posts) => {
      const imagePromises = [];
      const filePromises = [];
      const imageMap = {};
      const fileMap = {};

      posts.forEach(post => {
        if (post.postPictureIds.length > 0) {
          post.postPictureIds.forEach(id => {
            imagePromises.push(
              axios.get(`http://localhost:5266/api/PictureUpload/${id}/picture-path`).then(response => {
                console.log(`Image URL retrieved for post ${post.postId}:`, response.data);
                imageMap[post.postId] = response.data;
              }).catch(error => {
                console.error('Error fetching picture:', error);
              })
            );
          });
        }
        if (post.postFileIds.length > 0) {
          post.postFileIds.forEach(id => {
            filePromises.push(
              axios.get(`http://localhost:5266/api/FileUpload/${id}/url`).then(response => {
                fileMap[post.postId] = response.data;
              }).catch(error => {
                console.error('Error fetching file:', error);
              })
            );
          });
        }
      });

      await Promise.all([...imagePromises, ...filePromises]);
      console.log('Image map after fetch:', imageMap); // Log the image map to check if URLs are correctly fetched
      setPostImages(imageMap);
      setPostFiles(fileMap);
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
    const maxLength = 50;
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
    console.log('New post added:', newPost);
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setPostImages((prevImages) => ({ ...prevImages, [newPost.postId]: newPost.picture }));
  };

  const handleCardClick = (postId) => {
    navigate(`/posts/${postId}/sidebar`);
  };

  const displayedPosts = limit ? posts.slice(0, limit) : posts;

  return (
    <Container className="mt-4">
      <Navbar userType="hr" />
      
      <div className="d-flex justify-content-between align-items-center mb-3" >
        <h3>Your Posts</h3>
        <Button variant="primary" className="btn-block" style={{ marginRight: '25px' }} onClick={() => setShowModal(true)}>
          <FaPlus /> Write Post
        </Button>
      </div>
      {displayedPosts.length === 0 ? (
        <Alert variant="secondary">No posts yet</Alert>
      ) : (
        <Row>
          {displayedPosts.map((post) => (
            <Col key={post.postId} md={6} lg={4} className="mb-4">
              <Card className="custom-card" onClick={() => handleCardClick(post.postId)}style={{ backgroundColor: '#DED8F3', padding: '20px', borderRadius: '10px' }}>
                <Card.Img
                  variant="top"
                  src={postImages[post.postId] || process.env.PUBLIC_URL + '/images/post.jpeg'}
                  className="custom-card-img"
                  alt="Post image"
                />
                <Card.Body className="custom-card-body">
                  <Card.Text>{truncateContent(post.content, post.postId)}</Card.Text>
                  <Button variant="outline-secondary"  as={Link} to={`/posts/${post.postId}`}>
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
