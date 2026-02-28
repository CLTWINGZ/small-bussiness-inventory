// src/components/Payroll.jsx
import React, { useState } from "react";
import { Card, Form, Button, Table, Row, Col } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [form, setForm] = useState({
    employeeName: "",
    baseSalary: 0,
    epf: 0,
    etf: 0,
    taxes: 0,
    loans: 0,
    overtime: 0,
    bonuses: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: Number(value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalDeductions = form.epf + form.etf + form.taxes + form.loans;
    const netSalary = form.baseSalary - totalDeductions + form.overtime + form.bonuses;

    setPayrolls([...payrolls, { ...form, netSalary, totalDeductions }]);
    setForm({
      employeeName: "",
      baseSalary: 0,
      epf: 0,
      etf: 0,
      taxes: 0,
      loans: 0,
      overtime: 0,
      bonuses: 0,
    });
  };

  const generatePayslip = (payroll) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Payslip", 105, 20, { align: "center" });
    doc.setFontSize(12);

    doc.text(`Employee: ${payroll.employeeName}`, 20, 40);
    doc.text(`Base Salary: ${payroll.baseSalary}`, 20, 50);
    doc.text(`EPF: ${payroll.epf}`, 20, 60);
    doc.text(`ETF: ${payroll.etf}`, 20, 70);
    doc.text(`Taxes: ${payroll.taxes}`, 20, 80);
    doc.text(`Loans: ${payroll.loans}`, 20, 90);
    doc.text(`Overtime: ${payroll.overtime}`, 20, 100);
    doc.text(`Bonuses: ${payroll.bonuses}`, 20, 110);
    doc.text(`Net Salary: ${payroll.netSalary}`, 20, 120);

    doc.save(`${payroll.employeeName}_Payslip.pdf`);
  };

  return (
    <div>
      {/* Payroll Form */}
      <Card className="mb-4">
        <Card.Header>Generate Payroll</Card.Header>
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
                    onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Base Salary</Form.Label>
                  <Form.Control
                    type="number"
                    name="baseSalary"
                    value={form.baseSalary}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={3} xs={6}>
                <Form.Group>
                  <Form.Label>EPF</Form.Label>
                  <Form.Control type="number" name="epf" value={form.epf} onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col md={3} xs={6}>
                <Form.Group>
                  <Form.Label>ETF</Form.Label>
                  <Form.Control type="number" name="etf" value={form.etf} onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col md={3} xs={6}>
                <Form.Group>
                  <Form.Label>Taxes</Form.Label>
                  <Form.Control type="number" name="taxes" value={form.taxes} onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col md={3} xs={6}>
                <Form.Group>
                  <Form.Label>Loans</Form.Label>
                  <Form.Control type="number" name="loans" value={form.loans} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Overtime</Form.Label>
                  <Form.Control type="number" name="overtime" value={form.overtime} onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col md={6} xs={12}>
                <Form.Group>
                  <Form.Label>Bonuses</Form.Label>
                  <Form.Control type="number" name="bonuses" value={form.bonuses} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" variant="primary">
              Generate Payroll
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Payroll Table */}
      <Card>
        <Card.Header>Payroll Records</Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Base Salary</th>
                  <th>Deductions</th>
                  <th>Overtime</th>
                  <th>Bonuses</th>
                  <th>Net Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((p, index) => (
                  <tr key={index}>
                    <td>{p.employeeName}</td>
                    <td>{p.baseSalary}</td>
                    <td>{p.totalDeductions}</td>
                    <td>{p.overtime}</td>
                    <td>{p.bonuses}</td>
                    <td>{p.netSalary}</td>
                    <td>
                      <Button size="sm" variant="success" onClick={() => generatePayslip(p)}>
                        PDF Payslip
                      </Button>
                    </td>
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

export default Payroll;
