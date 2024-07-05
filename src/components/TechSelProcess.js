import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Table, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

const TechSelProcess = () => {
  const { postId } = useParams(); // Assuming postId is the jobFormId in your context
  const [jobId, setJobId] = useState(null);
  const [jobTitles, setJobTitles] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [acceptedCandidates, setAcceptedCandidates] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [technicalInterviewDate, setTechnicalInterviewDate] = useState(null);
  const [physicalInterviewDate, setPhysicalInterviewDate] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [statusModal, setStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusCandidate, setStatusCandidate] = useState(null);

  useEffect(() => {
    const fetchJobTitles = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await axios.get(`http://localhost:5266/api/JobForm/OpenPos/${userId}`);
        setJobTitles(response.data);
      } catch (error) {
        console.error('Error fetching job titles:', error);
      }
    };

    fetchJobTitles();
  }, []);

  useEffect(() => {
    if (jobId) {
      const fetchCandidates = async () => {
        try {
          const response = await axios.get(`http://localhost:5266/api/OpenPosCV/telephone-interview-passed/${jobId}`);
          const fetchedCandidates = response.data;

          const interviewPromises = fetchedCandidates.map(candidate =>
            Promise.all([
              axios.get(`http://localhost:5266/api/OpenPosCV/${candidate.id}/jobform/${jobId}/technical-assessment-date`)
                .then(response => ({
                  technicalAssessmentDate: response.data.data !== '0001-01-01T00:00:00' && !isNaN(Date.parse(response.data.data)) ? new Date(response.data.data) : null
                }))
                .catch(error => {
                  console.error(`Error fetching technical assessment date for candidate ${candidate.postCVId}:`, error);
                  return { technicalAssessmentDate: null };
                }),
              axios.get(`http://localhost:5266/api/OpenPosCV/${candidate.id}/jobform/${jobId}/physical-interview-date`)
                .then(response => ({
                  physicalInterviewDate: response.data.data !== '0001-01-01T00:00:00' && !isNaN(Date.parse(response.data.data)) ? new Date(response.data.data) : null
                }))
                .catch(error => {
                  console.error(`Error fetching physical interview date for candidate ${candidate.postCVId}:`, error);
                  return { physicalInterviewDate: null };
                })
            ]).then(([technicalAssessment, physicalInterview]) => ({
              ...candidate,
              ...technicalAssessment,
              ...physicalInterview
            }))
          );

          const candidatesWithInterviewDates = await Promise.all(interviewPromises);
          setCandidates(candidatesWithInterviewDates);

          // Fetch accepted candidates
          const acceptedResponse = await axios.get(`http://localhost:5266/api/OpenPosCV/technical-interview-passed-for-jobform/${jobId}`);
          setAcceptedCandidates(acceptedResponse.data);
        } catch (error) {
          console.error('Error fetching candidates:', error);
        }
      };

      fetchCandidates();
    }
  }, [jobId]);

  const handleSetInterviewDateClick = (candidate) => {
    setSelectedCandidate(candidate);
    setTechnicalInterviewDate(candidate.technicalAssessmentDate || null);
    setPhysicalInterviewDate(candidate.physicalInterviewDate || null);
    setValidationError('');
    setShowModal(true);
  };

  const handleSaveInterviewDate = async () => {
    if (!technicalInterviewDate || !physicalInterviewDate) {
      setValidationError('Both technical and physical interview dates are required.');
      return;
    }

    if (!selectedCandidate) return;

    try {
      const techDate = technicalInterviewDate ? new Date(technicalInterviewDate.getTime() - (technicalInterviewDate.getTimezoneOffset() * 60000)).toISOString() : null;
      const physDate = physicalInterviewDate ? new Date(physicalInterviewDate.getTime() - (physicalInterviewDate.getTimezoneOffset() * 60000)).toISOString() : null;

      await axios.put(`http://localhost:5266/api/OpenPosCV/${selectedCandidate.id}/jobform/${jobId}/set-technical-interview-date`, null, {
        params: {
          technicalAssessmentDate: techDate,
          physicalInterviewDate: physDate
        }
      });

      const techResponse = await axios.get(`http://localhost:5266/api/OpenPosCV/${selectedCandidate.id}/jobform/${jobId}/technical-assessment-date`);
      const physicalResponse = await axios.get(`http://localhost:5266/api/OpenPosCV/${selectedCandidate.id}/jobform/${jobId}/physical-interview-date`);

      setCandidates(prevCandidates =>
        prevCandidates.map(candidate =>
          candidate.postCVId === selectedCandidate.postCVId
            ? {
              ...candidate,
              technicalAssessmentDate: techResponse.data.data !== '0001-01-01T00:00:00' ? new Date(techResponse.data.data) : null,
              physicalInterviewDate: physicalResponse.data.data !== '0001-01-01T00:00:00' ? new Date(physicalResponse.data.data) : null
            }
            : candidate
        )
      );

      setShowModal(false);
      setSelectedCandidate(null);
    } catch (error) {
      console.error('Error setting interview date:', error);
    }
  };

  const handleToggleStatusClick = (candidate) => {
    setStatusCandidate(candidate);
    setStatusMessage('');
    setStatusModal(true);
  };

  const handleSaveStatus = async () => {
    if (!statusCandidate) return;

    const endpoint = `http://localhost:5266/api/OpenPosCV/${jobId}/${statusCandidate.id}/toggle-technical-interview`;

    try {
      await axios.put(endpoint, {
        passed: true,
        hrMessage: statusMessage
      });

      setCandidates(prevCandidates =>
        prevCandidates.map(candidate =>
          candidate.id === statusCandidate.id
            ? { ...candidate, passed: true, hrMessage: statusMessage }
            : candidate
        )
      );

      // Also add the candidate to the accepted list if not already there
      if (!acceptedCandidates.some(ac => ac.id === statusCandidate.id)) {
        setAcceptedCandidates(prevAcceptedCandidates => [...prevAcceptedCandidates, { ...statusCandidate, passed: true }]);
      }

      setStatusModal(false);
      setStatusCandidate(null);
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return 'Set Interview Date';
    return date.toLocaleString();
  };

  const isAccepted = (id) => {
    return acceptedCandidates.some(candidate => candidate.id === id);
  };

  return (
    <Container className="mt-4">
      <Navbar userType="hr" />
      <Form.Group controlId="formJobTitle">
        <Form.Label>Select Job Title</Form.Label>
        <Form.Control as="select" value={jobId} onChange={e => setJobId(e.target.value)}>
          <option value="">Select a Job Title</option>
          {jobTitles.map(job => (
            <option key={job.jobId} value={job.jobId}>{job.jobTitle}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Card>
        <Card.Header>Selection Process</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>CV</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Technical Assessment Date</th>
                <th>Physical Interview Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">No candidates found</td>
                </tr>
              ) : (
                candidates.map((candidate, index) => (
                  <tr key={candidate.postCVId}>
                    <td>{index + 1}</td>
                    <td>
                      <a href={candidate.filePath} target="_blank" rel="noopener noreferrer">
                        View CV
                      </a>
                    </td>
                    <td>{candidate.userFullName}</td>
                    <td>{candidate.userEmail}</td>
                    <td>
                      <Button variant="link" onClick={() => handleSetInterviewDateClick(candidate)}>
                        {formatDateTime(candidate.technicalAssessmentDate)}
                      </Button>
                    </td>
                    <td>
                      <Button variant="link" onClick={() => handleSetInterviewDateClick(candidate)}>
                        {formatDateTime(candidate.physicalInterviewDate)}
                      </Button>
                    </td>
                    <td>
                      {isAccepted(candidate.id) ? (
                        <Button variant="success" size="sm" onClick={() => handleToggleStatusClick(candidate)}>
                          Accepted
                        </Button>
                      ) : (
                        <Button variant="outline-success" size="sm" onClick={() => handleToggleStatusClick(candidate)}>
                          Accept
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal for setting interview dates */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Set Interview Dates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formTechnicalDate">
            <Form.Label>Technical Assessment Date</Form.Label>
            <br />
            <DatePicker
              selected={technicalInterviewDate}
              onChange={date => setTechnicalInterviewDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="form-control"
            />
          </Form.Group>
          <Form.Group controlId="formPhysicalDate">
            <Form.Label>Physical Interview Date</Form.Label>
            <br />
            <DatePicker
              selected={physicalInterviewDate}
              onChange={date => setPhysicalInterviewDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="form-control"
            />
          </Form.Group>
          {validationError && <p className="text-danger">{validationError}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveInterviewDate}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for toggling status */}
      <Modal show={statusModal} onHide={() => setStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Toggle Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formStatusMessage">
            <Form.Label>HR Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              placeholder="Enter a message (optional)"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setStatusModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveStatus}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TechSelProcess;
