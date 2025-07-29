import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import LoginPage from "./pages/LoginPage";
import PatientListPage from "./pages/PatientListPage";
import PatientDetailPage from "./pages/PatientDetailPage";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ThemeProvider } from "./theme/ThemeProvider";
import "./App.css";

// PUBLIC_INTERFACE
function ProtectedRoute({ children }) {
  /** Redirects unauthenticated users to login. */
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// PUBLIC_INTERFACE
function MainLayout({ children }) {
  /** Layout with sidebar, topbar, and main content */
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <Topbar />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Main entry for the Patient History app */
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<PatientListPage />} />
                      <Route path="/patient/:id" element={<PatientDetailPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
