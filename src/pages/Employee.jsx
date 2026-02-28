import { Container, Tabs, Tab } from "react-bootstrap";
import DashboardLayout from "../layouts/DashboardLayout";
import EmployeeInfo from "../pages/Employees/Employee_Info.jsx";
import RoleAccess from "../pages/Employees/RoleAccess.jsx";
import Attendance from "../pages/Employees/Attendance.jsx";
import Leave from "./Employees/Leave.jsx";
import Payroll from "./Employees/Payroll.jsx";
import Performance from "./Employees/Performance.jsx";
import Department from "./Employees/Department.jsx";
import Recruitment from "./Employees/Recruitment.jsx";
import Training from "./Employees/Training.jsx";
import Communication from "./Employees/Communication.jsx";
import Reports from "./Employees/Reports.jsx";
import Compliance from "./Employees/Compliance.jsx";
import ESS from "./Employees/ESS.jsx";
import Integration from "./Employees/Integration.jsx";
function Employee() {
  return (
    <DashboardLayout>
        <div className="md:ml-64 p-6">
      <Container fluid className="p-3">
        <h4 className="mb-3">Employee Management</h4>

        <Tabs defaultActiveKey="info" className="mb-3">
          <Tab eventKey="info" title="Employee Info">
            <EmployeeInfo />
          </Tab>
          <Tab eventKey="roles" title="Roles & Access">
            <RoleAccess />
          </Tab>
          <Tab eventKey="attendance" title="Attendance">
            <Attendance />
          </Tab>
          <Tab eventKey="leave" title="Leave">
            <Leave/>
          </Tab>
          <Tab eventKey="payroll" title="Payroll">
            <Payroll/>
          </Tab>
          <Tab eventKey="performance" title="Performance">
            <Performance />
          </Tab>
          <Tab eventKey="department" title="Departments">
            <Department />
          </Tab>
          <Tab eventKey="recruitment" title="Recruitment">
            <Recruitment />
          </Tab>
          <Tab eventKey="training" title="Training">
            <Training />
          </Tab>
          <Tab eventKey="communication" title="Communication">
            <Communication />
          </Tab>
          <Tab eventKey="reports" title="Reports">
            <Reports />
          </Tab>
          <Tab eventKey="compliance" title="Compliance">
            <Compliance />
          </Tab>

          <Tab eventKey="ess" title="ESS">
            <ESS />
          </Tab>
          <Tab eventKey="integration" title="Integration">
            <Integration />
          </Tab>
        </Tabs>
      </Container>
      </div>
    </DashboardLayout>
  );
}

export default Employee;


// import React, { useState } from "react";
// import DashboardLayout from "../layouts/DashboardLayout";
// import { Table, Button, Modal, Form, Tabs, Tab } from "react-bootstrap";
// const EmployeesPage = () => {  return (
//   <div>
//     <nav className="navbar navbar-expand-lg bg-body-tertiary">
//       <div className="container-fluid">
//         <a className="navbar-brand" href="#">Navbar</a>

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarSupportedContent"
//           aria-controls="navbarSupportedContent"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse" id="navbarSupportedContent">
//           <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//             <li className="nav-item">
//               <a className="nav-link active" aria-current="page" href="#">Home</a>
//             </li>

//             <li className="nav-item">
//               <a className="nav-link" href="#">Link</a>
//             </li>

//             <li className="nav-item dropdown">
//               <a
//                 className="nav-link dropdown-toggle"
//                 href="#"
//                 role="button"
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 Dropdown
//               </a>
//               <ul className="dropdown-menu">
//                 <li><a className="dropdown-item" href="#">Action</a></li>
//                 <li><a className="dropdown-item" href="#">Another action</a></li>
//                 <li><hr className="dropdown-divider" /></li>
//                 <li><a className="dropdown-item" href="#">Something else here</a></li>
//               </ul>
//             </li>

//             <li className="nav-item">
//               <a className="nav-link disabled" aria-disabled="true">Disabled</a>
//             </li>
//           </ul>

//           <form className="d-flex" role="search">
//             <input
//               className="form-control me-2"
//               type="search"
//               placeholder="Search"
//               aria-label="Search"
//             />
//             <button className="btn btn-outline-success" type="submit">
//               Search
//             </button>
//           </form>
//         </div>
//       </div>
//     </nav>
//   </div>
// );};
// /* 
// const EmployeesPage = () => {
//     // Employee details
//     const [employees, setEmployees] = useState([
//         { id: 1, name: "John Doe", email: "john@company.com", phone: "123-456-7890", position: "Technician", salary: 500, status: "Active" },
//         { id: 2, name: "Jane Smith", email: "jane@company.com", phone: "987-654-3210", position: "Sales", salary: 400, status: "Active" },
//     ]);

//     // Attendance records
//     const [attendance, setAttendance] = useState([
//         { id: 1, employee: "John Doe", date: "2025-12-01", status: "Present" },
//         { id: 2, employee: "Jane Smith", date: "2025-12-01", status: "Absent" },
//     ]);

//     // Leave records
//     const [leaves, setLeaves] = useState([
//         { id: 1, employee: "Jane Smith", from: "2025-12-05", to: "2025-12-07", reason: "Medical", status: "Approved" },
//     ]);

//     // Modal state
//     const [showModal, setShowModal] = useState(false);
//     const [editingEmployee, setEditingEmployee] = useState(null);
//     const [formData, setFormData] = useState({ name: "", email: "", phone: "", position: "", salary: "", status: "Active" });

//     // Handlers
//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
//     const handleAdd = () => { setFormData({ name: "", email: "", phone: "", position: "", salary: "", status: "Active" }); setEditingEmployee(null); setShowModal(true); };
//     const handleEdit = (employee) => { setFormData(employee); setEditingEmployee(employee.id); setShowModal(true); };
//     const handleSave = () => {
//         if (editingEmployee) setEmployees(employees.map(emp => emp.id === editingEmployee ? { ...formData, id: editingEmployee } : emp));
//         else setEmployees([...employees, { ...formData, id: Date.now() }]);
//         setShowModal(false);
//     };
//     const handleDelete = (id) => { if (window.confirm("Delete this employee?")) setEmployees(employees.filter(emp => emp.id !== id)); };

//  */ 




// // /*                 <DashboardLayout>
// //             <h2 className="mb-4 text-primary">Employees Management</h2>

// //             <Tabs defaultActiveKey="details" id="employee-tabs" className="mb-3">
// //                 {/* Employee Details Tab */}
// //                 <Tab eventKey="details" title="Details">
// //                     <Button variant="success" className="mb-3" onClick={handleAdd}>Add Employee</Button>
// //                     <div>
// //                         <div className=" d-flex w-50  d-flex justify-content-between mb-3">
// //                             <div className="card d-flex w-50 shadow-sm border-0 d-flex justify-content-between mb-3">
// //                                 <h5 className="card-title">Total Employees</h5>
// //                                 <p className="card-text">Manage employee information here.</p>
// //                                 <div className="card-body">
// //                                     <h3 className="text-primary">{employees.length}</h3>
// //                                 </div>
// //                             </div>
// //                             <div className="card d-flex w-50 shadow-sm border-0 d-flex justify-content-between mb-3">
// //                                 <h5 className="card-title">Active Employees</h5>
// //                                 <p className="card-text">Manage employee information here.</p>
// //                                 <div className="card-body">
// //                                     <h3 className="text-primary">{employees.filter(emp => emp.status === "Active").length}</h3>
// //                                 </div>
// //                             </div>
// //                             <div className="card d-flex w-50 shadow-sm border-0 d-flex justify-content-between mb-3">
// //                                 <h5 className="card-title">Total Employee</h5>
// //                                 <p className="card-text">Manage employee information here.</p>
// //                                 <div className="card-body">
// //                                     <h3 className="text-primary">{employees.length}</h3>
// //                                 </div>
// //                             </div>
// //                             <div className="card d-flex w-50 shadow-sm border-0 d-flex justify-content-between mb-3">
// //                                 <h5 className="card-title">Total Employee</h5>
// //                                 <p className="card-text">Manage employee information here.</p>
// //                                 <div className="card-body">
// //                                     <h3 className="text-primary">{employees.length}</h3>
// //                                 </div>
// //                             </div>


// //                         </div>
// //                         <div className="d-flex justify-content-between align-items-center mb-3">
// //                             <input type="text" placeholder="Search employees..." className="form-control w-50" />
// //                         </div>
// //                     </div>
// //                     <Table striped bordered hover responsive className="shadow-sm text-center align-middle">
// //                         <thead className="table-dark">
// //                             <tr>
// //                                 <th>Name</th>
// //                                 <th>Email</th>
// //                                 <th>Phone</th>
// //                                 <th>Position</th>
// //                                 <th>Salary</th>
// //                                 <th>Status</th>
// //                                 <th>Actions</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {employees.map(emp => (
// //                                 <tr key={emp.id}>
// //                                     <td>{emp.name}</td>
// //                                     <td>{emp.email}</td>
// //                                     <td>{emp.phone}</td>
// //                                     <td>{emp.position}</td>
// //                                     <td>${emp.salary}</td>
// //                                     <td>{emp.status}</td>
// //                                     <td>
// //                                         <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(emp)}>Edit</Button>
// //                                         <Button variant="danger" size="sm" onClick={() => handleDelete(emp.id)}>Delete</Button>
// //                                     </td>
// //                                 </tr>
// //                             ))}
// //                         </tbody>
// //                     </Table>
// //                 </Tab>

// //                 {/* Attendance Tab */}
// //                 <Tab eventKey="attendance" title="Attendance">
// //                     <Table striped bordered hover responsive className="shadow-sm text-center align-middle">
// //                         <thead className="table-dark">
// //                             <tr>
// //                                 <th>Employee</th>
// //                                 <th>Date</th>
// //                                 <th>Status</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {attendance.map(a => (
// //                                 <tr key={a.id}>
// //                                     <td>{a.employee}</td>
// //                                     <td>{a.date}</td>
// //                                     <td className={a.status === "Present" ? "text-success" : "text-danger"}>{a.status}</td>
// //                                 </tr>
// //                             ))}
// //                         </tbody>
// //                     </Table>
// //                 </Tab>

// //                 {/* Leaves Tab */}
// //                 <Tab eventKey="leaves" title="Leaves">
// //                     <Table striped bordered hover responsive className="shadow-sm text-center align-middle">
// //                         <thead className="table-dark">
// //                             <tr>
// //                                 <th>Employee</th>
// //                                 <th>From</th>
// //                                 <th>To</th>
// //                                 <th>Reason</th>
// //                                 <th>Status</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {leaves.map(l => (
// //                                 <tr key={l.id}>
// //                                     <td>{l.employee}</td>
// //                                     <td>{l.from}</td>
// //                                     <td>{l.to}</td>
// //                                     <td>{l.reason}</td>
// //                                     <td>{l.status}</td>
// //                                 </tr>
// //                             ))}
// //                         </tbody>
// //                     </Table>
// //                 </Tab>

// //                 {/* Other Options Tab */}
// //                 <Tab eventKey="other" title="Other Options">
// //                     <Table striped bordered hover responsive className="shadow-sm text-center align-middle">
// //                         <thead className="table-dark">
// //                             <tr>
// //                                 <th>Name</th>
// //                                 <th>Position</th>
// //                                 <th>Salary</th>
// //                                 <th>Status</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {employees.map(emp => (
// //                                 <tr key={emp.id}>
// //                                     <td>{emp.name}</td>
// //                                     <td>{emp.position}</td>
// //                                     <td>${emp.salary}</td>
// //                                     <td>{emp.status}</td>
// //                                 </tr>
// //                             ))}
// //                         </tbody>
// //                     </Table>
// //                 </Tab>
                
// //             </Tabs>

// //             {/* Employee Modal */}
// //             <Modal show={showModal} onHide={() => setShowModal(false)} centered>
// //                 <Modal.Header closeButton>
// //                     <Modal.Title>{editingEmployee ? "Edit Employee" : "Add Employee"}</Modal.Title>
// //                 </Modal.Header>
// //                 <Modal.Body>
// //                     <Form>
// //                         <Form.Group className="mb-3">
// //                             <Form.Label>Name</Form.Label>
// //                             <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
// //                         </Form.Group>
// //                         <Form.Group className="mb-3">
// //                             <Form.Label>Email</Form.Label>
// //                             <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
// //                         </Form.Group>
// //                         <Form.Group className="mb-3">
// //                             <Form.Label>Phone</Form.Label>
// //                             <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
// //                         </Form.Group>
// //                         <Form.Group className="mb-3">
// //                             <Form.Label>Position</Form.Label>
// //                             <Form.Control type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position" />
// //                         </Form.Group>
// //                         <Form.Group className="mb-3">
// //                             <Form.Label>Salary</Form.Label>
// //                             <Form.Control type="number" name="salary" value={formData.salary} onChange={handleChange} placeholder="Salary" />
// //                         </Form.Group>
// //                         <Form.Group className="mb-3">
// //                             <Form.Label>Status</Form.Label>
// //                             <Form.Select name="status" value={formData.status} onChange={handleChange}>
// //                                 <option value="Active">Active</option>
// //                                 <option value="Inactive">Inactive</option>
// //                             </Form.Select>
// //                         </Form.Group>
// //                     </Form>
// //                 </Modal.Body>
// //                 <Modal.Footer>
// //                     <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
// //                     <Button variant="primary" onClick={handleSave}>{editingEmployee ? "Update" : "Save"}</Button>
// //                 </Modal.Footer>
// //             </Modal>
// //         </DashboardLayout >

// export default EmployeesPage;
