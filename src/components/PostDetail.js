import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaFilePdf, FaFileWord } from 'react-icons/fa';
import './post.css';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [cvs, setCvs] = useState([]);
  const [postImages, setPostImages] = useState([]);
  const [postFiles, setPostFiles] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedCvs, setSelectedCvs] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const userId = localStorage.getItem('userId');
        console.log(`Fetching posts for userId: ${userId}`);
        const response = await axios.get(`http://localhost:5266/api/Post/HrPost/${userId}`);
        const posts = response.data;
        const currentPost = posts.find(post => post.postId.toString() === postId);

        if (currentPost) {
          console.log('Full post data retrieved:', currentPost);
          setPost(currentPost);

          if (currentPost.postPictureIds && currentPost.postPictureIds.length > 0) {
            console.log('Post picture IDs:', currentPost.postPictureIds);
            await fetchPostImages(currentPost.postPictureIds);
          } else {
            console.log('No postPictureIds found in the response.');
          }

          if (currentPost.postFileIds && currentPost.postFileIds.length > 0) {
            console.log('Post file IDs:', currentPost.postFileIds);
            await fetchPostFiles(currentPost.postFileIds);
          } else {
            console.log('No postFileIds found in the response.');
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const fetchCvs = async () => {
      try {
        console.log(`Fetching CVs for postId: ${postId}`);
        const response = await axios.get(`http://localhost:5266/api/CVUpload/${postId}/cv-paths`);
        console.log('CVs data retrieved:', response.data);
        setCvs(response.data);
      } catch (error) {
        console.error('Error fetching CVs:', error);
      }
    };

    const fetchPostImages = async (pictureIds) => {
      try {
        const imagePromises = pictureIds.map(id =>
          axios.get(`http://localhost:5266/api/PictureUpload/${id}/picture-path`).then(response => {
            console.log(`Image URL retrieved for pictureId ${id}:`, response.data);
            return response.data;
          }).catch(error => {
            console.error(`Error fetching picture for pictureId ${id}:`, error);
            return null;
          })
        );
        const images = await Promise.all(imagePromises);
        setPostImages(images.filter(img => img !== null));
        console.log('Post images:', images);
      } catch (error) {
        console.error('Error fetching post images:', error);
      }
    };

    const fetchPostFiles = async (fileIds) => {
      try {
        const filePromises = fileIds.map(id =>
          axios.get(`http://localhost:5266/api/FileUpload/${id}/url`).then(response => {
            console.log(`File URL retrieved for fileId ${id}:`, response.data);
            return response.data;
          }).catch(error => {
            console.error(`Error fetching file for fileId ${id}:`, error);
            return null;
          })
        );
        const files = await Promise.all(filePromises);
        setPostFiles(files.filter(file => file !== null));
        console.log('Post files:', files);
      } catch (error) {
        console.error('Error fetching post files:', error);
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

  const getFileIcon = (fileUrl) => {
    const extension = fileUrl.split('.').pop().toLowerCase();
    if (extension === 'pdf') {
      return <FaFilePdf style={{ marginRight: '5px', color: 'red' }} />;
    } else if (extension === 'doc' || extension === 'docx') {
      return <FaFileWord style={{ marginRight: '5px', color: 'blue' }} />;
    }
    return null;
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
              {postFiles.length > 0 && (
                <div className="post-files">
                  {postFiles.map((fileUrl, index) => (
                    <div key={index} className="post-file-link">
                      {getFileIcon(fileUrl)}
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl.split('/').pop()}</a>
                    </div>
                  ))}
                </div>
              )}
            </Col>
            <Col md={5}>
              {postImages.length > 0 ? (
                postImages.map((image, index) => (
                  <Card.Img
                    key={index}
                    variant="top"
                    src={image}
                    alt="Post image"
                    style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
                  />
                ))
              ) : (
                <Card.Img
                  variant="top"
                  src={process.env.PUBLIC_URL + '/images/post.jpeg'}
                  alt="Post image"
                  style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
                />
              )}
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
