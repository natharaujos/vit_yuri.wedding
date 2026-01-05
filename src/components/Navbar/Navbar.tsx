import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import admins from "../../constants/admins";
import { getAuth, signOut } from "firebase/auth";
import { Dialog } from "@mui/material";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const navLinks = [
    { label: "Início", onClick: () => navigate("/") },
    { label: "Presentes", onClick: () => navigate("/") },
    {
      label: "Minhas Contribuições",
      onClick: () => navigate("/my-contributions"),
    },
  ];

  const confirmedRoute = {
    label: "Confirmados",
    onClick: () => navigate("/confirmeds"),
  };

  const allContributions = {
    label: "Todas as Contribuições",
    onClick: () => navigate("/all-contributions"),
  };

  const logout = {
    label: "Sair",
    onClick: () => handleLogout(),
  };

  if (user?.email && admins.includes(user?.email)) {
    navLinks.push(confirmedRoute);
    navLinks.push(allContributions);
  }

  if (user) {
    navLinks.push(logout);
  }

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setConfirmOpen(true);
    } catch (error) {
      console.error("Erro ao deslogar:", error);
      alert("Falha ao deslogar. Tente novamente.");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Logo / Nome dos noivos */}
          <a
            href="#home"
            className="text-2xl font-bold text-[#D4AF7F] cursor-pointer"
            onClick={() => navigate("/")}
          >
            Maguinha & Tuquinho
          </a>
        </div>

        {/* Ícone do menu mobile */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#3A3A3A] focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Links do menu (desktop) */}
        <div className="hidden lg:flex space-x-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              className="text-gray-700 hover:text-[#D4AF7F] transition font-medium cursor-pointer"
              onClick={link.onClick}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu colapsado (mobile) */}
      {isOpen && (
        <div className="lg:hidden bg-white px-4 pb-4">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                link.onClick();
                setIsOpen(false);
              }}
              className="block py-2 text-gray-700 hover:text-[#D4AF7F]"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          className: "p-6 rounded-lg",
        }}
      >
        <p className="text-gray-600 mb-6">Logout realizado com sucesso!</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setConfirmOpen(false);
              navigate("/login", { replace: true });
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            Ok
          </button>
        </div>
      </Dialog>
    </nav>
  );
}

export default Navbar;
