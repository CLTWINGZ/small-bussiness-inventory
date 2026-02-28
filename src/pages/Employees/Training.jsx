// src/pages/Training.jsx
import React, { useState } from "react";
import { Container, Row, Col, Card, Table, ProgressBar, Tabs, Tab } from "react-bootstrap";

const trainingPrograms = [
  { id: 1, name: "React Basics", status: "Completed", progress: 100 },
  { id: 2, name: "Advanced JavaScript", status: "In Progress", progress: 60 },
  { id: 3, name: "CSS Flex & Grid", status: "Not Started", progress: 0 },
];

const certifications = [
  { id: 1, name: "React Developer", date: "2025-10-01" },
  { id: 2, name: "JavaScript Pro", date: "2025-11-15" },
];

const skills = [
  { id: 1, skill: "React", level: "Intermediate" },
  { id: 2, skill: "JavaScript", level: "Advanced" },
  { id: 3, skill: "CSS", level: "Intermediate" },
];

const Training = () => {
  const [key, setKey] = useState("programs");

  return (
    <Container className="py-4">
      <h2 className="mb-4">Employee Training Dashboard</h2>

      <Tabs
        id="training-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="programs" title="Training Programs">
          <Row>
            {trainingPrograms.map((program) => (
              <Col md={4} sm={6} xs={12} key={program.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{program.name}</Card.Title>
                    <Card.Text>Status: {program.status}</Card.Text>
                    <ProgressBar now={program.progress} label={`${program.progress}%`} />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>

        <Tab eventKey="skills" title="Skill Tracking">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Skill</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id}>
                  <td>{skill.id}</td>
                  <td>{skill.skill}</td>
                  <td>{skill.level}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="certifications" title="Certification Records">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Certification</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {certifications.map((cert) => (
                <tr key={cert.id}>
                  <td>{cert.id}</td>
                  <td>{cert.name}</td>
                  <td>{cert.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="progress" title="Training Progress Reports">
          <Row>
            {trainingPrograms.map((program) => (
              <Col md={6} key={program.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{program.name}</Card.Title>
                    <ProgressBar now={program.progress} label={`${program.progress}%`} />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Training;
