import React from "react";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  setIsLoggedIn: (val: boolean) => void;
};

const Header: React.FC<HeaderProps> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <span className="font-bold text-lg">Sticky Notes App </span>
      <div>
      <span className="font-bold text-lg"> Welcome {localStorage.getItem('role')}</span>
      <button
        onClick={handleLogout}
        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
      </div>
    </div>
  );
};

export default Header;
