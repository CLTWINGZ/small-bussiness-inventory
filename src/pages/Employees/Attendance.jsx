// src/components/Attendance.jsx
import React, { useState } from "react";
import { Card, Table, Button, Form, Row, Col } from "react-bootstrap";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    employeeName: "",
    date: "",
    checkIn: "",
    checkOut: "",
    shift: "Morning",
    leaveBalance: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate hours worked & overtime
    const checkInTime = new Date(`1970-01-01T${form.checkIn}`);
    const checkOutTime = new Date(`1970-01-01T${form.checkOut}`);
    let hoursWorked = (checkOutTime - checkInTime) / 1000 / 3600;
    hoursWorked = hoursWorked < 0 ? 0 : hoursWorked;

    const overtime = hoursWorked > 8 ? hoursWorked - 8 : 0;

    setRecords([...records, { ...form, hoursWorked, overtime }]);

    setForm({
      employeeName: "",
      date: "",
      checkIn: "",
      checkOut: "",
      shift: "Morning",
      leaveBalance: 0,
    });
  };

  return (
    <div>
      {/* Attendance Form */}
      <Card className="mb-4">
        <Card.Header>Record Attendance</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-2">
              <Col md={4} xs={12}>
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
              <Col md={4} xs={12}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4} xs={12}>
                <Form.Group>
                  <Form.Label>Shift</Form.Label>
                  <Form.Select name="shift" value={form.shift} onChange={handleChange}>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={3} xs={6}>
                <Form.Group>
                  <Form.Label>Check-In</Form.Label>
                  <Form.Control
                    type="time"
                    name="checkIn"
                    value={form.checkIn}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3} xs={6}>
                <Form.Group>
                  <Form.Label>Check-Out</Form.Label>
                  <Form.Control
                    type="time"
                    name="checkOut"
                    value={form.checkOut}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3} xs={6}>
                <Form.Group>
                  <Form.Label>Leave Balance</Form.Label>
                  <Form.Control
                    type="number"
                    name="leaveBalance"
                    value={form.leaveBalance}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" variant="primary">
              Add Record
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Attendance Table */}
      <Card>
        <Card.Header>Attendance Records</Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Date</th>
                  <th>Shift</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Hours Worked</th>
                  <th>Overtime</th>
                  <th>Leave Balance</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec, index) => (
                  <tr key={index}>
                    <td>{rec.employeeName}</td>
                    <td>{rec.date}</td>
                    <td>{rec.shift}</td>
                    <td>{rec.checkIn}</td>
                    <td>{rec.checkOut}</td>
                    <td>{rec.hoursWorked.toFixed(2)}</td>
                    <td>{rec.overtime.toFixed(2)}</td>
                    <td>{rec.leaveBalance}</td>
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

export default Attendance;
