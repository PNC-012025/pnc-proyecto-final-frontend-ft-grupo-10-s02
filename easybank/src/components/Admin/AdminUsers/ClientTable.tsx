import { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { toast } from "react-toastify";
import { useUsers, useDeleteUser, useUpdateUserRole, User } from "../../../hooks/useUsers";
import { ChangeRolePopup } from "./ChangeRolePopup";
import { DeleteUserPopup } from "./DeleteUserPopup";
import CreateUserModal from "./CreateUserModal";
import UserDetailsPopup from "./UserDetailsPopup";


const ClientTable = () => {
  const [filterText, setFilterText] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const [showRolePopup, setShowRolePopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string, role: string, name: string } | null>(null);

  const usersQuery = useUsers();
  const users: User[] = (usersQuery.data ?? []) as User[];
  const loading = usersQuery.isLoading;
  const isError = usersQuery.isError;
  const deleteUserMutation = useDeleteUser();
  const updateRoleMutation = useUpdateUserRole();

  const filteredData = users.filter((user) =>
    `${user.first_name} ${user.last_name} ${user.email} ${user.dui}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const columns: TableColumn<User>[] = [
    {
      name: <span className="font-bold text-gray-700">ID</span>,
      selector: (row: User) => row.id,
      sortable: true,
      width: "180px",
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 font-medium">{row.id}</span>
          <button
            className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
            onClick={async () => {
              if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                try {
                  await navigator.clipboard.writeText(row.id);
                  toast.success("ID copiado al portapapeles");
                } catch (err) {
                  toast.error("No se pudo copiar el ID. Intenta de nuevo.");
                  console.log(err);

                }
              } else {
                toast.error("La función de copiar no es compatible con este navegador.");
              }
            }}
            title="Copiar ID"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth={2} stroke="currentColor" fill="none" />
              <rect x="3" y="3" width="13" height="13" rx="2" ry="2" strokeWidth={2} stroke="currentColor" fill="none" />
            </svg>
          </button>
        </div>
      ),
    },
    {
      name: <span className="font-bold text-gray-700">Nombre</span>,
      selector: (row: User) => row.first_name,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center mr-3">
            <span className="text-gray-600 font-bold text-sm">
              {row.first_name?.charAt(0)?.toUpperCase() ?? ''}
            </span>
          </div>
          <div>
            <span className="block font-medium text-gray-800">
              {row.first_name}
            </span>
            <span className="block text-sm text-gray-500">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      name: <span className="font-bold text-gray-700">Apellido</span>,
      selector: (row: User) => row.last_name,
      sortable: true,
      cell: (row) => (
        <span className="text-gray-700 font-medium">{row.last_name}</span>
      ),
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
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${row.role === "ADMIN"
            ? "bg-purple-100 text-purple-800"
            : "bg-blue-100 text-blue-800"
            }`}>
          {row.role === "ADMIN" ? "Administrador" : "Cliente"}
        </span>
      ),
    },
    {
      name: <span className="font-bold text-gray-700">Estado</span>,
      cell: (row: User) => (
        <div className="flex items-center">
          <span
            className={`w-3 h-3 rounded-full mr-2 ${row.active ? "bg-green-500" : "bg-red-500"
              }`}></span>
          <span
            className={
              row.active
                ? "text-green-600 font-medium"
                : "text-red-600 font-medium"
            }>
            {row.active ? "Activo" : "Inactivo"}
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
            onClick={() => {
              setSelectedUserId(row.id);
              setShowDetails(true);
            }}
            title="Ver detalles"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
          {/* Cambiar rol */}
          {
            <>
              {/* Botón para cambiar rol */}
              <button
                className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-600 transition"
                onClick={() => {
                  setSelectedUser({
                    id: row.id,
                    role: row.role,
                    name: `${row.first_name} ${row.last_name}`
                  });
                  setShowRolePopup(true);
                }}
                title="Cambiar rol"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>

              {/* 3. EL POPUP VA JUSTO AQUÍ, DESPUÉS DEL BOTÓN */}
              {selectedUser && (
                <ChangeRolePopup
                  isOpen={showRolePopup}
                  onClose={() => setShowRolePopup(false)}
                  onConfirm={async () => {
                    const newRole = selectedUser.role === "ADMIN" ? "USER" : "ADMIN";
                    try {
                      await updateRoleMutation.mutateAsync({ id: selectedUser.id, role: newRole });
                    } catch (error) {
                      console.error(error);
                    }
                    setShowRolePopup(false);
                  }}
                  userName={selectedUser.name}
                  currentRole={selectedUser.role === "ADMIN" ? "Administrador" : "Usuario"}
                  newRole={selectedUser.role === "ADMIN" ? "Usuario" : "Administrador"}
                />
              )}
            </>
          }
          {/* Eliminar usuario */}
          {
            row.role !== "ADMIN" && (
              <>
                <button
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition"
                  onClick={() => setDeleteUserId(row.id)}
                  title="Eliminar usuario"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>

                <DeleteUserPopup
                  isOpen={!!deleteUserId}
                  onClose={() => setDeleteUserId(null)}
                  onConfirm={async () => {
                    if (deleteUserId) {
                      try {
                        await deleteUserMutation.mutateAsync(deleteUserId);
                        setDeleteUserId(null);
                      } catch (error) {
                        console.error(error);
                      }
                    }
                  }}
                  userName={
                    users.find(u => u.id === deleteUserId)
                      ? `${users.find(u => u.id === deleteUserId)!.first_name} ${users.find(u => u.id === deleteUserId)!.last_name}`
                      : ""
                  }
                />
              </>
            )
          }
        </div >
      ),
    },
  ];

  // Manejar estados de carga y error
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error cargando usuarios.</p>
          <button
            className="mt-3 px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full px-6 py-8 bg-gray-50 rounded-2xl shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-500 mt-1">
            Lista de todos los clientes registrados en el sistema
          </p>
        </div>

        <div className="flex mt-4 md:mt-0 space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="btn-admin-bar pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64 text-gray-700"
            />
            <div className="absolute left-3 top-3 text-gray-400">
            </div>
          </div>

          {/* Botón para agregar nuevo usuario */}
          <CreateUserModal />
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
            rowsPerPageText: "Filas por página:",
            rangeSeparatorText: "de",
          }}
          striped
          highlightOnHover
          responsive
          customStyles={{
            headRow: {
              style: {
                backgroundColor: "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
                fontWeight: "bold",
              },
            },
            headCells: {
              style: {
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem",
                paddingTop: "1rem",
                paddingBottom: "1rem",
                fontSize: "0.875rem",
                color: "#374151",
              },
            },
            cells: {
              style: {
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem",
                paddingTop: "1rem",
                paddingBottom: "1rem",
              },
            },
            rows: {
              style: {
                fontSize: "0.875rem",
                "&:not(:last-of-type)": {
                  borderBottom: "1px solid #f3f4f6",
                },
              },
              stripedStyle: {
                backgroundColor: "#f9fafb",
              },
              highlightOnHoverStyle: {
                backgroundColor: "#f0f9ff",
                transition: "background-color 0.2s",
              },
            },
            pagination: {
              style: {
                padding: "1.5rem",
                borderTop: "1px solid #e5e7eb",
              },
            },
          }}
          noDataComponent={
            <div className="py-12 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-700">
                No se encontraron clientes
              </h3>
              <p className="text-gray-500 mt-1">
                Intenta ajustar tu búsqueda o filtros
              </p>
            </div>
          }
        />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
        <div className="mb-4 sm:mb-0">
          Mostrando {filteredData.length > 5 ? 5 : filteredData.length} de{" "}
          {filteredData.length} clientes
        </div>
      </div>
      {showDetails && selectedUserId && (
        <UserDetailsPopup
          userId={selectedUserId}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default ClientTable;