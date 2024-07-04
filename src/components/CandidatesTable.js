import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CandidatesTable = ({ postId, onCandidateAccepted }) => {
  const [candidates, setCandidates] = useState([]);
  const [contactInfo, setContactInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [interviewDate, setInterviewDate] = useState(null);
  const [acceptedCandidates, setAcceptedCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`http://localhost:5266/api/CVUpload/screened/${postId}`);
        const fetchedCandidates = response.data;

        const interviewPromises = fetchedCandidates.map(candidate =>
          axios.get(`http://localhost:5266/api/CVUpload/${postId}/get-telephone-interview-date/${candidate.postCVId}`)
            .then(response => {
              const interviewDateStr = response.data;
              let interviewDate = null;
              if (interviewDateStr !== '0001-01-01T00:00:00' && !isNaN(Date.parse(interviewDateStr))) {
                interviewDate = new Date(interviewDateStr);
              }
              return { ...candidate, interviewDate };
            })
        );

        const candidatesWithInterviewDates = await Promise.all(interviewPromises);
        setCandidates(candidatesWithInterviewDates);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    const fetchAcceptedCandidates = async () => {
      try {
        const response = await axios.get(`http://localhost:5266/api/CVUpload/telephone-interview-passed/${postId}`);
        setAcceptedCandidates(response.data.map(candidate => candidate.postCVId));
      } catch (error) {
        console.error('Error fetching accepted candidates:', error);
      }
    };

    fetchCandidates();
    fetchAcceptedCandidates();
  }, [postId]);

  useEffect(() => {
    const fetchContactInfo = async () => {
      const contactPromises = candidates.map(candidate =>
        axios.get(`http://localhost:5266/api/OpenPosCV/${candidate.userId}/contact-info`)
          .then(response => ({ [candidate.userId]: response.data }))
          .catch(error => {
            console.error(`Error fetching contact info for user ${candidate.userId}:`, error);
            return { [candidate.userId]: { phoneNumber: 'N/A' } };
          })
      );

      const contactResults = await Promise.all(contactPromises);
      const contactData = contactResults.reduce((acc, data) => ({ ...acc, ...data }), {});
      setContactInfo(contactData);
    };

    if (candidates.length > 0) {
      fetchContactInfo();
    }
  }, [candidates]);

  const handleSetInterviewDateClick = (candidate) => {
    setSelectedCandidate(candidate);
    setInterviewDate(candidate.interviewDate || null);
    setShowModal(true);
  };

  const handleSaveInterviewDate = async () => {
    if (!interviewDate || !selectedCandidate) return;

    try {
      const utcDate = new Date(interviewDate.getTime() - (interviewDate.getTimezoneOffset() * 60000)).toISOString();

      await axios.put(`http://localhost:5266/api/CVUpload/${postId}/set-telephone-interview-date/${selectedCandidate.postCVId}`, null, {
        params: { interviewDate: utcDate }
      });

      const response = await axios.get(`http://localhost:5266/api/CVUpload/${postId}/get-telephone-interview-date/${selectedCandidate.postCVId}`);
      const retrievedDate = new Date(response.data);

      setCandidates(prevCandidates =>
        prevCandidates.map(candidate =>
          candidate.postCVId === selectedCandidate.postCVId
            ? { ...candidate, interviewDate: retrievedDate }
            : candidate
        )
      );

      setShowModal(false);
      setSelectedCandidate(null);
    } catch (error) {
      console.error('Error setting interview date:', error);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return 'Set Interview Date';
    return date.toLocaleString();
  };

  const handleToggleStatus = async (candidate) => {
    try {
      await axios.put(`http://localhost:5266/api/CVUpload/${postId}/${candidate.postCVId}/toggle-telephone-interview`);
      setAcceptedCandidates((prevAcceptedCandidates) =>
        prevAcceptedCandidates.includes(candidate.postCVId)
          ? prevAcceptedCandidates.filter(id => id !== candidate.postCVId)
          : [...prevAcceptedCandidates, candidate.postCVId]
      );
      onCandidateAccepted();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5>Selection Process</h5>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              {/* <th>Candidate</th> */}
              <th>CV</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Interview Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">No candidates found</td>
              </tr>
            ) : (
              candidates.map((candidate, index) => (
                <tr key={candidate.postCVId}>
                  <td>{index + 1}</td>
                  {/* <td>Candidate {index + 1}</td> */}
                  <td>
                    <a href={candidate.filePath} target="_blank" rel="noopener noreferrer">View CV</a>
                  </td>
                  <td>{candidate.userFullName}</td>
                  <td>{candidate.userEmail}</td>
                  <td>{contactInfo[candidate.userId]?.phoneNumber || 'N/A'}</td>
                  <td>
                    <Button variant="link" onClick={() => handleSetInterviewDateClick(candidate)}>
                      {formatDateTime(candidate.interviewDate)}
                    </Button>
                  </td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={acceptedCandidates.includes(candidate.postCVId)}
                      onChange={() => handleToggleStatus(candidate)}
                      style={{ marginRight: '5px' }}
                    />
                    {acceptedCandidates.includes(candidate.postCVId) && <span style={{ color: 'green' }}>Accepted</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card.Body>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Set Interview Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Interview Date</Form.Label>
              <DatePicker
                selected={interviewDate}
                onChange={date => setInterviewDate(date)}
                showTimeSelect
                dateFormat="Pp"
                className="form-control"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button style={{ backgroundColor: '#7A5AC9'}} onClick={handleSaveInterviewDate}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default CandidatesTable;
