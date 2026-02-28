// src/pages/Compliance.jsx
import React from "react";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";

// Sample data
const encryption = [
  { id: 1, type: "AES-256", status: "Active" },
  { id: 2, type: "TLS 1.3", status: "Active" },
];

const auditLogs = [
  { id: 1, action: "Login", user: "John Doe", date: "2025-12-20 09:30" },
  { id: 2, action: "Payroll Export", user: "Jane Smith", date: "2025-12-22 14:10" },
];

const legalCompliance = [
  { id: 1, law: "Labor Act 2025", status: "Compliant" },
  { id: 2, law: "Data Protection Act", status: "Compliant" },
];

const backups = [
  { id: 1, type: "Daily Database Backup", lastBackup: "2025-12-24", status: "Successful" },
  { id: 2, type: "Weekly Full Backup", lastBackup: "2025-12-21", status: "Successful" },
];

const Compliance = () => {
  return (
    <Container className="py-4">
      <h2 className="mb-4">Compliance & Security</h2>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Data Encryption</Card.Title>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {encryption.map((enc) => (
                    <tr key={enc.id}>
                      <td>{enc.id}</td>
                      <td>{enc.type}</td>
                      <td>
                        <Badge bg={enc.status === "Active" ? "success" : "danger"}>
                          {enc.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Backup & Recovery</Card.Title>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Backup Type</th>
                    <th>Last Backup</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {backups.map((backup) => (
                    <tr key={backup.id}>
                      <td>{backup.id}</td>
                      <td>{backup.type}</td>
                      <td>{backup.lastBackup}</td>
                      <td>
                        <Badge bg={backup.status === "Successful" ? "success" : "danger"}>
                          {backup.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Audit Logs</Card.Title>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Action</th>
                    <th>User</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td>{log.action}</td>
                      <td>{log.user}</td>
                      <td>{log.date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Legal Compliance (Labor Laws)</Card.Title>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Law</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {legalCompliance.map((law) => (
                    <tr key={law.id}>
                      <td>{law.id}</td>
                      <td>{law.law}</td>
                      <td>
                        <Badge bg={law.status === "Compliant" ? "success" : "danger"}>
                          {law.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Compliance;
