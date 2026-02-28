// src/pages/Communication.jsx
import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Badge, Tabs, Tab } from "react-bootstrap";

// Sample data
const notifications = [
  { id: 1, type: "Email", message: "New training program available", date: "2025-12-20" },
  { id: 2, type: "In-App", message: "System maintenance scheduled", date: "2025-12-22" },
];

const announcements = [
  { id: 1, title: "Holiday Schedule", message: "Office will be closed on 1st Jan 2026" },
  { id: 2, title: "Team Meeting", message: "Monthly team meeting on 28th Dec 2025" },
];

const policies = [
  { id: 1, title: "Leave Policy Update", date: "2025-12-10", description: "New leave policies effective from Jan 2026" },
  { id: 2, title: "Remote Work Policy", date: "2025-11-25", description: "Guidelines for working remotely" },
];

const Communication = () => {
  const [key, setKey] = useState("notifications");

  return (
    <Container className="py-4">
      <h2 className="mb-4">Employee Communication</h2>

      <Tabs
        id="communication-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        {/* Notifications Tab */}
        <Tab eventKey="notifications" title="Notifications">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((note) => (
                <tr key={note.id}>
                  <td>{note.id}</td>
                  <td>
                    <Badge bg={note.type === "Email" ? "primary" : "success"}>{note.type}</Badge>
                  </td>
                  <td>{note.message}</td>
                  <td>{note.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        {/* Announcements Tab */}
        <Tab eventKey="announcements" title="Announcements">
          <Row>
            {announcements.map((ann) => (
              <Col md={6} key={ann.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{ann.title}</Card.Title>
                    <Card.Text>{ann.message}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>

        {/* Policy Updates Tab */}
        <Tab eventKey="policies" title="Policy Updates">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id}>
                  <td>{policy.id}</td>
                  <td>{policy.title}</td>
                  <td>{policy.date}</td>
                  <td>{policy.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Communication;
