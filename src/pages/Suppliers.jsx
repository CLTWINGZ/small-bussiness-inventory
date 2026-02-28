import { useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  Tabs,
  Tab,
  Card,
  Row,
  Col,
  Form,
  Table,
  Button,
  Modal,
  Badge,
  Alert,
} from "react-bootstrap";
import { useAppData } from "../context/AppDataContext";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const defaultSupplierForm = {
  name: "",
  businessType: "Distributor",
  email: "",
  phone: "",
  address: "",
  category: "Mobile Phone",
  products: "",
  leadTimeDays: "",
  paymentTerms: "Net 30",
  complianceStatus: "Pending",
  status: "Active",
  rating: "4.0",
};

const defaultPoForm = {
  supplierId: "",
  productId: "",
  itemName: "",
  quantity: 1,
  unitCost: "",
  etaDate: "",
};

const Suppliers = () => {
  const {
    suppliers,
    purchaseOrders,
    products,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    createPurchaseOrder,
    updatePurchaseOrderStatus,
    deletePurchaseOrder,
  } = useAppData();

  const [activeTab, setActiveTab] = useState("overview");
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [supplierForm, setSupplierForm] = useState(defaultSupplierForm);
  const [poForm, setPoForm] = useState(defaultPoForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [complianceFilter, setComplianceFilter] = useState("All");
  const [message, setMessage] = useState(null);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const haystack = `${supplier.name} ${supplier.email} ${supplier.category} ${supplier.products}`.toLowerCase();
      const matchesSearch = haystack.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" ? true : supplier.status === statusFilter;
      const matchesCompliance =
        complianceFilter === "All" ? true : supplier.complianceStatus === complianceFilter;
      return matchesSearch && matchesStatus && matchesCompliance;
    });
  }, [suppliers, searchTerm, statusFilter, complianceFilter]);

  const supplierInsights = useMemo(() => {
    const activeSuppliers = suppliers.filter((supplier) => supplier.status === "Active").length;
    const approvedSuppliers = suppliers.filter(
      (supplier) => supplier.complianceStatus === "Approved"
    ).length;
    const avgLeadTime = suppliers.length
      ? suppliers.reduce((sum, supplier) => sum + Number(supplier.leadTimeDays || 0), 0) / suppliers.length
      : 0;
    const openPoValue = purchaseOrders
      .filter((order) => order.status !== "Delivered" && order.status !== "Cancelled")
      .reduce((sum, order) => sum + Number(order.totalCost || 0), 0);

    const recentOrders = [...purchaseOrders].slice(0, 5);

    return {
      activeSuppliers,
      approvedSuppliers,
      avgLeadTime,
      openPoValue,
      recentOrders,
    };
  }, [suppliers, purchaseOrders]);

  const supplierPerformance = useMemo(() => {
    return suppliers
      .map((supplier) => {
        const orders = purchaseOrders.filter((order) => order.supplierId === supplier.id);
        const deliveredOrders = orders.filter((order) => order.status === "Delivered").length;
        const orderCount = orders.length;
        const fulfillmentRate = orderCount > 0 ? (deliveredOrders / orderCount) * 100 : 0;
        const totalSpend = orders.reduce((sum, order) => sum + Number(order.totalCost || 0), 0);
        return {
          id: supplier.id,
          name: supplier.name,
          rating: Number(supplier.rating || 0),
          leadTimeDays: Number(supplier.leadTimeDays || 0),
          complianceStatus: supplier.complianceStatus,
          status: supplier.status,
          orderCount,
          fulfillmentRate,
          totalSpend,
        };
      })
      .sort((a, b) => b.totalSpend - a.totalSpend);
  }, [suppliers, purchaseOrders]);

  const openCreateSupplierModal = () => {
    setEditingSupplierId(null);
    setSupplierForm(defaultSupplierForm);
    setShowSupplierModal(true);
  };

  const openEditSupplierModal = (supplier) => {
    setEditingSupplierId(supplier.id);
    setSupplierForm({
      name: supplier.name,
      businessType: supplier.businessType,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      category: supplier.category,
      products: supplier.products,
      leadTimeDays: String(supplier.leadTimeDays),
      paymentTerms: supplier.paymentTerms,
      complianceStatus: supplier.complianceStatus,
      status: supplier.status,
      rating: String(supplier.rating),
    });
    setShowSupplierModal(true);
  };

  const handleSaveSupplier = (event) => {
    event.preventDefault();
    if (editingSupplierId) {
      updateSupplier(editingSupplierId, supplierForm);
      setMessage({ type: "success", text: "Supplier updated." });
    } else {
      addSupplier(supplierForm);
      setMessage({ type: "success", text: "Supplier created." });
    }
    setShowSupplierModal(false);
  };

  const handleDeleteSupplier = (supplierId) => {
    if (!window.confirm("Delete this supplier and related purchase orders?")) return;
    deleteSupplier(supplierId);
    setMessage({ type: "success", text: "Supplier deleted." });
  };

  const handlePoProductSelect = (productId) => {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      setPoForm((prev) => ({ ...prev, productId: "", itemName: "", unitCost: "" }));
      return;
    }
    setPoForm((prev) => ({
      ...prev,
      productId,
      itemName: product.name,
      unitCost: String(product.unitPrice),
    }));
  };

  const handleCreatePo = (event) => {
    event.preventDefault();
    const result = createPurchaseOrder(poForm);
    if (!result.ok) {
      setMessage({ type: "danger", text: result.message });
      return;
    }
    setMessage({ type: "success", text: `Purchase order ${result.po.id} created.` });
    setPoForm(defaultPoForm);
  };

  const handlePoStatusUpdate = (orderId, status) => {
    const result = updatePurchaseOrderStatus(orderId, status);
    if (!result.ok) {
      setMessage({ type: "danger", text: result.message });
      return;
    }
    setMessage({ type: "success", text: `Order ${orderId} updated to ${status}.` });
  };

  const handleDeletePo = (orderId) => {
    if (!window.confirm("Delete this purchase order?")) return;
    deletePurchaseOrder(orderId);
    setMessage({ type: "success", text: "Purchase order deleted." });
  };

  return (
    <DashboardLayout>
      <div className="md:ml-64 p-6 bg-gray-100 min-h-screen">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Supplier Operations</h2>
          <Button onClick={openCreateSupplierModal}>Add Supplier</Button>
        </div>

        {message && (
          <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key || "overview")} className="mb-3">
          <Tab eventKey="overview" title="Overview">
            <Row className="g-3 mb-3">
              <Col md={3}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <Card.Subtitle className="text-muted">Total Suppliers</Card.Subtitle>
                    <h4>{suppliers.length}</h4>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <Card.Subtitle className="text-muted">Active Suppliers</Card.Subtitle>
                    <h4>{supplierInsights.activeSuppliers}</h4>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <Card.Subtitle className="text-muted">Approved Compliance</Card.Subtitle>
                    <h4>{supplierInsights.approvedSuppliers}</h4>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <Card.Subtitle className="text-muted">Open PO Value</Card.Subtitle>
                    <h4>{currency.format(supplierInsights.openPoValue)}</h4>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="g-3">
              <Col lg={5}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <Card.Title>Lead Time Benchmark</Card.Title>
                    <p className="mb-0">
                      Average supplier lead time: <strong>{supplierInsights.avgLeadTime.toFixed(1)} days</strong>
                    </p>
                    <small className="text-muted">
                      Use this to negotiate contract terms and safety stock levels.
                    </small>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={7}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <Card.Title>Recent Purchase Orders</Card.Title>
                    <Table responsive size="sm" className="mb-0 align-middle">
                      <thead>
                        <tr>
                          <th>PO</th>
                          <th>Supplier</th>
                          <th>Item</th>
                          <th>Status</th>
                          <th className="text-end">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supplierInsights.recentOrders.length > 0 ? (
                          supplierInsights.recentOrders.map((order) => (
                            <tr key={order.id}>
                              <td>{order.id}</td>
                              <td>{order.supplierName}</td>
                              <td>{order.itemName}</td>
                              <td>{order.status}</td>
                              <td className="text-end">{currency.format(order.totalCost)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center text-muted py-3">
                              No purchase orders yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="suppliers" title="Supplier Registry">
            <Card className="shadow-sm border-0 mb-3">
              <Card.Body>
                <Row className="g-2">
                  <Col md={4}>
                    <Form.Control
                      placeholder="Search by name, email, category"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                    >
                      <option>All</option>
                      <option>Active</option>
                      <option>On Hold</option>
                      <option>Inactive</option>
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Select
                      value={complianceFilter}
                      onChange={(event) => setComplianceFilter(event.target.value)}
                    >
                      <option>All</option>
                      <option>Approved</option>
                      <option>Pending</option>
                      <option>Rejected</option>
                    </Form.Select>
                  </Col>
                  <Col md={2} className="text-md-end">
                    <Button variant="outline-primary" onClick={openCreateSupplierModal}>
                      New Supplier
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0">
              <Card.Body>
                <Table responsive hover className="mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Contact</th>
                      <th>Lead Time</th>
                      <th>Terms</th>
                      <th>Status</th>
                      <th>Compliance</th>
                      <th>Rating</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.length > 0 ? (
                      filteredSuppliers.map((supplier) => (
                        <tr key={supplier.id}>
                          <td>
                            <div>{supplier.name}</div>
                            <small className="text-muted">{supplier.businessType}</small>
                          </td>
                          <td>{supplier.category}</td>
                          <td>
                            <div>{supplier.email}</div>
                            <small>{supplier.phone}</small>
                          </td>
                          <td>{supplier.leadTimeDays} days</td>
                          <td>{supplier.paymentTerms}</td>
                          <td>
                            <Badge bg={supplier.status === "Active" ? "success" : "secondary"}>
                              {supplier.status}
                            </Badge>
                          </td>
                          <td>
                            <Badge
                              bg={
                                supplier.complianceStatus === "Approved"
                                  ? "success"
                                  : supplier.complianceStatus === "Pending"
                                  ? "warning"
                                  : "danger"
                              }
                            >
                              {supplier.complianceStatus}
                            </Badge>
                          </td>
                          <td>{Number(supplier.rating).toFixed(1)}</td>
                          <td className="text-end">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="me-2"
                              onClick={() => openEditSupplierModal(supplier)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDeleteSupplier(supplier.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="text-center text-muted py-3">
                          No suppliers match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
          <Tab eventKey="po" title="Purchase Orders">
            <Card className="shadow-sm border-0 mb-3">
              <Card.Body>
                <Card.Title className="mb-3">Create Purchase Order</Card.Title>
                <Form onSubmit={handleCreatePo}>
                  <Row className="g-2">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Supplier</Form.Label>
                        <Form.Select
                          required
                          value={poForm.supplierId}
                          onChange={(event) =>
                            setPoForm((prev) => ({ ...prev, supplierId: event.target.value }))
                          }
                        >
                          <option value="">Select supplier</option>
                          {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Linked Product (optional)</Form.Label>
                        <Form.Select
                          value={poForm.productId}
                          onChange={(event) => handlePoProductSelect(event.target.value)}
                        >
                          <option value="">Custom Item</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name}
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
                          value={poForm.quantity}
                          onChange={(event) =>
                            setPoForm((prev) => ({ ...prev, quantity: event.target.value }))
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Unit Cost</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          value={poForm.unitCost}
                          onChange={(event) =>
                            setPoForm((prev) => ({ ...prev, unitCost: event.target.value }))
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>ETA</Form.Label>
                        <Form.Control
                          type="date"
                          required
                          value={poForm.etaDate}
                          onChange={(event) =>
                            setPoForm((prev) => ({ ...prev, etaDate: event.target.value }))
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={10}>
                      <Form.Group>
                        <Form.Label>Item Description</Form.Label>
                        <Form.Control
                          required
                          value={poForm.itemName}
                          onChange={(event) =>
                            setPoForm((prev) => ({ ...prev, itemName: event.target.value }))
                          }
                          placeholder="Enter item or service description"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                      <Button type="submit" className="w-100">
                        Create PO
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0">
              <Card.Body>
                <Table responsive hover className="mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>PO</th>
                      <th>Supplier</th>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Order Date</th>
                      <th>ETA</th>
                      <th>Status</th>
                      <th className="text-end">Total</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrders.length > 0 ? (
                      purchaseOrders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.supplierName}</td>
                          <td>{order.itemName}</td>
                          <td>{order.quantity}</td>
                          <td>{order.orderDate}</td>
                          <td>{order.etaDate}</td>
                          <td>
                            <Badge
                              bg={
                                order.status === "Delivered"
                                  ? "success"
                                  : order.status === "Cancelled"
                                  ? "danger"
                                  : order.status === "In Transit"
                                  ? "info"
                                  : "warning"
                              }
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="text-end">{currency.format(order.totalCost)}</td>
                          <td className="text-end">
                            {order.status !== "Delivered" && order.status !== "Cancelled" && (
                              <>
                                {order.status === "Ordered" && (
                                  <Button
                                    size="sm"
                                    variant="outline-info"
                                    className="me-1"
                                    onClick={() => handlePoStatusUpdate(order.id, "In Transit")}
                                  >
                                    In Transit
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline-success"
                                  className="me-1"
                                  onClick={() => handlePoStatusUpdate(order.id, "Delivered")}
                                >
                                  Delivered
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  className="me-1"
                                  onClick={() => handlePoStatusUpdate(order.id, "Cancelled")}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              onClick={() => handleDeletePo(order.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="text-center text-muted py-3">
                          No purchase orders yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
          <Tab eventKey="performance" title="Performance">
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title>Supplier Scoreboard</Card.Title>
                <Table responsive hover className="mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Supplier</th>
                      <th className="text-end">Orders</th>
                      <th className="text-end">Fulfillment</th>
                      <th className="text-end">Lead Time</th>
                      <th className="text-end">Spend</th>
                      <th className="text-end">Rating</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierPerformance.length > 0 ? (
                      supplierPerformance.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td className="text-end">{item.orderCount}</td>
                          <td className="text-end">{item.fulfillmentRate.toFixed(0)}%</td>
                          <td className="text-end">{item.leadTimeDays} days</td>
                          <td className="text-end">{currency.format(item.totalSpend)}</td>
                          <td className="text-end">{item.rating.toFixed(1)}</td>
                          <td>
                            <Badge
                              bg={
                                item.complianceStatus !== "Approved"
                                  ? "warning"
                                  : item.status === "Active"
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {item.complianceStatus === "Approved"
                                ? item.status
                                : `Risk: ${item.complianceStatus}`}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center text-muted py-3">
                          No supplier performance data yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </div>

      <Modal show={showSupplierModal} onHide={() => setShowSupplierModal(false)} size="lg" centered>
        <Form onSubmit={handleSaveSupplier}>
          <Modal.Header closeButton>
            <Modal.Title>{editingSupplierId ? "Edit Supplier" : "Add Supplier"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Supplier Name</Form.Label>
                  <Form.Control
                    required
                    value={supplierForm.name}
                    onChange={(event) =>
                      setSupplierForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Business Type</Form.Label>
                  <Form.Select
                    value={supplierForm.businessType}
                    onChange={(event) =>
                      setSupplierForm((prev) => ({ ...prev, businessType: event.target.value }))
                    }
                  >
                    <option>Manufacturer</option>
                    <option>Distributor</option>
                    <option>Wholesaler</option>
                    <option>Service Provider</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={supplierForm.category}
                    onChange={(event) =>
                      setSupplierForm((prev) => ({ ...prev, category: event.target.value }))
                    }
                  >
                    <option>Mobile Phone</option>
                    <option>Laptop</option>
                    <option>Repair Service</option>
                    <option>Accessories</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={supplierForm.email}
                    onChange={(event) =>
                      setSupplierForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    required
                    value={supplierForm.phone}
                    onChange={(event) =>
                      setSupplierForm((prev) => ({ ...prev, phone: event.target.value }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Products / Services</Form.Label>
                  <Form.Control
                    required
                    value={supplierForm.products}
                    onChange={(event) =>
                      setSupplierForm((prev) => ({ ...prev, products: event.target.value }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    required
                    value={supplierForm.address}
                    onChange={(event) =>
                      setSupplierForm((prev) => ({ ...prev, address: event.target.value }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Lead Time (Days)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    required
                    value={supplierForm.leadTimeDays}
                    onChange={(event) =>
                      setSupplierForm((prev) => ({ ...prev, leadTimeDays: event.target.value }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Payment Terms</Form.Label>
                  <Form.Select
                    value={supplierForm.paymentTerms}
                    onChange={(event) =>
                      setSupplierForm((prev) => ({ ...prev, paymentTerms: event.target.value }))
                    }
                  >
                    <option>Net 15</option>
                    <option>Net 30</option>
                    <option>Net 45</option>
                    <option>Net 60</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    required
                    value={supplierForm.rating}
                    onChange={(event) =>
                      setSupplierForm((prev) => ({ ...prev, rating: event.target.value }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={supplierForm.status}
                    onChange={(event) =>
                      setSupplierForm((prev) => ({ ...prev, status: event.target.value }))
                    }
                  >
                    <option>Active</option>
                    <option>On Hold</option>
                    <option>Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Compliance</Form.Label>
                  <Form.Select
                    value={supplierForm.complianceStatus}
                    onChange={(event) =>
                      setSupplierForm((prev) => ({ ...prev, complianceStatus: event.target.value }))
                    }
                  >
                    <option>Approved</option>
                    <option>Pending</option>
                    <option>Rejected</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSupplierModal(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingSupplierId ? "Update Supplier" : "Add Supplier"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};

export default Suppliers;
