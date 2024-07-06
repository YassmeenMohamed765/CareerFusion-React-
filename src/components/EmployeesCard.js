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
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportText, setReportText] = useState('');
  const [selectedReportUserId, setSelectedReportUserId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    const hrUserId = localStorage.getItem('userId');
    
    // Fetch employees from both endpoints simultaneously
    const endpoint1 = axios.get(`http://localhost:5266/api/CVUpload/${hrUserId}/technical-interview-passed/all-posts`);
    const endpoint2 = axios.get(`http://localhost:5266/api/OpenPosCV/${hrUserId}/technical-interview-passed`);

    Promise.all([endpoint1, endpoint2])
      .then((responses) => {
        // responses[0] will be the response from the first endpoint
        // responses[1] will be the response from the second endpoint
        const employeesFromEndpoint1 = responses[0].data;
        const employeesFromEndpoint2 = responses[1].data;

        // Combine employees from both endpoints into one array
        const combinedEmployees = [...employeesFromEndpoint1, ...employeesFromEndpoint2];

        // Set the state with the combined array
        setEmployees(combinedEmployees);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
      });
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
        const status = response.data.status;
        setEvaluationResult({ overallScore, status });
        setShowExpectedScoreModal(false);
        setExpectedScore('');
      })
      .catch(error => {
        setError('Error submitting expected score');
        console.error('Error submitting expected score:', error);
      });
  };

  const handleOpenReportModal = (employee) => {
    setSelectedReportUserId(employee.userId);
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setReportTitle('');
    setReportText('');
    setSelectedReportUserId('');
    setSuccessMessage('');
  };

  const handleCreateReport = () => {
    const hrUserId = localStorage.getItem('userId');
    const reportData = {
      title: reportTitle,
      text: reportText,
      hrUserId: hrUserId
    };

    axios.post(`http://localhost:5266/api/Report/Create/${hrUserId}`, reportData)
      .then(response => {
        const reportId = response.data.reportId;
        axios.post(`http://localhost:5266/api/Report/${reportId}/SendTo/${selectedReportUserId}`)
          .then(sendResponse => {
            setSuccessMessage('Report sent successfully!');
            setTimeout(() => {
              handleCloseReportModal();
            }, 2000); // Close modal after 2 seconds
          })
          .catch(error => {
            setError('Error sending report');
            console.error('Error sending report:', error);
          });
      })
      .catch(error => {
        setError('Error creating report');
        console.error('Error creating report:', error);
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
                <th>Send Report</th>
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
                  <td>
                    <Button variant="link" onClick={() => handleOpenReportModal(employee)}>
                      Send Report
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>

      {selectedEmployee && (
        <>
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

          <Modal show={evaluationResult !== null} onHide={() => setEvaluationResult(null)}>
            <Modal.Header closeButton>
              <Modal.Title>Evaluation Result</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {evaluationResult && (
                <div>
                  <p>Overall Score: {evaluationResult.overallScore}</p>
                  <p>Status: {evaluationResult.status}</p>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setEvaluationResult(null)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}

      <Modal show={showReportModal} onHide={handleCloseReportModal}>
        <Modal.Header closeButton>
          <Modal.Title>Send Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form.Group>
            <Form.Label>Report Title</Form.Label>
            <Form.Control
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Report Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReportModal}>
            Close
          </Button>
          <Button style={{ backgroundColor: '#7A5AC9' }} onClick={handleCreateReport}>
            Send Report
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default EmployeesCard;
