// src/App.jsx
import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { useAuthStore } from "./store/authStore";

// Pages
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

// Super Admin Pages
import Cashiers from "./pages/superadmin/Cashiers";
import CashierStats from "./pages/superadmin/CashierStats";
import Dashboard from "./pages/superadmin/Dashboard";
import Plans from "./pages/superadmin/Plans";
import PointsOfSale from "./pages/superadmin/PointsOfSale";
import POSStats from "./pages/superadmin/POSStats";
import Sales from "./pages/superadmin/Sales";

// Cashier Pages
import MySales from "./pages/cashier/MySales";
import SellTicket from "./pages/cashier/SellTicket";

// Components
import ProtectedRoute from "./components/layout/ProtectedRoute";

function App() {
  const { isAuthenticated, user } = useAuthStore();

  const router = createBrowserRouter([{}]);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate
                to={user?.role === "super_admin" ? "/dashboard" : "/sell"}
              />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Super Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pos"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <PointsOfSale />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pos/:id/stats"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <POSStats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashiers"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <Cashiers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashiers/:id/stats"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <CashierStats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <Plans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <Sales />
            </ProtectedRoute>
          }
        />

        {/* Cashier Routes */}
        <Route
          path="/sell"
          element={
            <ProtectedRoute requiredRole="cashier">
              <SellTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-sales"
          element={
            <ProtectedRoute requiredRole="cashier">
              <MySales />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? user?.role === "super_admin"
                    ? "/dashboard"
                    : "/sell"
                  : "/login"
              }
            />
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
