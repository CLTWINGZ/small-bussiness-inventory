import React from "react";
import { Container, Table, Button, Tabs, Tab, Row, Col, Card } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const attendanceReports = [
  { id: 1, name: "John Doe", daysPresent: 20, daysAbsent: 2 },
  { id: 2, name: "Jane Smith", daysPresent: 18, daysAbsent: 4 },
];

const payrollReports = [
  { id: 1, name: "John Doe", salary: 2000, bonus: 200, deductions: 50 },
  { id: 2, name: "Jane Smith", salary: 2200, bonus: 150, deductions: 100 },
];

const performanceReports = [
  { id: 1, name: "John Doe", kpiScore: 85, appraisal: "Excellent" },
  { id: 2, name: "Jane Smith", kpiScore: 78, appraisal: "Good" },
];

const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;

const downloadCsv = (filename, headers, rows) => {
  const csv = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadPdf = (title, headers, rows, filename) => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(title, 14, 16);
  autoTable(doc, {
    startY: 24,
    head: [headers],
    body: rows,
  });
  doc.save(filename);
};

const Reports = () => {
  const exportAttendance = (type) => {
    const headers = ["ID", "Employee Name", "Days Present", "Days Absent"];
    const rows = attendanceReports.map((item) => [item.id, item.name, item.daysPresent, item.daysAbsent]);

    if (type === "pdf") {
      downloadPdf("Attendance Report", headers, rows, "attendance-report.pdf");
      return;
    }

    const extension = type === "excel" ? "xls" : "csv";
    downloadCsv(`attendance-report.${extension}`, headers, rows);
  };

  const exportPayroll = (type) => {
    const headers = ["ID", "Employee Name", "Salary", "Bonus", "Deductions"];
    const rows = payrollReports.map((item) => [
      item.id,
      item.name,
      formatCurrency(item.salary),
      formatCurrency(item.bonus),
      formatCurrency(item.deductions),
    ]);

    if (type === "pdf") {
      downloadPdf("Payroll Report", headers, rows, "payroll-report.pdf");
      return;
    }

    const extension = type === "excel" ? "xls" : "csv";
    downloadCsv(`payroll-report.${extension}`, headers, rows);
  };

  const exportPerformance = (type) => {
    const headers = ["ID", "Employee Name", "KPI Score", "Appraisal"];
    const rows = performanceReports.map((item) => [item.id, item.name, item.kpiScore, item.appraisal]);

    if (type === "pdf") {
      downloadPdf("Performance Report", headers, rows, "performance-report.pdf");
      return;
    }

    const extension = type === "excel" ? "xls" : "csv";
    downloadCsv(`performance-report.${extension}`, headers, rows);
  };

  return (
    <Container className="py-4">
      <Row className="g-3 mb-3">
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Subtitle className="text-muted">Attendance Records</Card.Subtitle>
              <h4>{attendanceReports.length}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Subtitle className="text-muted">Payroll Records</Card.Subtitle>
              <h4>{payrollReports.length}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Subtitle className="text-muted">Performance Reviews</Card.Subtitle>
              <h4>{performanceReports.length}</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="mb-4">Reports & Analytics</h2>

      <Tabs defaultActiveKey="attendance" id="reports-tabs" className="mb-3">
        <Tab eventKey="attendance" title="Attendance Reports">
          <div className="mb-3 d-flex gap-2 flex-wrap">
            <Button variant="primary" onClick={() => exportAttendance("pdf")}>
              Export PDF
            </Button>
            <Button variant="success" onClick={() => exportAttendance("excel")}>
              Export Excel
            </Button>
            <Button variant="secondary" onClick={() => exportAttendance("csv")}>
              Export CSV
            </Button>
          </div>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Employee Name</th>
                <th>Days Present</th>
                <th>Days Absent</th>
              </tr>
            </thead>
            <tbody>
              {attendanceReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.name}</td>
                  <td>{report.daysPresent}</td>
                  <td>{report.daysAbsent}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="payroll" title="Payroll Reports">
          <div className="mb-3 d-flex gap-2 flex-wrap">
            <Button variant="primary" onClick={() => exportPayroll("pdf")}>
              Export PDF
            </Button>
            <Button variant="success" onClick={() => exportPayroll("excel")}>
              Export Excel
            </Button>
            <Button variant="secondary" onClick={() => exportPayroll("csv")}>
              Export CSV
            </Button>
          </div>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Employee Name</th>
                <th>Salary</th>
                <th>Bonus</th>
                <th>Deductions</th>
              </tr>
            </thead>
            <tbody>
              {payrollReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.name}</td>
                  <td>{formatCurrency(report.salary)}</td>
                  <td>{formatCurrency(report.bonus)}</td>
                  <td>{formatCurrency(report.deductions)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="performance" title="Employee Performance">
          <div className="mb-3 d-flex gap-2 flex-wrap">
            <Button variant="primary" onClick={() => exportPerformance("pdf")}>
              Export PDF
            </Button>
            <Button variant="success" onClick={() => exportPerformance("excel")}>
              Export Excel
            </Button>
            <Button variant="secondary" onClick={() => exportPerformance("csv")}>
              Export CSV
            </Button>
          </div>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Employee Name</th>
                <th>KPI Score</th>
                <th>Appraisal</th>
              </tr>
            </thead>
            <tbody>
              {performanceReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.name}</td>
                  <td>{report.kpiScore}</td>
                  <td>{report.appraisal}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Reports;
