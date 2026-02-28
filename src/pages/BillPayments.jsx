import { useState } from "react";
import { Container, Card, Table, Button, Modal, Form, Row, Col, Alert, Badge } from "react-bootstrap";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAppData } from "../context/AppDataContext";

const defaultBillForm = {
  billName: "",
  vendor: "",
  amount: "",
  dueDate: "",
};

const BillPayments = () => {
  const { bills, addBill, payBill } = useAppData();

  const [selectedBill, setSelectedBill] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [newBill, setNewBill] = useState(defaultBillForm);
  const [feedback, setFeedback] = useState(null);

  const handleOpenPay = (bill) => {
    setSelectedBill(bill);
    setPaymentAmount(String(bill.amount));
    setShowPayModal(true);
  };

  const submitPayment = (event) => {
    event.preventDefault();
    const result = payBill(selectedBill.id, paymentAmount);
    if (!result.ok) {
      setFeedback({ type: "danger", message: result.message });
      return;
    }
    setFeedback({ type: "success", message: `Bill ${selectedBill.billName} marked as paid.` });
    setShowPayModal(false);
  };

  const submitNewBill = (event) => {
    event.preventDefault();
    addBill(newBill);
    setNewBill(defaultBillForm);
    setShowAddModal(false);
    setFeedback({ type: "success", message: "Bill added successfully." });
  };

  return (
    <DashboardLayout>
      <div className="md:ml-64 p-6">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">Bill Payments</h2>
            <Button onClick={() => setShowAddModal(true)}>Add Bill</Button>
          </div>

          {feedback && (
            <Alert variant={feedback.type} dismissible onClose={() => setFeedback(null)}>
              {feedback.message}
            </Alert>
          )}

          <Card className="shadow-sm border-0">
            <Card.Header>Pending & Paid Bills</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive className="mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Bill Name</th>
                    <th>Vendor</th>
                    <th className="text-end">Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.length > 0 ? (
                    bills.map((bill) => (
                      <tr key={bill.id}>
                        <td>{bill.billName}</td>
                        <td>{bill.vendor}</td>
                        <td className="text-end">${bill.amount.toFixed(2)}</td>
                        <td>{bill.dueDate}</td>
                        <td>
                          <Badge bg={bill.status === "Paid" ? "success" : "warning"}>{bill.status}</Badge>
                        </td>
                        <td className="text-end">
                          {bill.status === "Pending" ? (
                            <Button size="sm" variant="success" onClick={() => handleOpenPay(bill)}>
                              Pay Now
                            </Button>
                          ) : (
                            <small className="text-muted">Paid on {bill.paidAt}</small>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-3">
                        No bills found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Container>
      </div>

      <Modal show={showPayModal} onHide={() => setShowPayModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pay Bill - {selectedBill?.billName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitPayment}>
            <Form.Group className="mb-2">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(event.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="success">
              Submit Payment
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Form onSubmit={submitNewBill}>
          <Modal.Header closeButton>
            <Modal.Title>Add Bill</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-2">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Bill Name</Form.Label>
                  <Form.Control
                    required
                    value={newBill.billName}
                    onChange={(event) =>
                      setNewBill((prev) => ({ ...prev, billName: event.target.value }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Vendor</Form.Label>
                  <Form.Control
                    required
                    value={newBill.vendor}
                    onChange={(event) => setNewBill((prev) => ({ ...prev, vendor: event.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={newBill.amount}
                    onChange={(event) => setNewBill((prev) => ({ ...prev, amount: event.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    required
                    value={newBill.dueDate}
                    onChange={(event) => setNewBill((prev) => ({ ...prev, dueDate: event.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Bill</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};

export default BillPayments;
