import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Card, Form, Row, Col, Button, Badge } from "react-bootstrap";
import { useAppData } from "../context/AppDataContext";

const defaultForm = {
  title: "",
  content: "",
  tag: "General",
};

const Notes = () => {
  const { notes, addNote, deleteNote } = useAppData();
  const [formData, setFormData] = useState(defaultForm);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    addNote(formData);
    setFormData(defaultForm);
  };

  return (
    <DashboardLayout>
      <div className="md:ml-64 p-6">
        <h2 className="mb-3">Notes</h2>

        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <Card.Title>Add Note</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Row className="g-2">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      value={formData.title}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, title: event.target.value }))
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Tag</Form.Label>
                    <Form.Select
                      value={formData.tag}
                      onChange={(event) => setFormData((prev) => ({ ...prev, tag: event.target.value }))}
                    >
                      <option>General</option>
                      <option>Inventory</option>
                      <option>Finance</option>
                      <option>Operations</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Details</Form.Label>
                    <Form.Control
                      value={formData.content}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, content: event.target.value }))
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={12} className="text-end">
                  <Button type="submit">Save Note</Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        <Row className="g-3">
          {notes.length > 0 ? (
            notes.map((note) => (
              <Col md={6} lg={4} key={note.id}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="mb-0">{note.title}</Card.Title>
                      <Badge bg="secondary">{note.tag}</Badge>
                    </div>
                    <Card.Text>{note.content}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">{note.createdAt}</small>
                      <Button variant="outline-danger" size="sm" onClick={() => deleteNote(note.id)}>
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Card className="shadow-sm border-0">
                <Card.Body className="text-center text-muted">No notes yet.</Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default Notes;
