import  { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import StickyNote from "./pages/StickyNote";
import Header from "./components/Header";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsLoggedIn(!!role);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {isLoggedIn && <Header setIsLoggedIn={setIsLoggedIn} />}
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/sticky-note" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/sticky-note"
            element={isLoggedIn ? <StickyNote /> : <Navigate to="/" />}
          />

          <Route path="*" element={<div className="p-8 text-center">Page not found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
