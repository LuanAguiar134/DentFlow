import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Patients from "./pages/Patients";
import Procedures from "./pages/Procedures";
import Financial from "./pages/Financial";
import Login from "./pages/Login";

const fadeStyle = `
  @keyframes pageFade {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .page-fade {
    animation: pageFade 0.25s ease forwards;
  }
`;

function isAuthenticated() {
  return localStorage.getItem("auth") !== null;
}

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function AnimatedRoutes() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setVisible(false);
      const t = setTimeout(() => {
        setDisplayLocation(location);
        setVisible(true);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [location]);

  return (
    <>
      <style>{fadeStyle}</style>
      <div
        key={displayLocation.pathname}
        className={visible ? "page-fade" : ""}
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.15s ease", width: "100%", minHeight: "100vh" }}
      >
        <Routes location={displayLocation}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/agenda" element={<PrivateRoute><Agenda /></PrivateRoute>} />
          <Route path="/patients" element={<PrivateRoute><Patients /></PrivateRoute>} />
          <Route path="/procedures" element={<PrivateRoute><Procedures /></PrivateRoute>} />
          <Route path="/financial" element={<PrivateRoute><Financial /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;