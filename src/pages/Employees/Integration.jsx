// src/pages/Integration.jsx
import React, { useState } from "react";
import { Container, Card, Button, ListGroup, Modal } from "react-bootstrap";

const integrationsData = [
  {
    id: 1,
    name: "Biometric Devices",
    description: "Integrate fingerprint or face recognition devices for attendance tracking.",
  },
  {
    id: 2,
    name: "Accounting Systems",
    description: "Connect with popular accounting software to sync payroll and expenses.",
  },
  {
    id: 3,
    name: "Email & SMS Gateways",
    description: "Enable automated notifications via email and SMS to employees.",
  },
];

const Integration = () => {
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (integration) => {
    setSelectedIntegration(integration);
    setShowModal(true);
  };

  return (
    <Container className="mt-4">
      <h2>Integration Features</h2>

      <div className="d-flex flex-wrap gap-3 mt-3">
        {integrationsData.map((integration) => (
          <Card key={integration.id} style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>{integration.name}</Card.Title>
              <Card.Text>
                {integration.description.slice(0, 60)}...
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => handleViewDetails(integration)}
              >
                View Details
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Integration Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedIntegration?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedIntegration?.description}</p>
          <ListGroup>
            <ListGroup.Item>Setup Instructions</ListGroup.Item>
            <ListGroup.Item>Configuration Steps</ListGroup.Item>
            <ListGroup.Item>Testing Guidelines</ListGroup.Item>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success">Connect Integration</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Integration;
