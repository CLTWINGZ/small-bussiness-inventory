import { useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card, Form, Row, Col, Table, Button, Badge } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAppData } from "../context/AppDataContext";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const Invoice = () => {
  const { sales } = useAppData();
  const [selectedSaleId, setSelectedSaleId] = useState("");

  const selectedSale = useMemo(
    () => sales.find((sale) => sale.id === selectedSaleId) || null,
    [sales, selectedSaleId]
  );

  const exportInvoicePdf = () => {
    if (!selectedSale) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Inventory Manager - Invoice", 14, 16);
    doc.setFontSize(11);
    doc.text(`Invoice ID: ${selectedSale.id}`, 14, 26);
    doc.text(`Date: ${selectedSale.date}`, 14, 32);
    doc.text(`Customer: ${selectedSale.customerName}`, 14, 38);
    doc.text(`Payment Status: ${selectedSale.paymentStatus}`, 14, 44);

    autoTable(doc, {
      startY: 50,
      head: [["Product", "Qty", "Unit Price", "Line Total"]],
      body: selectedSale.items.map((item) => [
        item.productName,
        String(item.quantity),
        currency.format(item.unitPrice),
        currency.format(item.lineTotal),
      ]),
    });

    const tableEndY = doc.lastAutoTable?.finalY || 70;
    doc.text(`Subtotal: ${currency.format(selectedSale.subtotal)}`, 14, tableEndY + 10);
    doc.text(`Tax: ${currency.format(selectedSale.tax)}`, 14, tableEndY + 16);
    doc.setFontSize(12);
    doc.text(`Total: ${currency.format(selectedSale.total)}`, 14, tableEndY + 24);
    doc.save(`invoice-${selectedSale.id}.pdf`);
  };

  return (
    <DashboardLayout>
      <div className="md:ml-64 p-6">
        <h2 className="mb-3">Invoice</h2>

        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <Row className="g-2 align-items-end">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Select Sale</Form.Label>
                  <Form.Select
                    value={selectedSaleId}
                    onChange={(event) => setSelectedSaleId(event.target.value)}
                  >
                    <option value="">Choose sale record</option>
                    {sales.map((sale) => (
                      <option key={sale.id} value={sale.id}>
                        {sale.id} - {sale.customerName} - {sale.date}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Button className="w-100" disabled={!selectedSale} onClick={exportInvoicePdf}>
                  Export PDF
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {selectedSale ? (
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="mb-1">Invoice {selectedSale.id}</h5>
                  <div className="text-muted">Customer: {selectedSale.customerName}</div>
                  <div className="text-muted">Date: {selectedSale.date}</div>
                </div>
                <Badge bg={selectedSale.paymentStatus === "Paid" ? "success" : "warning"}>
                  {selectedSale.paymentStatus}
                </Badge>
              </div>

              <Table responsive className="mb-3">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th className="text-end">Quantity</th>
                    <th className="text-end">Unit Price</th>
                    <th className="text-end">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSale.items.map((item) => (
                    <tr key={item.productId}>
                      <td>{item.productName}</td>
                      <td className="text-end">{item.quantity}</td>
                      <td className="text-end">{currency.format(item.unitPrice)}</td>
                      <td className="text-end">{currency.format(item.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="text-end">
                <div>Subtotal: {currency.format(selectedSale.subtotal)}</div>
                <div>Tax: {currency.format(selectedSale.tax)}</div>
                <h5 className="mt-1">Total: {currency.format(selectedSale.total)}</h5>
              </div>
            </Card.Body>
          </Card>
        ) : (
          <Card className="shadow-sm border-0">
            <Card.Body className="text-muted">Select a sale to preview invoice details.</Card.Body>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Invoice;
