import DashboardLayout from "../layouts/DashboardLayout";
import { Card, Row, Col, Table, Button } from "react-bootstrap";
import { useAppData } from "../context/AppDataContext";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const downloadCsv = (filename, headers, rows) => {
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Reports = () => {
  const { sales, products, customers, bills } = useAppData();

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const paidRevenue = sales
    .filter((sale) => sale.paymentStatus === "Paid")
    .reduce((sum, sale) => sum + sale.total, 0);
  const pendingRevenue = totalRevenue - paidRevenue;
  const pendingBillsAmount = bills
    .filter((bill) => bill.status === "Pending")
    .reduce((sum, bill) => sum + bill.amount, 0);

  const salesByCustomer = customers
    .map((customer) => {
      const customerSales = sales.filter((sale) => sale.customerId === customer.id);
      const total = customerSales.reduce((sum, sale) => sum + sale.total, 0);
      return { customer: customer.name, orders: customerSales.length, total };
    })
    .filter((item) => item.orders > 0)
    .sort((left, right) => right.total - left.total);

  const stockReport = products
    .map((product) => ({
      name: product.name,
      sku: product.sku,
      stock: product.stock,
      reorderLevel: product.reorderLevel,
      status: product.stock <= product.reorderLevel ? "Low Stock" : "Healthy",
    }))
    .sort((left, right) => left.stock - right.stock);

  const exportSalesReport = () => {
    downloadCsv(
      "sales-report.csv",
      ["Sale ID", "Date", "Customer", "Payment Status", "Total"],
      sales.map((sale) => [sale.id, sale.date, sale.customerName, sale.paymentStatus, sale.total])
    );
  };

  const exportInventoryReport = () => {
    downloadCsv(
      "inventory-report.csv",
      ["SKU", "Product", "Stock", "Reorder Level", "Status"],
      stockReport.map((item) => [item.sku, item.name, item.stock, item.reorderLevel, item.status])
    );
  };

  return (
    <DashboardLayout>
      <div className="md:ml-64 p-6">
        <h2 className="mb-4">Business Reports</h2>

        <Row className="g-3 mb-4">
          <Col md={3}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <Card.Subtitle className="text-muted">Total Revenue</Card.Subtitle>
                <h4 className="mb-0">{currency.format(totalRevenue)}</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <Card.Subtitle className="text-muted">Paid Revenue</Card.Subtitle>
                <h4 className="mb-0 text-success">{currency.format(paidRevenue)}</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <Card.Subtitle className="text-muted">Pending Revenue</Card.Subtitle>
                <h4 className="mb-0 text-warning">{currency.format(pendingRevenue)}</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <Card.Subtitle className="text-muted">Pending Bills</Card.Subtitle>
                <h4 className="mb-0 text-danger">{currency.format(pendingBillsAmount)}</h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-3">
          <Col lg={6}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title className="mb-0">Sales by Customer</Card.Title>
                  <Button size="sm" onClick={exportSalesReport}>
                    Export CSV
                  </Button>
                </div>
                <Table responsive hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th className="text-end">Orders</th>
                      <th className="text-end">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesByCustomer.length > 0 ? (
                      salesByCustomer.map((item) => (
                        <tr key={item.customer}>
                          <td>{item.customer}</td>
                          <td className="text-end">{item.orders}</td>
                          <td className="text-end">{currency.format(item.total)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center text-muted py-3">
                          No sales data.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Card.Title className="mb-0">Inventory Health</Card.Title>
                  <Button size="sm" variant="outline-primary" onClick={exportInventoryReport}>
                    Export CSV
                  </Button>
                </div>
                <Table responsive hover className="mb-0">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Product</th>
                      <th className="text-end">Stock</th>
                      <th className="text-end">Reorder</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockReport.map((item) => (
                      <tr key={item.sku || item.name}>
                        <td>{item.sku || "-"}</td>
                        <td>{item.name}</td>
                        <td className="text-end">{item.stock}</td>
                        <td className="text-end">{item.reorderLevel}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
