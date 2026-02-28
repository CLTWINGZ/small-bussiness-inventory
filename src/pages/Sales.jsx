import { useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card, Table, Form, Row, Col, Button, Alert, Badge } from "react-bootstrap";
import { useAppData } from "../context/AppDataContext";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const defaultSaleForm = {
  customerId: "",
  productId: "",
  quantity: 1,
  paymentStatus: "Paid",
};

const Sales = () => {
  const { customers, products, sales, createSale } = useAppData();

  const [formData, setFormData] = useState(defaultSaleForm);
  const [feedback, setFeedback] = useState(null);

  const saleProducts = useMemo(() => products.filter((product) => product.stock > 0), [products]);

  const selectedProduct = saleProducts.find((product) => product.id === formData.productId);
  const estimatedSubtotal = selectedProduct
    ? selectedProduct.unitPrice * Number(formData.quantity || 0)
    : 0;
  const estimatedTax = estimatedSubtotal * 0.05;
  const estimatedTotal = estimatedSubtotal + estimatedTax;

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = createSale(formData);
    if (!result.ok) {
      setFeedback({ type: "danger", message: result.message });
      return;
    }
    setFeedback({ type: "success", message: `Sale ${result.sale.id} created successfully.` });
    setFormData(defaultSaleForm);
  };

  return (
    <DashboardLayout>
      <div className="md:ml-64 p-6">
        <h2 className="mb-3">Sales</h2>

        {feedback && (
          <Alert variant={feedback.type} dismissible onClose={() => setFeedback(null)}>
            {feedback.message}
          </Alert>
        )}

        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <Card.Title>Create Sale</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Row className="g-2">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Customer</Form.Label>
                    <Form.Select
                      required
                      value={formData.customerId}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, customerId: event.target.value }))
                      }
                    >
                      <option value="">Select customer</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Product</Form.Label>
                    <Form.Select
                      required
                      value={formData.productId}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, productId: event.target.value }))
                      }
                    >
                      <option value="">Select product</option>
                      {saleProducts.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} (stock: {product.stock})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      required
                      value={formData.quantity}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, quantity: event.target.value }))
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Payment Status</Form.Label>
                    <Form.Select
                      value={formData.paymentStatus}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, paymentStatus: event.target.value }))
                      }
                    >
                      <option>Paid</option>
                      <option>Pending</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button type="submit" className="w-100">
                    Create
                  </Button>
                </Col>
              </Row>
            </Form>

            <div className="mt-3 text-muted">
              Estimated Total: {currency.format(estimatedTotal)} (incl. tax {currency.format(estimatedTax)})
            </div>
          </Card.Body>
        </Card>

        <Card className="shadow-sm border-0">
          <Card.Body>
            <Card.Title>Sales History</Card.Title>
            <Table responsive hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sale ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.length > 0 ? (
                  sales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.date}</td>
                      <td>{sale.id}</td>
                      <td>{sale.customerName}</td>
                      <td>
                        {sale.items.map((item) => `${item.productName} x${item.quantity}`).join(", ")}
                      </td>
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
                    <td colSpan={6} className="text-center text-muted py-4">
                      No sales yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Sales;
