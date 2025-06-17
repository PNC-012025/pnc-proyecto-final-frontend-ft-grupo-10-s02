import { useState } from 'react';
import {
  FaUser,
  FaTable,
  FaMap,
  FaExclamationCircle,
  FaSignOutAlt,
} from 'react-icons/fa';

interface SidebarProps {
  setActiveSection: (section: string) => void;
}

const menuItems = [
  { name: 'Usuarios', section: 'usuarios', icon: <FaUser /> },
  { name: 'Tarjetas', section: 'tarjetas', icon: <FaTable /> },
  { name: 'Movimientos', section: 'movimientos', icon: <FaMap /> },
  { name: 'Reportar errores', section: 'notfound', icon: <FaExclamationCircle /> },
];

const AdminSidebar = ({ setActiveSection }: SidebarProps) => {
  const [active, setActive] = useState('usuarios');

  const handleClick = (section: string) => {
    setActive(section);
    setActiveSection(section);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md flex flex-col items-center py-6">
      {/* Logo */}
      <div className="w-full px-6 mb-6">
        <img
          src="./logo.svg"
          alt="Logo"
          className="w-full h-auto max-h-16 object-contain"
        />
      </div>

      {/* Navegación como botones visuales */}
      <nav className="flex-1 w-full px-4 flex flex-col gap-4">
        {menuItems.map((item) => (
          <button
            key={item.section}
            onClick={() => handleClick(item.section)}
            className={`flex items-center gap-x-3 px-4 py-3 rounded-lg shadow-sm transition text-sm font-medium border 
              ${
                active === item.section
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-transparent'
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Botón de salir */}
      <div className="w-full px-4 mt-6">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-x-2 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-md"
        >
          <FaSignOutAlt />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
