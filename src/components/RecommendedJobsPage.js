import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './UserHome.css';

// const RecommendedJobCard = ({ title, description }) => {
//   return (
//     <Card>
//       <Card.Header style={{ backgroundColor: '#7A5AC9', color: 'white' }}>
//         {title}
//       </Card.Header>
//       <Card.Body>
//         <Card.Text>{description}</Card.Text>
//         <Button variant="primary">Apply</Button>
//       </Card.Body>
//     </Card>
//   );
// }
const RecommendedJobCard = ({ title, description }) => {
  return (
    <Card>
      <Card.Img variant="top"className="img-responsive" src="https://placehold.it/150x80?text=IMAGE" style={{ width: '100%' }}/>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Button variant="primary">Apply</Button>
      </Card.Body>
    </Card>
  );
}
// {/* <img src="https://placehold.it/150x80?text=IMAGE" className="img-responsive" style={{ width: '100%' }} alt="Image" /> */}


const RecommendedJobsPage = () => {
  const jobs = [
    { title: 'Software Engineer', description: 'A software engineer is responsible for designing, developing, and testing software applications. They work with programming languages, frameworks, and tools to create functional software solutions.' },
    { title: 'Web Developer', description: 'A web developer specializes in creating and maintaining websites and web applications. They use languages like HTML, CSS, and JavaScript to build user-friendly and interactive web experiences.' },
    { title: 'Data Analyst', description: 'A data analyst collects, processes, and analyzes data to provide insights and support decision-making. They use statistical methods and software tools to interpret data and present findings.' },
    // Add more job objects as needed
    { title: 'Software Engineer', description: 'A software engineer is responsible for designing, developing, and testing software applications. They work with programming languages, frameworks, and tools to create functional software solutions.' },
    // { title: 'Web Developer', description: 'A web developer specializes in creating and maintaining websites and web applications. They use languages like HTML, CSS, and JavaScript to build user-friendly and interactive web experiences.' },
    // { title: 'Data Analyst', description: 'A data analyst collects, processes, and analyzes data to provide insights and support decision-making. They use statistical methods and software tools to interpret data and present findings.' },
    // Add more job objects as needed
  ];

  return (
    <Container fluid className="bg-3 text-center mt-3">
      {/* <h3>Recommended Jobs</h3> */}
      <h2 className="font-weight-bold" style={{ color:'#7A5AC9' }}>Recommended Jobs</h2>
      <Row className="justify-content-md-center">
        {jobs.map((job, index) => (
          <Col key={index} sm={3} className="mb-3">
            <RecommendedJobCard title={job.title} description={job.description} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default RecommendedJobsPage;
