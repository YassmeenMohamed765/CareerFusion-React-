import React, { useEffect, useState } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { FaFileExcel } from 'react-icons/fa';

const AcceptedCandidatesTableJf = ({ jobId }) => {
  const [acceptedCandidates, setAcceptedCandidates] = useState([]);

  useEffect(() => {
    const fetchAcceptedCandidates = async () => {
      try {
        const response = await axios.get(`http://localhost:5266/api/OpenPosCV/telephone-interview-passed/${jobId}`);
        setAcceptedCandidates(response.data);
      } catch (error) {
        console.error('Error fetching accepted candidates:', error);
      }
    };

    fetchAcceptedCandidates();
  }, [jobId]);

  const handleExportToExcel = async () => {
    try {
      const response = await axios.get(`http://localhost:5266/api/OpenPosCV/export-telephone-interview-passed/${jobId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'AcceptedCandidates.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5>Result / Accepted Candidates</h5>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Candidate</th>
              <th>CV</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {acceptedCandidates.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">No accepted candidates found</td>
              </tr>
            ) : (
              acceptedCandidates.map((candidate, index) => (
                <tr key={candidate.id}>
                  <td>{index + 1}</td>
                  <td>Candidate {index + 1}</td>
                  <td>
                    <a href={candidate.filePath} target="_blank" rel="noopener noreferrer">View CV</a>
                  </td>
                  <td>{candidate.userFullName}</td>
                  <td>{candidate.userEmail}</td>
                  <td style={{ color: 'green' }}>Accepted</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end">
        <Button variant="outline-success" onClick={handleExportToExcel}>
          <FaFileExcel className="me-2" />
          Export to Excel
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default AcceptedCandidatesTableJf;
