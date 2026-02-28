// src/components/Department.jsx
import React, { useState } from "react";
import { Card, Form, Button, Table, Row, Col } from "react-bootstrap";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    departmentName: "",
    jobTitle: "",
    reportingTo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDepartments([...departments, form]);
    setForm({
      departmentName: "",
      jobTitle: "",
      reportingTo: "",
    });
  };

  return (
    <div>
      {/* Department Form */}
      <Card className="mb-4">
        <Card.Header>Add Department / Job</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-2">
              <Col md={4} xs={12}>
                <Form.Group>
                  <Form.Label>Department Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="departmentName"
                    value={form.departmentName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4} xs={12}>
                <Form.Group>
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="jobTitle"
                    value={form.jobTitle}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4} xs={12}>
                <Form.Group>
                  <Form.Label>Reporting To</Form.Label>
                  <Form.Control
                    type="text"
                    name="reportingTo"
                    value={form.reportingTo}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" variant="primary">
              Add Department
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Department Table */}
      <Card>
        <Card.Header>Department & Job List</Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Job Title</th>
                  <th>Reporting To</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, index) => (
                  <tr key={index}>
                    <td>{dept.departmentName}</td>
                    <td>{dept.jobTitle}</td>
                    <td>{dept.reportingTo}</td>
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

export default Department;
