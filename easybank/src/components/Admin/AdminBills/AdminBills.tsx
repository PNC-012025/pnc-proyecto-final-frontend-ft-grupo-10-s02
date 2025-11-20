import { useState } from "react";
import { useBillStore } from "../../../store/useBillStore";

const AdminBills = () => {
	const [searchId, setSearchId] = useState("");
	const { bills, loading, error, fetchUserBills } = useBillStore();
	const [searched, setSearched] = useState(false);

	const handleSearch = async () => {
		if (!searchId.trim()) return;
		await fetchUserBills(searchId.trim());
		setSearched(true);
	};

	return (
		<div className="w-full h-full px-6 py-8 bg-gray-50 rounded-2xl shadow-sm">
			{/* Header + Buscador */}
			<div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">Facturas de Usuario</h1>
					<p className="text-gray-500 mt-1">
						Busca y visualiza las facturas de un usuario por su ID
					</p>
				</div>

				{/* Buscador */}
				<div className="flex gap-2 mt-4 md:mt-0">
					<input
						type="text"
						placeholder="ID de usuario"
						className="in-admin-us px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64 text-gray-700"
						value={searchId}
						onChange={(e) => setSearchId(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleSearch()}
					/>
					<button
						className="in-admin-us px-4 py-2.5 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
						onClick={handleSearch}
					>
						Buscar
					</button>
				</div>
			</div>

			{/* Mensaje de error */}
			{error && (
				<div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
			)}

			{/* Loader */}
			{loading && (
				<div className="py-12 text-center">
					<svg
						className="animate-spin mx-auto h-8 w-8 text-blue-600 mb-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
						></path>
					</svg>
					<p className="text-gray-500">Cargando facturas...</p>
				</div>
			)}

			{/* Sin resultados */}
			{searched && !loading && bills.length === 0 && !error && (
				<div className="py-12 text-center">
					<h3 className="text-lg font-medium text-gray-700">No se encontraron facturas</h3>
					<p className="text-gray-500 mt-1">
						Verifica el ID o intenta con otro usuario
					</p>
				</div>
			)}

			{/* Tabla */}
			{!loading && bills.length > 0 && (
				<div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								{["ID", "Categoría", "Monto", "Fecha", "Estado"].map((header) => (
									<th
										key={header}
										className="in-admin-us px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200 in-admin-us">
							{bills.map((bill) => (
								<tr key={bill.id} className="hover:bg-gray-50">
									<td className="in-admin-us px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
										{bill.id.slice(0, 8)}...
									</td>
									<td className="in-admin-us px-6 py-4 whitespace-nowrap text-sm text-gray-700">
										{bill.category}
									</td>
									<td className="in-admin-us px-6 py-4 whitespace-nowrap text-sm text-blue-800 font-semibold">
										${Number(bill.amount).toFixed(2)}
									</td>
									<td className="in-admin-us px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{bill.date ? new Date(bill.date).toLocaleDateString() : ""}
									</td>
									<td className="in-admin-us px-6 py-4 whitespace-nowrap text-sm">
										<span
											className={`px-3 py-1 rounded-full text-xs font-medium ${bill.state === "PENDING"
												? "bg-yellow-100 text-yellow-800"
												: bill.state === "PAID"
													? "bg-green-100 text-green-800"
													: "bg-gray-100 text-gray-700"
												}`}
										>
											{bill.state === "PENDING"
												? "Pendiente"
												: bill.state === "PAID"
													? "Pagada"
													: bill.state}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default AdminBills;
