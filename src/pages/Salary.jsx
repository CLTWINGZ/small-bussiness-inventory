import React, { useState } from "react";
import { Container, Card, Table, Button, Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

const salaryData = [
  {
    id: 1,
    month: "December 2025",
    basic: 5000,
    allowances: 1000,
    deductions: 500,
    net: 5500,
  },
  {
    id: 2,
    month: "November 2025",
    basic: 5000,
    allowances: 1000,
    deductions: 400,
    net: 5600,
  },
];

const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;

const Salary = () => {
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewPayslip = (salary) => {
    setSelectedSalary(salary);
    setShowModal(true);
  };

  const handleDownloadPayslip = () => {
    if (!selectedSalary) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Salary Payslip", 14, 16);
    doc.setFontSize(11);
    doc.text(`Month: ${selectedSalary.month}`, 14, 28);
    doc.text(`Basic: ${formatCurrency(selectedSalary.basic)}`, 14, 36);
    doc.text(`Allowances: ${formatCurrency(selectedSalary.allowances)}`, 14, 44);
    doc.text(`Deductions: ${formatCurrency(selectedSalary.deductions)}`, 14, 52);
    doc.setFontSize(13);
    doc.text(`Net Salary: ${formatCurrency(selectedSalary.net)}`, 14, 64);
    doc.save(`payslip-${selectedSalary.month.replaceAll(" ", "-").toLowerCase()}.pdf`);
  };

  return (
    <DashboardLayout>
      <div className="md:ml-64 p-6">
        <Container className="mt-4">
          <h2>Salary Management</h2>

          <Card className="my-3">
            <Card.Header>Salary Details</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Basic</th>
                    <th>Allowances</th>
                    <th>Deductions</th>
                    <th>Net Salary</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryData.map((salary) => (
                    <tr key={salary.id}>
                      <td>{salary.month}</td>
                      <td>{formatCurrency(salary.basic)}</td>
                      <td>{formatCurrency(salary.allowances)}</td>
                      <td>{formatCurrency(salary.deductions)}</td>
                      <td>{formatCurrency(salary.net)}</td>
                      <td>
                        <Button variant="primary" onClick={() => handleViewPayslip(salary)}>
                          View Payslip
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Payslip - {selectedSalary?.month}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedSalary && (
                <div>
                  <p>
                    <strong>Basic:</strong> {formatCurrency(selectedSalary.basic)}
                  </p>
                  <p>
                    <strong>Allowances:</strong> {formatCurrency(selectedSalary.allowances)}
                  </p>
                  <p>
                    <strong>Deductions:</strong> {formatCurrency(selectedSalary.deductions)}
                  </p>
                  <p>
                    <strong>Net Salary:</strong> {formatCurrency(selectedSalary.net)}
                  </p>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="success" onClick={handleDownloadPayslip} disabled={!selectedSalary}>
                Download Payslip
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </DashboardLayout>
  );
};

export default Salary;
