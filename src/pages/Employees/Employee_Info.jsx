// src/components/EmployeeInfo.jsx
import React, { useState } from "react";
import { Form, Button, Table, Card, Row, Col } from "react-bootstrap";

const EmployeeInfo = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    role: "",
    department: "",
    nic: "",
    contract: "",
    certificate: "",
    emergencyContact: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmployees([...employees, form]);
    setForm({
      name: "",
      contact: "",
      role: "",
      department: "",
      nic: "",
      contract: "",
      certificate: "",
      emergencyContact: "",
    });
  };

  return (
    <div>
      {/* Add Employee Form */}
      <Card className="mb-4">
        <Card.Header>Add Employee</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-2">
              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>NIC / ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="nic"
                    value={form.nic}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Contract / Certificate</Form.Label>
                  <Form.Control
                    type="text"
                    name="contract"
                    value={form.contract}
                    onChange={handleChange}
                    className="mb-1"
                  />
                  <Form.Control
                    type="text"
                    name="certificate"
                    value={form.certificate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Emergency Contact</Form.Label>
                  <Form.Control
                    type="text"
                    name="emergencyContact"
                    value={form.emergencyContact}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" variant="primary">
              Add Employee
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Employee List */}
      <Card>
        <Card.Header>Employee List</Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>NIC / ID</th>
                  <th>Contract</th>
                  <th>Certificate</th>
                  <th>Emergency Contact</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => (
                  <tr key={index}>
                    <td>{emp.name}</td>
                    <td>{emp.contact}</td>
                    <td>{emp.role}</td>
                    <td>{emp.department}</td>
                    <td>{emp.nic}</td>
                    <td>{emp.contract}</td>
                    <td>{emp.certificate}</td>
                    <td>{emp.emergencyContact}</td>
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

export default EmployeeInfo;
