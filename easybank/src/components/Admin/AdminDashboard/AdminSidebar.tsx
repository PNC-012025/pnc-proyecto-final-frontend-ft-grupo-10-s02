import { useState, useEffect } from "react"; // Importar useEffect
import {
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaMoneyBillTransfer, FaTableColumns, } from "react-icons/fa6";

import '../../../styles/AdminStyle.css'

interface SidebarProps {
  setActiveSection: (section: string) => void;
}

const menuItems = [
  { name: "Usuarios", section: "usuarios", icon: <FaUser /> },
  { name: "Transacciones", section: "transacciones", icon: <FaMoneyBillTransfer /> },
  { name: "Cuentas", section: "cuentas", icon: <FaTableColumns /> },
];

const AdminSidebar = ({ setActiveSection }: SidebarProps) => {
  const [active, setActive] = useState("usuarios");

  useEffect(() => {
    setActiveSection("usuarios");
  }, []); // para que solo se monte una vez

  const handleClick = (section: string) => {
    setActive(section);
    setActiveSection(section);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md flex flex-col items-center py-6">
      {/* Logo */}
      <div className="w-full px-6 mb-6">
        <img
          src="./logo.svg"
          alt="Logo"
          className="w-full h-auto max-h-16 object-contain img-admin"
        />
      </div>

      {/* Navegación como botones visuales */}
      <nav className="flex-1 w-full px-4 py-5 flex flex-col items-center gap-6 justify-self-auto relative nav-admin">
        {menuItems.map((item) => (
          <button
            key={item.section}
            onClick={() => handleClick(item.section)}
            className={`
        flex items-center justify-center w-full
        px-6 py-5 min-h-[70px]
        rounded-xl
        text-2xl font-medium
        transition-all duration-200
        border-2
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
        relative cursor-pointer
        ${active === item.section
                ? "bg-blue-600 text-white shadow-inner border-blue-700"
                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 shadow-sm hover:shadow-md"
              }`}
          >
            {/* Contenedor para centrar el contenido */}
            <div className="flex items-center w-4/5 justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl opacity-90">{item.icon}</span>
                <span className="text-left">{item.name}</span>
              </div>
            </div>
          </button>
        ))}
      </nav>

      {/* Botón de salir */}
      <div className="mx-4 mt-8 mb-6 w-full max-w-xs md:max-w-md nav-admin">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-4 w-full
              bg-emerald-600 hover:bg-red-700 text-white
              py-3 rounded-xl text-xl font-medium shadow-lg
              transition-all duration-300 transform hover:scale-[1.02]
              border-2 border-emerald-700/20 btn-admin-bar">
          <FaSignOutAlt />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;