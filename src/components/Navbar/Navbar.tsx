import { useState, useEffect } from "react";
import { User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import admins from "../../constants/admins";
import { getAuth, signOut } from "firebase/auth";
import { Dialog } from "@mui/material";
import Button from "../Button/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function Navbar() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { label: "Início", onClick: () => navigate("/") },
    { label: "Presentes", onClick: () => navigate("/presentes") },
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

  const giftsAdmin = {
    label: "Gerenciar Presentes",
    onClick: () => navigate("/admin/gifts"),
  };

  const loginAdmin = {
    label: "Login Admin",
    onClick: () => navigate("/login"),
  };

  const logout = {
    label: "Sair",
    onClick: () => handleLogout(),
  };

  if (user?.email && admins.includes(user?.email)) {
    navLinks.push(confirmedRoute);
    navLinks.push(allContributions);
    navLinks.push(giftsAdmin);
    navLinks.push(logout);
  } else if (user) {
    navLinks.push(logout);
  } else if (!user) {
    navLinks.push(loginAdmin);
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

  // Detectar scroll
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Logo / Nome dos noivos */}
            <a
              href="#home"
              className="text-2xl font-bold text-[#B24C60] cursor-pointer drop-shadow-lg"
              onClick={() => navigate("/")}
            >
              Vitória & Yuri
            </a>
          </div>

          {/* Menu dropdown */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity cursor-pointer bg-[#F9E8EB] hover:bg-[#F3D1D6] px-3 py-2 rounded-full">
                <Menu size={20} className="text-[#B24C60]" />
                <div className="w-12 h-12 rounded-full bg-[#B24C60] flex items-center justify-center text-white">
                  <User size={28} />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              {navLinks.map((link) => (
                <DropdownMenuItem
                  key={link.label}
                  onClick={link.onClick}
                  className="cursor-pointer text-gray-700 hover:text-[#B24C60] hover:bg-[#F9E8EB] focus:text-[#B24C60] focus:bg-[#F9E8EB] py-3"
                >
                  {link.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

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
          <Button
            text="Ok"
            onClick={() => {
              setConfirmOpen(false);
              navigate("/login", { replace: true });
            }}
            variant="secondary"
          />
        </div>
      </Dialog>
    </>
  );
}

export default Navbar;
