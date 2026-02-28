import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useAppData } from "../context/AppDataContext";
import DashboardLayout from "../layouts/DashboardLayout";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAppData();
  const [form, setForm] = useState({ email: "admin@example.com", password: "admin123" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Ensure the API is running (npm run api).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="md:ml-64 p-6 flex justify-center">
        <Card className="shadow-sm" style={{ maxWidth: 420, width: "100%" }}>
          <Card.Body>
            <Card.Title className="mb-3">Sign In</Card.Title>
            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  required
                />
              </Form.Group>
              <Button type="submit" className="w-100" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="text-muted mt-2" style={{ fontSize: "0.85rem" }}>
                Demo: admin@example.com / admin123
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Login;
