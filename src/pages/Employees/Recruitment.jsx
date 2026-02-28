// src/components/Recruitment.jsx
import React, { useState } from "react";
import { Card, Form, Button, Table, Row, Col } from "react-bootstrap";
import "./Recruitment.css";

const Recruitment = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [formJob, setFormJob] = useState({
    title: "",
    department: "",
    description: "",
  });
  const [formApplicant, setFormApplicant] = useState({
    name: "",
    email: "",
    appliedJob: "",
    interviewDate: "",
    onboardingComplete: false,
  });

  // Job form handlers
  const handleJobChange = (e) => {
    const { name, value } = e.target;
    setFormJob({ ...formJob, [name]: value });
  };

  const handleAddJob = (e) => {
    e.preventDefault();
    setJobs([...jobs, formJob]);
    setFormJob({ title: "", department: "", description: "" });
  };

  // Applicant form handlers
  const handleApplicantChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormApplicant({
      ...formApplicant,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddApplicant = (e) => {
    e.preventDefault();
    setApplicants([...applicants, formApplicant]);
    setFormApplicant({
      name: "",
      email: "",
      appliedJob: "",
      interviewDate: "",
      onboardingComplete: false,
    });
  };

  return (
    <div>
      {/* Job Posting Form */}
      <Card className="mb-4">
        <Card.Header>Add Job Posting</Card.Header>
        <Card.Body>
          <Form onSubmit={handleAddJob}>
            <Row className="mb-2">
              <Col xs={12} sm={6} md={4}>
                <Form.Group>
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formJob.title}
                    onChange={handleJobChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Form.Group>
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    value={formJob.department}
                    onChange={handleJobChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={formJob.description}
                    onChange={handleJobChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" variant="primary">
              Add Job
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Job Table */}
      <Card className="mb-4">
        <Card.Header>Job Postings</Card.Header>
        <Card.Body>
          <Table className="responsive-table" striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr key={index}>
                  <td data-label="Title">{job.title}</td>
                  <td data-label="Department">{job.department}</td>
                  <td data-label="Description">{job.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Applicant Form */}
      <Card className="mb-4">
        <Card.Header>Add Applicant</Card.Header>
        <Card.Body>
          <Form onSubmit={handleAddApplicant}>
            <Row className="mb-2">
              <Col xs={12} sm={6} md={3}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formApplicant.name}
                    onChange={handleApplicantChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formApplicant.email}
                    onChange={handleApplicantChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Form.Group>
                  <Form.Label>Applied Job</Form.Label>
                  <Form.Control
                    type="text"
                    name="appliedJob"
                    value={formApplicant.appliedJob}
                    onChange={handleApplicantChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Form.Group>
                  <Form.Label>Interview Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="interviewDate"
                    value={formApplicant.interviewDate}
                    onChange={handleApplicantChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-2">
              <Form.Check
                type="checkbox"
                name="onboardingComplete"
                label="Onboarding Complete"
                checked={formApplicant.onboardingComplete}
                onChange={handleApplicantChange}
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Add Applicant
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Applicant Table */}
      <Card>
        <Card.Header>Applicant Tracking</Card.Header>
        <Card.Body>
          <Table className="responsive-table" striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Applied Job</th>
                <th>Interview Date</th>
                <th>Onboarding Complete</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app, index) => (
                <tr key={index}>
                  <td data-label="Name">{app.name}</td>
                  <td data-label="Email">{app.email}</td>
                  <td data-label="Applied Job">{app.appliedJob}</td>
                  <td data-label="Interview Date">{app.interviewDate}</td>
                  <td data-label="Onboarding Complete">
                    {app.onboardingComplete ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Recruitment;
