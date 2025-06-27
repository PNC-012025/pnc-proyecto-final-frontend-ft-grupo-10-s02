import { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useAdminStore } from "../../store/useAdminStore";

interface User {
	id: string;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	active: boolean;
	dui: string;
	role: "ROLE_ADMIN" | "ROLE_USER";
}

const DepositClientTable = () => {
	const [filterText, setFilterText] = useState("");
	const { users, loading, error, fetchAllUsers } = useAdminStore();

	// Solo usuarios con rol "ROL_USER"
	const filteredData = users
		.filter((user) => user.role === "ROLE_USER")
		.filter((user) =>
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
				<span className="text-sm text-gray-600 font-medium">{row.id}</span>
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
			name: <span className="font-bold text-gray-700">Estado</span>,
			cell: (row: User) => (
				<div className="flex items-center">
					<span
						className={`w-3 h-3 rounded-full mr-2 ${row.active ? "bg-green-500" : "bg-red-500"}`}></span>
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
		// Puedes agregar aquí una columna de acción para depositar
	];

	useEffect(() => {
		fetchAllUsers();
	}, [fetchAllUsers]);

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
					<h1 className="text-2xl font-bold text-gray-800">Clientes para Depósito</h1>
					<p className="text-gray-500 mt-1">
						Solo se muestran los clientes con rol "Cliente"
					</p>
				</div>
				<div className="flex mt-4 md:mt-0 space-x-3">
					<div className="relative">
						<input
							type="text"
							placeholder="Buscar cliente..."
							value={filterText}
							onChange={(e) => setFilterText(e.target.value)}
							className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64 text-gray-700"
						/>
						<div className="absolute left-3 top-3 text-gray-400"></div>
					</div>
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
					Mostrando {filteredData.length > 5 ? 5 : filteredData.length} de {filteredData.length} clientes
				</div>
			</div>
		</div>
	);
};

export default DepositClientTable;
