import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import Employee from "./pages/Employee";
import Salary from "./pages/Salary";  
import BillPayments from "./pages/BillPayments";
import Invoice from "./pages/Invoice";
import Notes from "./pages/Notes"
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import RepairingOrders from "./pages/Repairing Orders";
import Login from "./pages/Login";
import { useAppData } from "./context/AppDataContext";

const PrivateRoute = ({ element }) => {
  const { authenticated } = useAppData();
  return authenticated ? element : <Login />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/products" element={<PrivateRoute element={<Products />} />} />
        <Route path="/suppliers" element={<PrivateRoute element={<Suppliers />} />} />
        <Route path="/employee" element={<PrivateRoute element={<Employee />} />} />
        <Route path="/salary" element={<PrivateRoute element={<Salary />} />} />
        <Route path="/billpayments" element={<PrivateRoute element={<BillPayments />} />} />
        <Route path="/invoice" element={<PrivateRoute element={<Invoice />} />} />
        <Route path="/notes" element={<PrivateRoute element={<Notes />} />} />
        <Route path="/customers" element={<PrivateRoute element={<Customers />} />} />
        <Route path="/sales" element={<PrivateRoute element={<Sales />} />} />
        <Route path="/reports" element={<PrivateRoute element={<Reports />} />} />
        <Route path="/order" element={<PrivateRoute element={<RepairingOrders />} />} />
        <Route path="/order/pending" element={<PrivateRoute element={<RepairingOrders />} />} />
        <Route path="/order/completed" element={<PrivateRoute element={<RepairingOrders />} />} />
        <Route path="/order/cancelled" element={<PrivateRoute element={<RepairingOrders />} />} />
        <Route path="*" element={<PrivateRoute element={<Dashboard />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
