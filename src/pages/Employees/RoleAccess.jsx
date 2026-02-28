// src/components/RoleAccess.jsx
import React, { useState } from "react";
import { Card, Form, Button, Table, Row, Col } from "react-bootstrap";

const RoleAccess = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "Employee", // default role
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsers([...users, form]);
    setForm({
      username: "",
      email: "",
      role: "Employee",
      password: "",
    });
  };

  return (
    <div>
      {/* Add User / Role Form */}
      <Card className="mb-4">
        <Card.Header>Add User & Role</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-2">
              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Select name="role" value={form.role} onChange={handleChange}>
                    <option value="Admin">Admin</option>
                    <option value="HR">HR</option>
                    <option value="Manager">Manager</option>
                    <option value="Employee">Employee</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" variant="primary">
              Add User
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* User List Table */}
      <Card>
        <Card.Header>User Roles & Permissions</Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.password}</td>
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

export default RoleAccess;
