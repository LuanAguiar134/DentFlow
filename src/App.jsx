import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Patients from "./pages/Patients";
import Procedures from "./pages/Procedures";
import Financial from "./pages/Financial";
import Login from "./pages/Login";

const fadeStyle = `
  @keyframes pageEnter {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .page-enter { animation: pageEnter 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
  .page-exit  { opacity: 0; transition: opacity 0.25s ease; }
`;

export function getAuth() {
  // Primeiro tenta sessionStorage (sem lembrar), depois localStorage (lembrar)
  const session = sessionStorage.getItem("auth");
  if (session) return JSON.parse(session);
  const local = localStorage.getItem("auth");
  if (local) return JSON.parse(local);
  return null;
}

export function getRole() {
  const auth = getAuth();
  return auth ? auth.role : null;
}

function PrivateRoute({ children, dentistaOnly = false }) {
  const auth = getAuth();
  if (!auth) return <Navigate to="/login" replace />;
  if (dentistaOnly && auth.role !== "dentista") return <Navigate to="/" replace />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState("enter");

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setStage("exit");
      const t = setTimeout(() => {
        setDisplayLocation(location);
        setStage("enter");
      }, 250);
      return () => clearTimeout(t);
    }
  }, [location]);

  return (
    <>
      <style>{fadeStyle}</style>
      <div key={displayLocation.pathname} className={stage === "enter" ? "page-enter" : "page-exit"}
        style={{ width: "100%", minHeight: "100vh" }}>
        <Routes location={displayLocation}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/agenda" element={<PrivateRoute><Agenda /></PrivateRoute>} />
          <Route path="/patients" element={<PrivateRoute dentistaOnly><Patients /></PrivateRoute>} />
          <Route path="/procedures" element={<PrivateRoute dentistaOnly><Procedures /></PrivateRoute>} />
          <Route path="/financial" element={<PrivateRoute dentistaOnly><Financial /></PrivateRoute>} />
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