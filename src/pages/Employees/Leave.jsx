// src/components/Leave.jsx
import React, { useState } from "react";
import { Card, Form, Button, Table, Row, Col } from "react-bootstrap";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({
    employeeName: "",
    leaveType: "Annual",
    startDate: "",
    endDate: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLeaves([...leaves, form]);
    setForm({
      employeeName: "",
      leaveType: "Annual",
      startDate: "",
      endDate: "",
      status: "Pending",
    });
  };

  return (
    <div>
      {/* Leave Request Form */}
      <Card className="mb-4">
        <Card.Header>Request Leave</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-2">
              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Employee Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="employeeName"
                    value={form.employeeName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Leave Type</Form.Label>
                  <Form.Select
                    name="leaveType"
                    value={form.leaveType}
                    onChange={handleChange}
                  >
                    <option>Annual</option>
                    <option>Sick</option>
                    <option>Casual</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" variant="primary">
              Submit Leave
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Leave Table */}
      <Card>
        <Card.Header>Leave Records</Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave, index) => (
                  <tr key={index}>
                    <td>{leave.employeeName}</td>
                    <td>{leave.leaveType}</td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate}</td>
                    <td>{leave.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Leave;
