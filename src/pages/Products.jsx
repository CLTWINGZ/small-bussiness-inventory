import { useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { useAppData } from "../context/AppDataContext";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const defaultForm = {
  sku: "",
  name: "",
  category: "Mobile Phone",
  unitPrice: "",
  stock: "",
  reorderLevel: "",
  supplierName: "",
};

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useAppData();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((product) => product.category)));
    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        categoryFilter === "All" ? true : product.category === categoryFilter;
      const text = `${product.name} ${product.sku} ${product.supplierName}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, categoryFilter, search]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setFormData({
      sku: product.sku,
      name: product.name,
      category: product.category,
      unitPrice: String(product.unitPrice),
      stock: String(product.stock),
      reorderLevel: String(product.reorderLevel),
      supplierName: product.supplierName,
    });
    setShowModal(true);
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      updateProduct(editingId, formData);
    } else {
      addProduct(formData);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product? Related sales record will also be removed.")) return;
    deleteProduct(id);
  };

  return (
    <DashboardLayout>
      <div className="md:ml-64 p-6">
        <Row className="align-items-center mb-3 g-2">
          <Col md={4}>
            <h2 className="mb-0">Products & Services</h2>
          </Col>
          <Col md={3}>
            <Form.Select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <InputGroup>
              <Form.Control
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
              />
            </InputGroup>
          </Col>
          <Col md={2} className="text-md-end">
            <Button onClick={openCreateModal}>Add Product</Button>
          </Col>
        </Row>

        <Card className="shadow-sm border-0">
          <Card.Body>
            <Table responsive hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Supplier</th>
                  <th className="text-end">Price</th>
                  <th className="text-end">Stock</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const isLowStock = product.stock <= product.reorderLevel;
                    return (
                      <tr key={product.id}>
                        <td>{product.sku || "-"}</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{product.supplierName || "-"}</td>
                        <td className="text-end">{currency.format(product.unitPrice)}</td>
                        <td className="text-end">
                          {product.stock}{" "}
                          {isLowStock && (
                            <Badge bg="warning" text="dark">
                              Low
                            </Badge>
                          )}
                        </td>
                        <td className="text-end">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => openEditModal(product)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      No products found for current filters.
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
            <Modal.Title>{editingId ? "Edit Product" : "Add Product"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>SKU</Form.Label>
                  <Form.Control
                    value={formData.sku}
                    onChange={(event) => setFormData((prev) => ({ ...prev, sku: event.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, category: event.target.value }))
                    }
                  >
                    <option>Mobile Phone</option>
                    <option>Laptop</option>
                    <option>Repair Service</option>
                    <option>Accessories</option>
                  </Form.Select>
                </Form.Group>
              </Col>
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
                  <Form.Label>Unit Price (USD)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.unitPrice}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, unitPrice: event.target.value }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(event) => setFormData((prev) => ({ ...prev, stock: event.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Reorder Level</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    required
                    value={formData.reorderLevel}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, reorderLevel: event.target.value }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Supplier</Form.Label>
                  <Form.Control
                    value={formData.supplierName}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, supplierName: event.target.value }))
                    }
                  />
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

export default Products;
