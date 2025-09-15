import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type LoginProps = {
  setIsLoggedIn: (val: boolean) => void;
};

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const adminDetails = { email: "admin@admin.com", password: "Admin" };
    const clinicanDetails = { email: "clinican@clinican.com", password: "Clinican" };

    if (
      (email === adminDetails.email && password === adminDetails.password) ||
      (email === clinicanDetails.email && password === clinicanDetails.password)
    ) {
      localStorage.setItem("role", password);
      setIsLoggedIn(true);

      navigate("/sticky-note");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 font-medium">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Login
          </button>

          <div className="mt-4 text-sm text-gray-600">
            <p>Admin Credentials: Email: admin@admin.com, Password: Admin</p>
            <p>Clinican Credentials: Email: clinican@clinican.com, Password: Clinican</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
