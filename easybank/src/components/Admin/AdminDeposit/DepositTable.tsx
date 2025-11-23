import { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { toast } from "react-toastify";
import { useUsers } from "../../../hooks/useUsers";
import { useUserAccounts } from "../../../hooks/useAccounts";
import { useDeposit } from "../../../hooks/useDeposits";
import DepositPopup from "./DepositPopup";
import { AccountResponseAdmin } from "../../../schema/account-schema";

interface User {
	id: string;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	active: boolean;
	dui: string;
	role: "ADMIN" | "USER";
}

const DepositTable = () => {
	const [filterText, setFilterText] = useState("");
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const [userAccounts, setUserAccounts] = useState<AccountResponseAdmin[]>([]);
	const [showDepositPopup, setShowDepositPopup] = useState(false);
	const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);


	const { data: users = [] } = useUsers();
	const accountsQuery = useUserAccounts(selectedUserId, !!selectedUserId && showDepositPopup);
	const { data: accounts = [], isLoading: loadingAccounts, error: accountsError } = accountsQuery;
	const depositMutation = useDeposit();

	const filteredData = users
		.filter((user) => user.role !== "ADMIN")
		.filter((user) =>
			`${user.first_name} ${user.last_name} ${user.email} ${user.dui}`.toLowerCase().includes(filterText.toLowerCase())
		);

	const handleOpenDeposit = async (userId: string) => {
		setSelectedUserId(userId);
		setShowDepositPopup(true);
	};

	const handleCloseDeposit = () => {
		setShowDepositPopup(false);
		setSelectedUserId(null);
		setSelectedAccountId(null);
	};


	const handleDeposit = async (amount: number, description: string) => {
		if (!selectedUserId || !selectedAccountId) return;
		try {
			await depositMutation.mutateAsync({ userId: selectedUserId, accountId: selectedAccountId, amount, description });
			// cerrar popup al completar
			setShowDepositPopup(false);
			setSelectedUserId(null);
			setSelectedAccountId(null);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (showDepositPopup && accounts && accounts.length > 0) {
			const firstAccountId = accounts[0]?.id;
			setUserAccounts((prev) => {
				if (prev.length !== accounts.length || prev[0]?.id !== firstAccountId) {
					return accounts;
				}
				return prev;
			});
			setSelectedAccountId((prev) => prev ?? firstAccountId);
		} else {
			setUserAccounts((prev) => (prev.length !== 0 ? [] : prev));
		}
	}, [accounts, showDepositPopup]);

	// ahora los usuarios vienen de React Query (useUsers)

	const columns: TableColumn<User>[] = [
		{
			name: <span className="font-bold text-gray-700">ID</span>,
			selector: (row) => row.id,
			sortable: true,
			width: "180px",
			cell: (row) => (
				<div className="flex items-center space-x-2">
					<span className="text-sm text-gray-600 font-medium">{row.id}</span>
					<button
						className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
						onClick={async () => {
							try {
								await navigator.clipboard.writeText(row.id);
								toast.success("ID copiado al portapapeles");
							} catch {
								toast.error("No se pudo copiar el ID.");
							}
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
							<rect x="3" y="3" width="13" height="13" rx="2" ry="2" />
						</svg>
					</button>
				</div>
			),
		},
		{
			name: <span className="font-bold text-gray-700">Nombre</span>,
			selector: (row) => row.first_name,
			sortable: true,
			cell: (row) => (
				<div className="flex items-center">
					<div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center mr-3">
						<span className="text-gray-600 font-bold text-sm">{row.first_name?.charAt(0).toUpperCase()}</span>
					</div>
					<div>
						<span className="block font-medium text-gray-800">{row.first_name}</span>
						<span className="block text-sm text-gray-500">{row.email}</span>
					</div>
				</div>
			),
		},
		{
			name: <span className="font-bold text-gray-700">Apellido</span>,
			selector: (row) => row.last_name,
			sortable: true,
			cell: (row) => <span className="text-gray-700 font-medium">{row.last_name}</span>,
		},
		{
			name: <span className="font-bold text-gray-700">DUI</span>,
			selector: (row) => row.dui,
			cell: (row) => (
				<div className="bg-gray-100 rounded-md px-2 py-1 inline-block">
					<span className="text-gray-700 font-mono">{row.dui}</span>
				</div>
			),
		},
		{
			name: <span className="font-bold text-gray-700">Rol</span>,
			selector: (row) => row.role,
			cell: (row) => (
				<span className={`px-3 py-1 rounded-full text-xs font-medium ${row.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
					{row.role === "ADMIN" ? "Administrador" : "Cliente"}
				</span>
			),
		},
		{
			name: <span className="font-bold text-gray-700">Abonar</span>,
			cell: (row) => (
				<button
					className="p-3 rounded-xl bg-green-100 hover:bg-green-200 text-green-600 transition"
					style={{ minWidth: "44px", minHeight: "44px" }}
					onClick={() => handleOpenDeposit(row.id)}
					title="Depositar en cuenta"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 icon-deposito" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
					</svg>
				</button>
			),
		},
	];

	return (
		<div className="w-full h-full px-6 py-8 bg-gray-50 rounded-2xl shadow-sm">
			<div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">Cuentas</h1>
					<p className="text-gray-500 mt-1">Lista de cuentas de clientes</p>
				</div>
				<div className="relative mt-4 md:mt-0">
					<input
						type="text"
						placeholder="Buscar cliente..."
						value={filterText}
						onChange={(e) => setFilterText(e.target.value)}
						className="in-admin-us pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64 text-gray-700"
					/>
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
						headRow: { style: { backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", fontWeight: "bold" } },
						headCells: { style: { padding: "1rem 1.5rem", fontSize: "0.875rem", color: "#374151" } },
						cells: { style: { padding: "1rem 1.5rem" } },
						rows: {
							style: { fontSize: "0.875rem", borderBottom: "1px solid #f3f4f6" },
							stripedStyle: { backgroundColor: "#f9fafb" },
							highlightOnHoverStyle: { backgroundColor: "#f0f9ff", transition: "background-color 0.2s" },
						},
						pagination: { style: { padding: "1.5rem", borderTop: "1px solid #e5e7eb" } },
					}}
					noDataComponent={
						<div className="py-12 text-center text-gray-600">
							<svg className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<h3 className="text-lg font-medium">No se encontraron clientes</h3>
							<p className="text-gray-500 mt-1">Intenta ajustar tu búsqueda o filtros</p>
						</div>
					}
				/>
			</div>

			{showDepositPopup && selectedUserId && (
				<DepositPopup
					open={showDepositPopup}
					onClose={handleCloseDeposit}
					userId={selectedUserId}
					accounts={userAccounts}
					selectedAccountId={selectedAccountId ?? ""}
					setSelectedAccountId={setSelectedAccountId}
					loadingAccounts={loadingAccounts}
					errorAccounts={accountsError ? (accountsError as Error).message : ''}
					onDeposit={handleDeposit}
					loadingDeposit={depositMutation.status === 'pending'}
					errorDeposit={depositMutation.error ? (depositMutation.error as Error).message : ''}
					success={depositMutation.status === 'success'}
				/>
			)}

			<div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
				<div className="mb-4 sm:mb-0">
					Mostrando {filteredData.length > 5 ? 5 : filteredData.length} de {filteredData.length} clientes
				</div>
			</div>
		</div>
	);
};

export default DepositTable;
