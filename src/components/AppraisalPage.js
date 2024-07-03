import React, { useState, useEffect } from 'react';
import { Container, Card, Button, ListGroup, Modal, Form, Alert } from 'react-bootstrap';
import { FaBullseye, FaQuestion, FaEdit, FaTrash } from 'react-icons/fa';
import EvaluationForm from './EvaluationForm';
import axios from 'axios';
import EmployeesCard from './EmployeesCard';
import Navbar from "./Navbar";

const AppraisalPage = () => {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [score, setScore] = useState('');
  const [error, setError] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    const hrUserId = localStorage.getItem('userId');
    axios.get(`http://localhost:5266/api/Goals/hruser/${hrUserId}`)
      .then(response => setGoals(response.data))
      .catch(error => console.error('Error fetching goals:', error));
  }, []);

  const handleOpenAddModal = () => {
    setNewGoal('');
    setScore('');
    setShowModal(true);
  };

  const handleAddGoal = () => {
    if (!newGoal.trim() || !score) {
      setError('Goal and score cannot be empty');
      return;
    }

    const hrUserId = localStorage.getItem('userId');
    const newGoalData = {
      description: newGoal,
      score: parseInt(score, 10),
    };

    axios.post(`http://localhost:5266/api/Goals/hruser/${hrUserId}`, newGoalData)
      .then(response => {
        setGoals([...goals, response.data]);
        setShowModal(false);
        setNewGoal('');
        setScore('');
        setError('');
      })
      .catch(error => console.error('Error adding goal:', error));
  };

  const handleDeleteGoal = () => {
    axios.delete(`http://localhost:5266/api/Goals/${selectedGoal.id}`)
      .then(() => {
        setGoals(goals.filter(goal => goal.id !== selectedGoal.id));
        setShowEditModal(false);
        setSelectedGoal(null);
      })
      .catch(error => console.error('Error deleting goal:', error));
  };

  const handleUpdateGoal = () => {
    if (!newGoal.trim() || !score) {
      setError('Goal and score cannot be empty');
      return;
    }

    const updatedGoalData = {
      description: newGoal,
      score: parseInt(score, 10),
    };

    axios.put(`http://localhost:5266/api/Goals/${selectedGoal.id}`, updatedGoalData)
      .then(response => {
        setGoals(goals.map(goal => (goal.id === selectedGoal.id ? response.data : goal)));
        setShowEditModal(false);
        setShowUpdateForm(false);
        setSelectedGoal(null);
        setNewGoal('');
        setScore('');
      })
      .catch(error => console.error('Error updating goal:', error));
  };

  return (
    <Container className="mt-4">
      <Navbar userType="hr" />
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5>Goals</h5>
          <Button style={{ backgroundColor: '#7A5AC9' }} onClick={handleOpenAddModal}>
            <FaBullseye /> Add Goal
          </Button>
        </Card.Header>
        <Card.Body>
          {goals.length === 0 ? (
            <p>No goals yet</p>
          ) : (
            <ListGroup as="ol">
              {goals.map((goal, index) => (
                <ListGroup.Item
                  as="li"
                  key={goal.id}
                  className="d-flex justify-content-between align-items-center"
                  action
                  onClick={() => {
                    setSelectedGoal(goal);
                    setShowEditModal(true);
                    setShowUpdateForm(false);
                    setNewGoal(goal.description);
                    setScore(goal.score.toString());
                  }}
                  onMouseEnter={() => {
                    document.getElementById(`goal-icons-${goal.id}`).style.display = 'flex';
                  }}
                  onMouseLeave={() => {
                    document.getElementById(`goal-icons-${goal.id}`).style.display = 'none';
                  }}
                >
                  <span>
                    {index + 1}- {goal.description} (Score: {goal.score}) 
                  </span>
                  <div id={`goal-icons-${goal.id}`} style={{ display: 'none' }}>
                    <FaEdit
                      className="mr-3"
                      size={20}
                      style={{ marginRight: '10px' }}
                      onClick={() => setShowUpdateForm(true)}
                    />
                    <FaTrash size={20} onClick={handleDeleteGoal} />
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
      <EvaluationForm />
      <EmployeesCard />

      {/* Add Goal Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group>
              <Form.Label>Goal</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Enter your goal"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Score</Form.Label>
              <Form.Control
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="Enter score"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button style={{ backgroundColor: '#7A5AC9' }} onClick={handleAddGoal}>
            Add Goal
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit/Delete Goal Modal */}
      {selectedGoal && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Goal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!showUpdateForm ? (
              <p>Do you want to update or delete this goal?</p>
            ) : (
              <Form>
                <Form.Group>
                  <Form.Label>Update Goal</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Enter your goal"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Score</Form.Label>
                  <Form.Control
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Enter score"
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                setShowUpdateForm(false);
                setSelectedGoal(null);
              }}
            >
              Close
            </Button>
            {showUpdateForm ? (
              <Button style={{ backgroundColor: '#7A5AC9' }} onClick={handleUpdateGoal}>
                Save Changes
              </Button>
            ) : (
              <>
                <Button variant="danger" onClick={handleDeleteGoal}>
                  Delete Goal
                </Button>
                <Button style={{ backgroundColor: '#7A5AC9' }} onClick={() => setShowUpdateForm(true)}>
                  Update Goal
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default AppraisalPage;
