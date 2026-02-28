import { useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card, Table, Button, Modal, Form, Row, Col, InputGroup, Badge } from "react-bootstrap";
import { useAppData } from "../context/AppDataContext";

const defaultForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  tier: "Standard",
};

const Customers = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAppData();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("All");

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesTier = tierFilter === "All" ? true : customer.tier === tierFilter;
      const text = `${customer.name} ${customer.email} ${customer.phone} ${customer.city}`.toLowerCase();
      return matchesTier && text.includes(search.toLowerCase());
    });
  }, [customers, search, tierFilter]);

  const openCreate = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setShowModal(true);
  };

  const openEdit = (customer) => {
    setEditingId(customer.id);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      tier: customer.tier,
    });
    setShowModal(true);
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (editingId) {
      updateCustomer(editingId, formData);
    } else {
      addCustomer(formData);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this customer and related sales?")) return;
    deleteCustomer(id);
  };

  return (
    <DashboardLayout>
      <div className="md:ml-64 p-6">
        <Row className="align-items-center mb-3 g-2">
          <Col md={4}>
            <h2 className="mb-0">Customers</h2>
          </Col>
          <Col md={3}>
            <Form.Select value={tierFilter} onChange={(event) => setTierFilter(event.target.value)}>
              <option value="All">All Tiers</option>
              <option value="Standard">Standard</option>
              <option value="Gold">Gold</option>
              <option value="Premium">Premium</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <InputGroup>
              <Form.Control
                placeholder="Search customers"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={2} className="text-md-end">
            <Button onClick={openCreate}>Add Customer</Button>
          </Col>
        </Row>

        <Card className="shadow-sm border-0">
          <Card.Body>
            <Table responsive hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Tier</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.city}</td>
                      <td>
                        <Badge
                          bg={
                            customer.tier === "Premium"
                              ? "success"
                              : customer.tier === "Gold"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {customer.tier}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => openEdit(customer)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(customer.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? "Edit Customer" : "Add Customer"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-2">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    required
                    value={formData.name}
                    onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, email: event.target.value }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    required
                    value={formData.phone}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, phone: event.target.value }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    required
                    value={formData.city}
                    onChange={(event) => setFormData((prev) => ({ ...prev, city: event.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tier</Form.Label>
                  <Form.Select
                    value={formData.tier}
                    onChange={(event) => setFormData((prev) => ({ ...prev, tier: event.target.value }))}
                  >
                    <option>Standard</option>
                    <option>Gold</option>
                    <option>Premium</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingId ? "Update" : "Create"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};

export default Customers;
