// src/components/Performance.jsx
import React, { useState } from "react";
import { Card, Form, Button, Table, Row, Col } from "react-bootstrap";

const Performance = () => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    employeeName: "",
    reviewPeriod: "",
    kpis: "",
    goals: "",
    managerFeedback: "",
    appraisalScore: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setReviews([...reviews, form]);
    setForm({
      employeeName: "",
      reviewPeriod: "",
      kpis: "",
      goals: "",
      managerFeedback: "",
      appraisalScore: "",
    });
  };

  return (
    <div>
      {/* Performance Review Form */}
      <Card className="mb-4">
        <Card.Header>Add Performance Review</Card.Header>
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
                  <Form.Label>Review Period</Form.Label>
                  <Form.Control
                    type="text"
                    name="reviewPeriod"
                    value={form.reviewPeriod}
                    onChange={handleChange}
                    placeholder="e.g., Q1 2025"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>KPIs</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="kpis"
                    value={form.kpis}
                    onChange={handleChange}
                    placeholder="Key Performance Indicators"
                  />
                </Form.Group>
              </Col>

              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Goals</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="goals"
                    value={form.goals}
                    onChange={handleChange}
                    placeholder="Goals for next period"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Manager Feedback</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="managerFeedback"
                    value={form.managerFeedback}
                    onChange={handleChange}
                    placeholder="Manager comments"
                  />
                </Form.Group>
              </Col>

              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Appraisal Score</Form.Label>
                  <Form.Control
                    type="number"
                    name="appraisalScore"
                    value={form.appraisalScore}
                    onChange={handleChange}
                    min={0}
                    max={100}
                    placeholder="Score out of 100"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" variant="primary">
              Add Review
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Performance Table */}
      <Card>
        <Card.Header>Appraisal History</Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Review Period</th>
                  <th>KPIs</th>
                  <th>Goals</th>
                  <th>Manager Feedback</th>
                  <th>Appraisal Score</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review, index) => (
                  <tr key={index}>
                    <td>{review.employeeName}</td>
                    <td>{review.reviewPeriod}</td>
                    <td>{review.kpis}</td>
                    <td>{review.goals}</td>
                    <td>{review.managerFeedback}</td>
                    <td>{review.appraisalScore}</td>
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

export default Performance;
