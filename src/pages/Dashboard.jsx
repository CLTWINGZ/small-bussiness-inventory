import DashboardLayout from "../layouts/DashboardLayout";
import { Card, Row, Col, Table, Badge, Button } from "react-bootstrap";
import { useAppData } from "../context/AppDataContext";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const Dashboard = () => {
  const { dashboardStats, resetAllData } = useAppData();

  const statCards = [
    { title: "Products", value: dashboardStats.productCount, variant: "primary" },
    { title: "Customers", value: dashboardStats.customerCount, variant: "info" },
    { title: "Pending Repairs", value: dashboardStats.pendingRepairs, variant: "warning" },
    { title: "Pending Bills", value: dashboardStats.pendingBills, variant: "danger" },
    {
      title: "Monthly Revenue",
      value: currency.format(dashboardStats.monthlyRevenue),
      variant: "success",
    },
  ];

  return (
    <DashboardLayout>
      <div className="md:ml-64 p-6">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Business Dashboard</h2>
          <Button variant="outline-danger" size="sm" onClick={resetAllData}>
            Reset Demo Data
          </Button>
        </div>

        <Row className="g-3 mb-4">
          {statCards.map((card) => (
            <Col key={card.title} xs={12} md={6} xl={3}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <Card.Subtitle className="text-muted mb-2">{card.title}</Card.Subtitle>
                  <h3 className={`text-${card.variant} mb-0`}>{card.value}</h3>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="g-3">
          <Col lg={7}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <Card.Title>Recent Sales</Card.Title>
                <Table responsive hover size="sm" className="mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardStats.recentSales.length > 0 ? (
                      dashboardStats.recentSales.map((sale) => (
                        <tr key={sale.id}>
                          <td>{sale.date}</td>
                          <td>{sale.customerName}</td>
                          <td>
                            <Badge bg={sale.paymentStatus === "Paid" ? "success" : "warning"}>
                              {sale.paymentStatus}
                            </Badge>
                          </td>
                          <td className="text-end">{currency.format(sale.total)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center text-muted py-3">
                          No sales yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5}>
            <Card className="shadow-sm border-0 mb-3">
              <Card.Body>
                <Card.Title>Low Stock Alerts</Card.Title>
                {dashboardStats.lowStockProducts.length > 0 ? (
                  <ul className="mb-0 ps-3">
                    {dashboardStats.lowStockProducts.map((product) => (
                      <li key={product.id}>
                        {product.name} ({product.stock} left, reorder at {product.reorderLevel})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted mb-0">All products are above reorder level.</p>
                )}
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title>Recent Repair Orders</Card.Title>
                <Table responsive size="sm" className="mb-0">
                  <tbody>
                    {dashboardStats.recentRepairs.length > 0 ? (
                      dashboardStats.recentRepairs.map((order) => (
                        <tr key={order.id}>
                          <td>{order.customer}</td>
                          <td>{order.product}</td>
                          <td>
                            <Badge
                              bg={
                                order.status === "Completed"
                                  ? "success"
                                  : order.status === "Pending"
                                  ? "warning"
                                  : "secondary"
                              }
                            >
                              {order.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="text-center text-muted py-2">No repair orders.</td>
                      </tr>
                    )}
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

export default Dashboard;
