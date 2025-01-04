import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./app/hooks"; 
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signin from "./pages/Signin";

function App() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-background">
      <Router>
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/signin"
            element={user ? <Navigate to="/" replace /> : <Signin />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;