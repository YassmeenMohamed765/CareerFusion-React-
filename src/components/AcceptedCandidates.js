import React, { useEffect } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaFileExcel } from 'react-icons/fa';

const AcceptedCandidates = ({ acceptedCandidates }) => {
  const { postId } = useParams();

  const handleExportToExcel = async () => {
    try {
      const response = await axios.get(`http://localhost:5266/api/CVUpload/export-technical-interview-passed/${postId}`, {
        responseType: 'blob', // important to receive the response as a blob
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'accepted_candidates.xlsx'); // set the file name
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  return (
    <Card className="mt-4">
      <Card.Header>The Result / Accepted</Card.Header>
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
                <tr key={candidate.postCVId}>
                  <td>{index + 1}</td>
                  <td>Candidate {index + 1}</td>
                  <td>
                    <a href={candidate.filePath} target="_blank" rel="noopener noreferrer">
                      View CV
                    </a>
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

export default AcceptedCandidates;
