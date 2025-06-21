import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useAdminStore } from '../../store/useAdminStore';

interface User {
  id: string;
  name: string;
  lastname: string;
  dui: string;
  email: string;
  role: string;
  active: boolean;
}

const ClientTable = () => {
  const [filterText, setFilterText] = useState('');
  const [showModal, setShowModal] = useState(false);

  const {
    users,
    loading,
    error,
    fetchAllUsers,
    getUserById,
    deleteUser,
    changeUserRole
  } = useAdminStore();

  const filteredData = users.filter(user =>
    `${user.name} ${user.lastname}`.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns: TableColumn<User>[] = [
    {
      name: <span className="font-bold text-gray-700">ID</span>,
      selector: (row: User) => row.id,
      sortable: true,
      width: '100px',
      cell: (row) => <span className="text-sm text-gray-600 font-medium">{row.id}</span>,
    },
    {
      name: <span className="font-bold text-gray-700">Nombre</span>,
      selector: (row: User) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center mr-3">
            <span className="text-gray-600 font-bold text-sm">{row.name.charAt(0)}</span>
          </div>
          <div>
            <span className="block font-medium text-gray-800">{row.name}</span>
            <span className="block text-sm text-gray-500">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      name: <span className="font-bold text-gray-700">Apellido</span>,
      selector: (row: User) => row.lastname,
      sortable: true,
      cell: (row) => <span className="text-gray-700 font-medium">{row.lastname}</span>,
    },
    {
      name: <span className="font-bold text-gray-700">DUI</span>,
      selector: (row: User) => row.dui,
      cell: (row) => (
        <div className="bg-gray-100 rounded-md px-2 py-1 inline-block">
          <span className="text-gray-700 font-mono">{row.dui}</span>
        </div>
      ),
    },
    {
      name: <span className="font-bold text-gray-700">Rol</span>,
      selector: (row: User) => row.role,
      cell: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.role === 'ADMIN'
          ? 'bg-purple-100 text-purple-800'
          : 'bg-blue-100 text-blue-800'
          }`}>
          {row.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
        </span>
      ),
    },
    {
      name: <span className="font-bold text-gray-700">Estado</span>,
      cell: (row: User) => (
        <div className="flex items-center">
          <span className={`w-3 h-3 rounded-full mr-2 ${row.active ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
          <span className={row.active ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
            {row.active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      ),
    },
    {
      name: <span className="font-bold text-gray-700">Acciones</span>,
      cell: (row: User) => (
        <div className="flex space-x-2">
          {/* Ver detalles */}
          <button
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
            onClick={async () => {
              const user = await getUserById(row.id);
              if (user) {
                alert(`Detalles:\nNombre: ${user.firstName} ${user.lastName}\nEmail: ${user.email}`);
              }
            }}
            title="Ver detalles"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          {/* Cambiar rol */}
          <button
            className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-600 transition"
            onClick={async () => {
              const nuevoRol = row.role === "admin" ? ["USER"] : ["ADMIN"];
              await changeUserRole(row.id, nuevoRol);
              alert("Rol actualizado");
            }}
            title="Cambiar rol"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {/* Eliminar usuario */}
          {row.role !== "ADMIN" && (
            <button
              className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition"
              onClick={async () => {
                if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
                  await deleteUser(row.id);
                  alert("Usuario eliminado");
                }
              }}
              title="Eliminar usuario"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      ),
    },
  ];

  // Estado para nuevo usuario
  const [newUser, setNewUser] = useState({
    name: '',
    lastname: '',
    dui: '',
    email: '',
    role: 'USER',
    active: true
  });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Crear nuevo usuario en el backend
      await createUser({
        ...newUser,
        active: newUser.active === true
      });

      // Recargar usuarios
      await fetchAllUsers();

      // Cerrar modal y resetear formulario
      setShowModal(false);
      setNewUser({
        name: '',
        lastname: '',
        dui: '',
        email: '',
        role: 'client',
        active: true
      });

      // Mostrar mensaje de éxito
      alert('Usuario creado exitosamente!');
    } catch (err) {
      alert('Error al crear el usuario');
    }
  };

  // Manejar estados de carga y error
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full px-6 py-8 bg-gray-50 rounded-2xl shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-500 mt-1">Lista de todos los clientes registrados en el sistema</p>
        </div>

        <div className="flex mt-4 md:mt-0 space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64 text-gray-700"
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Botón para agregar nuevo usuario */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center transition shadow-md whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 15]}
          paginationComponentOptions={{
            rowsPerPageText: 'Filas por página:',
            rangeSeparatorText: 'de',
          }}
          striped
          highlightOnHover
          responsive
          customStyles={{
            headRow: {
              style: {
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
                fontWeight: 'bold',
              },
            },
            headCells: {
              style: {
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                fontSize: '0.875rem',
                color: '#374151',
              },
            },
            cells: {
              style: {
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
              },
            },
            rows: {
              style: {
                fontSize: '0.875rem',
                '&:not(:last-of-type)': {
                  borderBottom: '1px solid #f3f4f6',
                },
              },
              stripedStyle: {
                backgroundColor: '#f9fafb',
              },
              highlightOnHoverStyle: {
                backgroundColor: '#f0f9ff',
                transition: 'background-color 0.2s',
              },
            },
            pagination: {
              style: {
                padding: '1.5rem',
                borderTop: '1px solid #e5e7eb',
              },
            },
          }}
          noDataComponent={
            <div className="py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-700">No se encontraron clientes</h3>
              <p className="text-gray-500 mt-1">Intenta ajustar tu búsqueda o filtros</p>
            </div>
          }
        />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
        <div className="mb-4 sm:mb-0">
          Mostrando {filteredData.length > 5 ? 5 : filteredData.length} de {filteredData.length} clientes
        </div>
      </div>

      {/* Modal para crear nuevo usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Crear Nuevo Usuario</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newUser.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={newUser.lastname}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="dui" className="block text-sm font-medium text-gray-700 mb-1">
                      DUI
                    </label>
                    <input
                      type="text"
                      id="dui"
                      name="dui"
                      value={newUser.dui}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="00000000-0"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
                        Rol
                      </label>
                      <select
                        id="rol"
                        name="rol"
                        value={newUser.role}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ADMIN">Administrador</option>
                        <option value="USER">Cliente</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="active" className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <select
                        id="active"
                        name="active"
                        value={newUser.active ? "true" : "false"}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Crear Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientTable;