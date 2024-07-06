import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Table, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { BsFileExcel } from 'react-icons/bs'; // Importing Excel icon
import Navbar from './Navbar';

const TechResults = () => {
  const [jobId, setJobId] = useState(null);
  const [jobTitles, setJobTitles] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);

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
          const response = await axios.get(`http://localhost:5266/api/OpenPosCV/technical-interview-passed-for-jobform/${jobId}`);
          const fetchedCandidates = response.data;

          const interviewPromises = fetchedCandidates.map(candidate =>
            axios.get(`http://localhost:5266/api/OpenPosCV/${candidate.id}/jobform/${jobId}/get-telephone-interview-date`)
              .then(response => ({
                ...candidate,
                telephoneInterviewDate: response.data.data !== '0001-01-01T00:00:00' && !isNaN(Date.parse(response.data.data)) ? new Date(response.data.data) : null
              }))
              .catch(error => {
                console.error(`Error fetching telephone interview date for candidate ${candidate.postCVId}:`, error);
                return { telephoneInterviewDate: null };
              })
          );

          const candidatesWithInterviewDates = await Promise.all(interviewPromises);
          setCandidates(candidatesWithInterviewDates);
        } catch (error) {
          console.error('Error fetching candidates:', error);
        }
      };

      fetchCandidates();
    }
  }, [jobId]);

  const handleShowContactInfo = async (candidate) => {
    setSelectedCandidate(candidate);
    try {
      const response = await axios.get(`http://localhost:5266/api/OpenPosCV/${candidate.userId}/contact-info`);
      setContactInfo(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const handleExportToExcel = async () => {
    try {
      if (jobId) {
        const response = await axios.get(`http://localhost:5266/api/OpenPosCV/export-technical-interview-passed-for-jobform/${jobId}`, {
          responseType: 'blob' // Ensure response is treated as a blob
        });

        // Create a Blob object from the response data
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Create a link element, click it, and remove it to trigger the download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `TechnicalInterviewResults_${jobId}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  return (
    <Container className="mt-4">
      <Navbar userType="hr" />
      <Form.Group controlId="formJobTitle" style={{paddingBottom:"20px"}}>
        <Form.Label>Select Job Title</Form.Label>
        <Form.Control as="select" value={jobId} onChange={e => setJobId(e.target.value)}>
          <option value="">Select a Job Title</option>
          {jobTitles.map(job => (
            <option key={job.jobId} value={job.jobId}>{job.jobTitle}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Card>
        <Card.Header>Technical Interview Results</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>CV</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Contact Info</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">No candidates found</td>
                </tr>
              ) : (
                candidates.map((candidate, index) => (
                  <tr key={candidate.id}>
                    <td>{index + 1}</td>
                    <td>
                      <a href={candidate.filePath} target="_blank" rel="noopener noreferrer">
                        View CV
                      </a>
                    </td>
                    <td>{candidate.userFullName}</td>
                    <td>{candidate.userEmail}</td>
                    <td>
                      <Button variant="info" onClick={() => handleShowContactInfo(candidate)}>
                        Show Contact Info
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}></td>
                <td>
                  <Button variant="success" onClick={handleExportToExcel}>
                    <BsFileExcel /> Export to Excel
                  </Button>
                </td>
              </tr>
            </tfoot>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {contactInfo && (
            <>
              <p><strong>Full Name:</strong> {contactInfo.fullName}</p>
              <p><strong>Email:</strong> {contactInfo.email}</p>
              <p><strong>Phone:</strong> {contactInfo.phoneNumber}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TechResults;
