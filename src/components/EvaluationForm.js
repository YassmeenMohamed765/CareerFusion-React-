import React, { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Modal, Form, Alert } from 'react-bootstrap';
import { FaPlus, FaQuestion } from 'react-icons/fa';
import axios from 'axios';

const EvaluationForm = () => {
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [defaultScore, setDefaultScore] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    const hrId = localStorage.getItem('userId');
    axios.get(`http://localhost:5266/api/Evaluations/${hrId}/questions`)
      .then(response => setQuestions(response.data))
      .catch(error => console.error('Error fetching questions:', error));
  };

  const handleOpenAddModal = () => {
    setNewQuestion('');
    setDefaultScore('');
    setShowModal(true);
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim() || !defaultScore) {
      setError('Question and default score cannot be empty');
      return;
    }

    const hrId = localStorage.getItem('userId');
    const newQuestionData = {
      question: newQuestion,
      defaultScore: parseInt(defaultScore, 10),
    };

    axios.post(`http://localhost:5266/api/Evaluations/${hrId}/questions`, newQuestionData)
      .then(response => {
        fetchQuestions();  // Fetch the questions again to include the newly added one
        setShowModal(false);
        setNewQuestion('');
        setDefaultScore('');
        setError('');
      })
      .catch(error => console.error('Error adding question:', error));
  };

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5>Evalution Form</h5>
        <Button style={{ backgroundColor: '#7A5AC9' }} onClick={handleOpenAddModal}>
          <FaPlus /> Add Question
        </Button>
      </Card.Header>
      <Card.Body>
        {questions.length === 0 ? (
          <p>No questions yet</p>
        ) : (
          <ListGroup as="ol">
            {questions.map((question, index) => (
              <ListGroup.Item as="li" key={question.id}>
                {index + 1}. {question.question} <FaQuestion style={{ color: 'red', marginLeft: '8px' }} /> (Default Score: {question.defaultScore})
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>

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
            <Form.Group>
              <Form.Label>Default Score</Form.Label>
              <Form.Control
                type="number"
                value={defaultScore}
                onChange={(e) => setDefaultScore(e.target.value)}
                placeholder="Enter default score"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button style={{ backgroundColor: '#7A5AC9' }} onClick={handleAddQuestion}>
            Add Question
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default EvaluationForm;
