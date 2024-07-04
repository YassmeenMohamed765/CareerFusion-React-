import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Modal, Form, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { FaPlus, FaQuestionCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import CandidatesTable from './CandidatesTable';
import AcceptedCandidatesTable from './AcceptedCandidatesTable';
import { FaQuestion } from "react-icons/fa6";

const TelephoneInterview = () => {
  const { postId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [error, setError] = useState('');
  const [refreshAcceptedCandidates, setRefreshAcceptedCandidates] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:5266/api/TelephoneInterviewQuestions/getTelephoneInterviewQuestionsByPost/${postId}`);
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [postId]);

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) {
      setError('Question cannot be empty.');
      return;
    }

    try {
      await axios.post(`http://localhost:5266/api/TelephoneInterviewQuestions/add-telephone-interview-questions/${postId}`, [
        { question: newQuestion }
      ]);

      const response = await axios.get(`http://localhost:5266/api/TelephoneInterviewQuestions/getTelephoneInterviewQuestionsByPost/${postId}`);
      setQuestions(response.data);

      setShowModal(false);
      setNewQuestion('');
      setError('');
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!newQuestion.trim()) {
      setError('Question cannot be empty.');
      return;
    }

    try {
      await axios.put(`http://localhost:5266/api/TelephoneInterviewQuestions/update-telephone-interview-question/${postId}/${selectedQuestion.questionId}`, {
        questionId: selectedQuestion.questionId,
        question: newQuestion
      });

      const response = await axios.get(`http://localhost:5266/api/TelephoneInterviewQuestions/getTelephoneInterviewQuestionsByPost/${postId}`);
      setQuestions(response.data);

      setShowEditModal(false);
      setShowUpdateForm(false);
      setNewQuestion('');
      setSelectedQuestion(null);
      setError('');
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) return;

    try {
      await axios.delete(`http://localhost:5266/api/TelephoneInterviewQuestions/delete-telephone-interview-question/${postId}/${selectedQuestion.questionId}`);

      const response = await axios.get(`http://localhost:5266/api/TelephoneInterviewQuestions/getTelephoneInterviewQuestionsByPost/${postId}`);
      setQuestions(response.data);

      setShowEditModal(false);
      setSelectedQuestion(null);
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleOpenAddModal = () => {
    setNewQuestion('');
    setShowModal(true);
  };

  const handleCandidateAccepted = () => {
    setRefreshAcceptedCandidates(!refreshAcceptedCandidates);
  };

  return (
    <Container className="mt-4">
      <Navbar userType="hr" />
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5>Interview Questions</h5>
          <Button style={{ backgroundColor: '#7A5AC9'}} onClick={handleOpenAddModal}>
            <FaPlus /> Add Question
          </Button>
        </Card.Header>
        <Card.Body>
          {questions.length === 0 ? (
            <p>No questions yet</p>
          ) : (
            <ListGroup>
              {questions.map((question, index) => (
                <ListGroup.Item
                  key={question.questionId}
                  className="d-flex justify-content-between align-items-center"
                  action
                  onClick={() => {
                    setSelectedQuestion(question);
                    setShowEditModal(true);
                    setShowUpdateForm(false);
                    setNewQuestion(question.question); // Set initial value for updating
                  }}
                  onMouseEnter={() => {
                    document.getElementById(`question-icons-${question.questionId}`).style.display = 'flex';
                  }}
                  onMouseLeave={() => {
                    document.getElementById(`question-icons-${question.questionId}`).style.display = 'none';
                  }}
                >
                  <span>
                    {index + 1}- {question.question} <FaQuestion  style={{ color: 'red', marginLeft: '8px' }} />
                  </span>
                  <div id={`question-icons-${question.questionId}`} style={{ display: 'none' }}>
                    <FaEdit className="mr-3" size={20} style={{ marginRight: '10px' }} onClick={() => setShowUpdateForm(true)} />
                    <FaTrash size={20} onClick={handleDeleteQuestion} />
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* Add Question Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group>
              <Form.Label>Question</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter your question"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button style={{ backgroundColor: '#7A5AC9'}} onClick={handleAddQuestion}>
            Add Question
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit/Delete Question Modal */}
      {selectedQuestion && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!showUpdateForm ? (
              <p>Do you want to update or delete this question?</p>
            ) : (
              <Form>
                <Form.Group>
                  <Form.Label>Update Question</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Enter your question"
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowEditModal(false);
              setShowUpdateForm(false);
              setSelectedQuestion(null);
            }}>
              Close
            </Button>
            {showUpdateForm ? (
              <Button style={{ backgroundColor: '#7A5AC9'}} onClick={handleUpdateQuestion}>
                Save Changes
              </Button>
            ) : (
              <>
                <Button variant="danger" onClick={handleDeleteQuestion}>
                  Delete Question
                </Button>
                <Button style={{ backgroundColor: '#7A5AC9'}} onClick={() => setShowUpdateForm(true)}>
                  Update Question
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      )}

      <CandidatesTable postId={postId} onCandidateAccepted={handleCandidateAccepted} />
      <AcceptedCandidatesTable postId={postId} key={refreshAcceptedCandidates} />
    </Container>
  );
};

export default TelephoneInterview;
