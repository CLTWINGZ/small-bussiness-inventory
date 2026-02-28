import React, { useEffect, useMemo, useState } from "react";
import { Container, Card, Form, Button, Table, Modal, Alert, Row, Col, Badge } from "react-bootstrap";
import jsPDF from "jspdf";

const ESS_STORAGE_KEY = "employee_ess_portal_v1";

const defaultState = {
  personalInfo: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
  },
  leaveBalance: 5,
  leaveRequests: [],
};

const initialLeaveForm = {
  type: "",
  startDate: "",
  endDate: "",
  reason: "",
};

const statusVariant = {
  Approved: "success",
  Pending: "warning",
  Rejected: "danger",
};

const ESS = () => {
  const [state, setState] = useState(defaultState);
  const [personalInfo, setPersonalInfo] = useState(defaultState.personalInfo);
  const [leaveRequest, setLeaveRequest] = useState(initialLeaveForm);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ESS_STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      setState({
        personalInfo: parsed.personalInfo || defaultState.personalInfo,
        leaveBalance: Number.isFinite(parsed.leaveBalance)
          ? parsed.leaveBalance
          : defaultState.leaveBalance,
        leaveRequests: Array.isArray(parsed.leaveRequests) ? parsed.leaveRequests : [],
      });
    } catch {
      setState(defaultState);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(ESS_STORAGE_KEY, JSON.stringify(state));
    setPersonalInfo(state.personalInfo);
  }, [state]);

  const approvedLeaveDays = useMemo(() => {
    return state.leaveRequests
      .filter((request) => request.status === "Approved")
      .reduce((sum, request) => sum + request.days, 0);
  }, [state.leaveRequests]);

  const availableLeave = Math.max(state.leaveBalance - approvedLeaveDays, 0);

  const handlePersonalChange = (event) => {
    setPersonalInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleLeaveChange = (event) => {
    setLeaveRequest((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const submitPersonalInfo = (event) => {
    event.preventDefault();
    setState((prev) => ({ ...prev, personalInfo }));
    setMessage({ type: "success", text: "Personal info updated successfully." });
  };

  const submitLeaveRequest = (event) => {
    event.preventDefault();

    const start = new Date(leaveRequest.startDate);
    const end = new Date(leaveRequest.endDate);
    if (!leaveRequest.type || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
      setMessage({ type: "danger", text: "Please provide valid leave request dates and type." });
      return;
    }

    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const status = days <= availableLeave ? "Approved" : "Pending";
    const request = {
      id: `leave-${Date.now()}`,
      ...leaveRequest,
      days,
      status,
      submittedAt: new Date().toISOString().slice(0, 10),
    };

    setState((prev) => ({
      ...prev,
      leaveRequests: [request, ...prev.leaveRequests],
    }));
    setLeaveRequest(initialLeaveForm);
    setMessage({
      type: status === "Approved" ? "success" : "warning",
      text:
        status === "Approved"
          ? `Leave approved for ${days} day(s).`
          : `Leave submitted for review (${days} day(s)).`,
    });
  };

  const downloadPayslipPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Employee Payslip", 14, 16);
    doc.setFontSize(11);
    doc.text(`Employee: ${state.personalInfo.name}`, 14, 26);
    doc.text(`Email: ${state.personalInfo.email}`, 14, 32);
    doc.text("Month: December 2025", 14, 38);
    doc.text("Basic Salary: $2,000.00", 14, 48);
    doc.text("Allowances: $300.00", 14, 54);
    doc.text("Deductions: $100.00", 14, 60);
    doc.setFontSize(12);
    doc.text("Net Salary: $2,200.00", 14, 70);
    doc.save(`payslip-${state.personalInfo.name.replaceAll(" ", "-").toLowerCase()}.pdf`);
    setShowModal(false);
  };

  return (
    <Container className="mt-4">
      <h2>Employee Self-Service Portal (ESS)</h2>

      {message && (
        <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Row className="g-3 mb-2">
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Subtitle className="text-muted">Total Leave Entitlement</Card.Subtitle>
              <h4>{state.leaveBalance} days</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Subtitle className="text-muted">Approved Leave Used</Card.Subtitle>
              <h4>{approvedLeaveDays} days</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Subtitle className="text-muted">Available Leave</Card.Subtitle>
              <h4>{availableLeave} days</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="my-3">
        <Card.Header>Update Personal Info</Card.Header>
        <Card.Body>
          <Form onSubmit={submitPersonalInfo}>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={personalInfo.name} onChange={handlePersonalChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={personalInfo.email}
                onChange={handlePersonalChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="phone" value={personalInfo.phone} onChange={handlePersonalChange} />
            </Form.Group>
            <Button type="submit">Update Info</Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="my-3">
        <Card.Header>Payslip & Leave Balance</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Month</th>
                <th>Payslip</th>
                <th>Leave Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>December 2025</td>
                <td>
                  <Button onClick={() => setShowModal(true)}>Download</Button>
                </td>
                <td>{availableLeave} Days</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="my-3">
        <Card.Header>Request Leave</Card.Header>
        <Card.Body>
          <Form onSubmit={submitLeaveRequest}>
            <Form.Group className="mb-2">
              <Form.Label>Leave Type</Form.Label>
              <Form.Select name="type" value={leaveRequest.type} onChange={handleLeaveChange}>
                <option value="">Select Leave Type</option>
                <option>Sick</option>
                <option>Casual</option>
                <option>Annual</option>
                <option>Unpaid</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={leaveRequest.startDate}
                onChange={handleLeaveChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>End Date</Form.Label>
              <Form.Control type="date" name="endDate" value={leaveRequest.endDate} onChange={handleLeaveChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Reason</Form.Label>
              <Form.Control as="textarea" name="reason" value={leaveRequest.reason} onChange={handleLeaveChange} />
            </Form.Group>
            <Button type="submit">Submit Leave Request</Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="my-3">
        <Card.Header>Leave Request History</Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {state.leaveRequests.length > 0 ? (
                state.leaveRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.submittedAt}</td>
                    <td>{request.type}</td>
                    <td>{request.startDate}</td>
                    <td>{request.endDate}</td>
                    <td>{request.days}</td>
                    <td>
                      <Badge bg={statusVariant[request.status] || "secondary"}>{request.status}</Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-2">
                    No leave requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Payslip</Modal.Title>
        </Modal.Header>
        <Modal.Body>Download your latest payslip PDF.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button onClick={downloadPayslipPdf}>Download PDF</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ESS;
