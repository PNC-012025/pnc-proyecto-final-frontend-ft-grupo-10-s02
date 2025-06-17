import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { TableColumn } from 'react-data-table-component';

interface User {
  _id: string;
  name: string;
  lastname: string;
  dui: string;
  email: string;
  rol: string;
  active: boolean;
}

const DUMMY_USERS: User[] = [
  {
    _id: '1',
    name: 'Juan',
    lastname: 'Pérez',
    dui: '01234567-8',
    email: 'juan@example.com',
    rol: 'cliente',
    active: true,
  },
  {
    _id: '2',
    name: 'María',
    lastname: 'González',
    dui: '12345678-9',
    email: 'maria@example.com',
    rol: 'cliente',
    active: false,
  },
  {
    _id: '3',
    name: 'Carlos',
    lastname: 'Ramírez',
    dui: '23456789-0',
    email: 'carlos@example.com',
    rol: 'cliente',
    active: true,
  },
];

const columns: TableColumn<User>[] = [
  {
    name: 'ID',
    selector: (row: User) => row._id,
    sortable: true,
  },
  {
    name: 'Nombre',
    selector: (row: User) => row.name,
    sortable: true,
  },
  {
    name: 'Apellido',
    selector: (row: User) => row.lastname,
    sortable: true,
  },
  {
    name: 'DUI',
    selector: (row: User) => row.dui,
  },
  {
    name: 'Email',
    selector: (row: User) => row.email,
  },
  {
    name: 'Rol',
    selector: (row: User) => row.rol,
  },
  {
    name: 'Estado',
    cell: (row: User) => (
      <span className={row.active ? 'text-green-600' : 'text-red-600'}>
        {row.active ? 'Activo' : 'Inactivo'}
      </span>
    ),
  },
];

const ClientTable = () => {
  const [filterText, setFilterText] = useState('');

  const filteredData = DUMMY_USERS.filter(user =>
    `${user.name} ${user.lastname}`.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="w-full h-full px-6 py-4">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      <input
        type="text"
        placeholder="Buscar por nombre"
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
        className="mb-4 px-3 py-2 border border-gray-300 rounded w-full max-w-md"
      />

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        striped
        highlightOnHover
        responsive
      />
    </div>
  );
};

export default ClientTable;
