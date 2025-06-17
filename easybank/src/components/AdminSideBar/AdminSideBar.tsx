import { useState } from 'react';
import Search from './Search';

interface SidebarProps {
  setActiveSection: (section: string) => void;
}

const menuItems = [
  { name: 'Usuarios', section: 'usuarios' },
  { name: 'Tarjetas', section: 'tarjetas' },
  { name: 'Movimientos', section: 'movimientos' },
];

const AdminSidebar = ({ setActiveSection }: SidebarProps) => {
  const handleLogout = () => {
    console.log('Cerrar sesión');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col p-4">
      {/* Perfil */}
      <div className="mb-6">
        <div className="rounded-full w-16 h-16 bg-gray-700 mb-2"></div>
        <p className="text-lg font-semibold">Admin</p>
        <p className="text-sm text-gray-400">admin@example.com</p>
      </div>

      <Search />

      {/* Navegación */}
      <nav className="flex-1">
        <ul className="space-y-4 pl-4">
          {menuItems.map((item, index) => (
            <li key={item.name}>
              <button
                onClick={() => setActiveSection(item.section)}
                className="w-full text-left block px-4 py-2 rounded transition hover:bg-gray-800 text-gray-300"
              >
                {item.name}
              </button>

              {index === menuItems.length - 1 && (
                <div className="my-4 border-t border-gray-700" />
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Cerrar sesión */}
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
      >
        Cerrar sesión
      </button>
    </aside>
  );
};

export default AdminSidebar;
