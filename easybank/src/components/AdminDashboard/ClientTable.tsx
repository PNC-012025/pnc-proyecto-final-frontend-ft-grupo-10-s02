import { useState } from 'react';

interface User {
  _id: string;
  username: string;
  name: string;
  lastname: string;
  email: string;
  rol: string;
  createdAt: string;
  active: boolean;
}

interface Props {
  elementId?: string;
}

// Datos quemados
const DUMMY_USERS: User[] = [
  {
    _id: '1',
    username: 'juanito01',
    name: 'Juan',
    lastname: 'Pérez',
    email: 'juan@example.com',
    rol: 'cliente',
    createdAt: '2023-01-10T12:00:00Z',
    active: true,
  },
  {
    _id: '2',
    username: 'maria88',
    name: 'María',
    lastname: 'González',
    email: 'maria@example.com',
    rol: 'cliente',
    createdAt: '2023-02-14T15:30:00Z',
    active: false,
  },
  {
    _id: '3',
    username: 'carlos_dev',
    name: 'Carlos',
    lastname: 'Ramírez',
    email: 'carlos@example.com',
    rol: 'cliente',
    createdAt: '2023-03-20T08:45:00Z',
    active: true,
  },
];

const ClientTable = ({ elementId }: Props) => {
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [search, setSearch] = useState('');

  const handleToggle = (userId: string) => {
    const updated = users.map(user =>
      user._id === userId ? { ...user, active: !user.active } : user
    );
    setUsers(updated);
  };

  const handleSearch = (term: string) => {
    setSearch(term);
  };

  const filtered = users.filter(user =>
    `${user.name} ${user.lastname}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Clientes</h1>

      <input
        type="text"
        placeholder="Buscar por nombre"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Usuario</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{user._id}</td>
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.name} {user.lastname}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.rol}</td>
                <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{user.active ? 'Activo' : 'Inactivo'}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleToggle(user._id)}
                    className={`px-3 py-1 rounded text-sm ${
                      user.active
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {user.active ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;
