import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const EmployeesCard = () => {
  const [employees, setEmployees] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [scores, setScores] = useState({});
  const [error, setError] = useState('');
  const [showExpectedScoreModal, setShowExpectedScoreModal] = useState(false);
  const [expectedScore, setExpectedScore] = useState('');
  const [evaluationResult, setEvaluationResult] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    const hrUserId = localStorage.getItem('userId');
    axios.get(`http://localhost:5266/api/CVUpload/${hrUserId}/technical-interview-passed/all-posts`)
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => console.error('Error fetching employees:', error));
    axios.get(`http://localhost:5266/api/OpenPosCV/${hrUserId}/technical-interview-passed`)
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => console.error('Error fetching employees:', error));
  };

  const fetchQuestions = (hrId) => {
    axios.get(`http://localhost:5266/api/Evaluations/${hrId}/questions`)
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => console.error('Error fetching questions:', error));
  };

  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee);
    const hrId = localStorage.getItem('userId');
    fetchQuestions(hrId);
    setShowModal(true);
  };

  const handleScoreChange = (questionId, score) => {
    setScores({ ...scores, [questionId]: score });
  };

  const handleSubmitScores = () => {
    const hrId = localStorage.getItem('userId');
    const scoresData = Object.keys(scores).filter(questionId => scores[questionId]).map(questionId => ({
      userId: selectedEmployee.userId,
      questionId: parseInt(questionId),
      score: parseInt(scores[questionId])
    }));

    axios.post(`http://localhost:5266/api/Evaluations/${hrId}/questions/scores`, scoresData)
      .then(response => {
        setShowModal(false);
        setScores({});
        setError('');
        setShowExpectedScoreModal(true);
      })
      .catch(error => {
        setError('Error submitting scores');
        console.error('Error submitting scores:', error);
      });
  };

  const handleSubmitExpectedScore = () => {
    const hrId = localStorage.getItem('userId');
    const endpoint = `http://localhost:5266/api/Evaluations/${selectedEmployee.userId}/${hrId}/overallscore/${expectedScore}`;
    axios.get(endpoint)
      .then(response => {
        const { overallScore } = response.data.userEvaluation;
        const { status } = response.data;
        setEvaluationResult({ overallScore, status });
        setShowExpectedScoreModal(false);
        setExpectedScore('');
      })
      .catch(error => {
        setError('Error submitting expected score');
        console.error('Error submitting expected score:', error);
      });
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5>Employees</h5>
      </Card.Header>
      <Card.Body>
        {employees.length === 0 ? (
          <p>No employees found</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Evaluation Form</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={employee.postCVId}>
                  <td>{index + 1}</td>
                  <td>{`Employee${index + 1}`}</td>
                  <td>{employee.userFullName}</td>
                  <td>{employee.userEmail}</td>
                  <td>
                    <Button variant="link" onClick={() => handleOpenModal(employee)}>
                      View Evaluation
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>

      {selectedEmployee && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Evaluation Form for {selectedEmployee.userFullName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {questions.map(question => (
              <Form.Group key={question.id}>
                <Form.Label>{question.question}</Form.Label>
                <Form.Control
                  type="number"
                  value={scores[question.id] || ''}
                  onChange={(e) => handleScoreChange(question.id, e.target.value)}
                  placeholder={`Default Score: ${question.defaultScore}`}
                />
              </Form.Group>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button style={{ backgroundColor: '#7A5AC9' }} onClick={handleSubmitScores}>
              Submit Scores
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {selectedEmployee && (
        <Modal show={showExpectedScoreModal} onHide={() => setShowExpectedScoreModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Enter Expected Score for {selectedEmployee.userFullName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group>
              <Form.Label>Expected Score</Form.Label>
              <Form.Control
                type="number"
                value={expectedScore}
                onChange={(e) => setExpectedScore(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowExpectedScoreModal(false)}>
              Close
            </Button>
            <Button style={{ backgroundColor: '#7A5AC9' }} onClick={handleSubmitExpectedScore}>
              Submit Expected Score
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {evaluationResult && (
        <Modal show={true} onHide={() => setEvaluationResult(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Evaluation Result</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Overall Score: {evaluationResult.overallScore.toFixed(2)}</p>
            <p>Status: {evaluationResult.status}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEvaluationResult(null)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Card>
  );
};

export default EmployeesCard;
