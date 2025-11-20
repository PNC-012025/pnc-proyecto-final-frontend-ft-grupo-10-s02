import { Routes, Route } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { DashboardLayout } from "./pages/DashboardLayout";
import { DashboardHome } from "./components/DashboardHome";

import { ToastContainer } from "react-toastify";

import { Transfer } from "./pages/Transfer";

import AdminDashboard from "./components/Admin/AdminDashboard/AdminDashboard";
import { AdminPage } from "./pages/AdminPage";
import AdminRoute from "./components/Admin/AdminDashboard/AdminRoute";
import ExpensesDashboard from "./pages/expense/ExpenseDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="wallet" element={<ExpensesDashboard />} />
          <Route path="transfer" element={<Transfer />} />
        </Route>
        <Route path="/admin" element={<AdminRoute>
          <AdminPage />
        </AdminRoute>}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
