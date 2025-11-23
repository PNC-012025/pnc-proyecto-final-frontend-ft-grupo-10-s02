import { useState } from "react";
import { useAdminFindAll, useAdminFindById } from "../../../hooks/useAdminFindAll";

// HARDCODEADO
type Account = {
	accountOwner: string;
	accountNumber: string;
};

type ApiTx = {
	transactionId?: string;
	id?: string;
	transaction_id?: string;
	date?: string;
	amount?: number | string;
	originAccount?: Account;
	origin?: Account;
	destinationAccount?: Account;
	destination?: Account;
};

const TransactionSearch = () => {
	const [searchId, setSearchId] = useState("");
	const [searchedId, setSearchedId] = useState<string | null>(null);

	const transactionsQuery = useAdminFindAll();
	const transactionByIdQuery = useAdminFindById(searchedId);

	const handleSearch = async () => {
		const id = searchId.trim();
		setSearchedId(id === "" ? null : id);
	};

	return (
		<div className="w-full h-full px-6 py-8 bg-gray-50 rounded-2xl shadow-sm">
			<div className="mb-6">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">Transacciones</h1>
						<p className="text-gray-500 mt-1">Se muestran todas las transacciones registradas</p>
					</div>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
					</svg>
				</div>

				<div className="mt-4 flex gap-2">
					<input
						type="text"
						placeholder="Buscar por ID de Transacción"
						className="in-admin-us w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-700"
						value={searchId}
						onChange={(e) => setSearchId(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleSearch();
						}}
					/>
					<button
						className="in-admin-us px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						onClick={handleSearch}
					>
						Buscar
					</button>
				</div>
			</div>


			{(() => {
				const errorMsg = transactionByIdQuery.error || transactionsQuery.error ? ((transactionByIdQuery.error || transactionsQuery.error) as Error).message : null;
				if (errorMsg) {
					return (
						<div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
							{errorMsg}
						</div>
					);
				}

				if (transactionsQuery.isLoading || transactionByIdQuery.isLoading) {
					return (
						<div className="py-12 text-center">
							<svg className="animate-spin mx-auto h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<p className="text-gray-500">Cargando transacciones...</p>
						</div>
					);
				}

				let list: ApiTx[] = []
				if (searchedId) {
					const d = transactionByIdQuery.data
					if (!d) list = []
					else if (Array.isArray(d)) list = d
					else list = [d]
				} else {
					list = transactionsQuery.data ?? []
				}

				if (list.length > 0) {
					return (
						<div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
							<h2 className="px-6 pt-6 pb-2 text-lg font-semibold text-blue-700">Lista de transacciones</h2>
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200 text-sm text-left">
									<thead className="bg-gray-50 text-gray-600 uppercase text-xs">
										<tr>
											<th className="in-admin-us px-6 py-3 tracking-wider font-medium">ID</th>
											<th className="in-admin-us px-6 py-3 tracking-wider font-medium">Monto</th>
											<th className="in-admin-us px-6 py-3 tracking-wider font-medium">Fecha</th>
											<th className="in-admin-us px-6 py-3 tracking-wider font-medium">Cuenta Origen</th>
											<th className="in-admin-us px-6 py-3 tracking-wider font-medium">Titular Origen</th>
											<th className="in-admin-us px-6 py-3 tracking-wider font-medium">Cuenta Destino</th>
											<th className="in-admin-us px-6 py-3 tracking-wider font-medium">Titular Destino</th>
										</tr>
									</thead>
									<tbody className="in-admin-us divide-y divide-gray-100 bg-white">
										{list.map((t: ApiTx) => {
											// soportar diferentes shapes devueltos por la API
											const txId = t.transactionId ?? t.id ?? t.transaction_id ?? ""
											const amount = Number(t.amount ?? 0)
											const origin: Account = t.originAccount ?? t.origin ?? { accountNumber: "", accountOwner: "" }
											const dest: Account = t.destinationAccount ?? t.destination ?? { accountNumber: "", accountOwner: "" }

											return (
												<tr key={txId || Math.random()} className="hover:bg-blue-50 transition">
													<td className="px-6 py-4 font-mono text-gray-700">{(txId || "").slice(0, 8)}{txId ? '...' : ''}</td>
													<td className="px-6 py-4">
														<span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
															${amount.toFixed(2)}
														</span>
													</td>
													<td className="px-6 py-4 text-gray-600">{t.date ? new Date(t.date).toLocaleString() : ""}</td>
													<td className="in-admin-us px-6 py-4 text-gray-600">{origin.accountNumber}</td>
													<td className="in-admin-us px-6 py-4 text-gray-600">{origin.accountOwner}</td>
													<td className="in-admin-us px-6 py-4 text-gray-600">{dest.accountNumber}</td>
													<td className="in-admin-us px-6 py-4 text-gray-600">{dest.accountOwner}</td>
												</tr>
											)
										})}
									</tbody>
								</table>
							</div>
						</div>
					);
				}
				return (
					<div className="py-12 text-center text-gray-600">
						<svg className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<h3 className="text-lg font-medium">No se encontraron transacciones</h3>
						<p className="text-gray-500 mt-1">Intenta con otro ID o revisa si hay datos registrados</p>
					</div>
				);
			})()}
		</div>
	);
};

export default TransactionSearch;
