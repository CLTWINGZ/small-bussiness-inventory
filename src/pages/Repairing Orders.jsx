import { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useAppData } from "../context/AppDataContext";

const defaultForm = {
  customer: "",
  product: "",
  issue: "",
  status: "Pending",
  price: "",
};

const OrdersPage = () => {
  const location = useLocation();
  const { repairOrders, addRepairOrder, updateRepairOrder, deleteRepairOrder } = useAppData();

  const [showModal, setShowModal] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingOrderId(null);
    setFormData(defaultForm);
    setShowModal(true);
  };

  const openEditModal = (order) => {
    setEditingOrderId(order.id);
    setFormData({
      customer: order.customer,
      product: order.product,
      issue: order.issue,
      status: order.status,
      price: String(order.price),
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingOrderId) {
      updateRepairOrder(editingOrderId, formData);
    } else {
      addRepairOrder(formData);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this order?")) return;
    deleteRepairOrder(id);
  };

  const statusByPath = {
    "/order/pending": "Pending",
    "/order/completed": "Completed",
    "/order/cancelled": "Cancelled",
  };

  const activeStatus = statusByPath[location.pathname] || "All";
  const visibleOrders =
    activeStatus === "All"
      ? repairOrders
      : repairOrders.filter((order) => order.status === activeStatus);

  return (
    <DashboardLayout>
      <div className="md:ml-64 p-6">
        <h2 className="mb-2 text-primary">Repairing Orders</h2>
        <p className="text-muted mb-3">Current view: {activeStatus}</p>
        <Button variant="success" className="mb-3" onClick={openCreateModal}>
          Add New Order
        </Button>

        <Table striped bordered hover responsive className="shadow-sm text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Price</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleOrders.length > 0 ? (
              visibleOrders.map((order) => (
                <tr key={order.id}>
                  <td className="fw-semibold">{order.customer}</td>
                  <td>{order.product}</td>
                  <td>{order.issue}</td>
                  <td
                    className={`fw-bold ${
                      order.status === "Pending"
                        ? "text-warning"
                        : order.status === "Completed"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {order.status}
                  </td>
                  <td className="text-success fw-bold">${Number(order.price).toFixed(2)}</td>
                  <td>{order.createdAt}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => openEditModal(order)}
                    >
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(order.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-muted py-3">
                  No orders for this status.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingOrderId ? "Edit Order" : "Add Order"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Customer</Form.Label>
              <Form.Control
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                placeholder="Customer Name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Control
                type="text"
                name="product"
                value={formData.product}
                onChange={handleChange}
                placeholder="Product Name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Issue / Repair Details</Form.Label>
              <Form.Control
                type="text"
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                placeholder="Describe the issue"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange}>
                <option>Pending</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Repair Price"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editingOrderId ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default OrdersPage;
