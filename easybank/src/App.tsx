import { Routes, Route } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { DashboardLayout } from "./pages/DashboardLayout";
import { DashboardHome } from "./components/DashboardHome";
import { ExpDashboard } from "./components/ExpenseDashboard/ExpDashboard";

import { ExpenseProvider } from "./context/ExpenseContext";
import { ToastContainer } from "react-toastify";
import { AdminPage } from "./pages/AdminPage";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

function App() {
  return (
    <ExpenseProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="wallet" element={<ExpDashboard />} />
        </Route>
        <Route path="/admin" element={<AdminPage />}>
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
    </ExpenseProvider>
  );
}

export default App;
