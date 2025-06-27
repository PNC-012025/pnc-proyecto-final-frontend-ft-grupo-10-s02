import { useEffect, useState } from 'react';
import { useAdminTransStore } from '../../store/useAdminTransStore';

const TransactionSearch = () => {
	const { transactions, loading, error, fetchTransactions, findById } = useAdminTransStore();
	const [searchId, setSearchId] = useState('');

	useEffect(() => {
		fetchTransactions();
	}, [fetchTransactions]);

	const handleSearch = async () => {
		if (searchId.trim() === '') {
			fetchTransactions();
		} else {
			await findById(searchId.trim());
		}
	};

	return (
		<div className="w-full h-full px-6 py-8 bg-gray-50 rounded-2xl shadow-sm">
			<div className="mb-6">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">Transacciones</h1>
						<p className="text-gray-500 mt-1">
							Se muestran todas las transacciones registradas
						</p>
					</div>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
					</svg>
				</div>
				<div className="mt-4 flex gap-2">
					<input
						type="text"
						placeholder="Buscar por ID de Transacción"
						className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
						value={searchId}
						onChange={(e) => setSearchId(e.target.value)}
						onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
					/>
					<button
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						onClick={handleSearch}
					>
						Buscar
					</button>
				</div>
			</div>

			{error && (
				<div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
					{error}
				</div>
			)}

			{loading ? (
				<div className="py-12 text-center">
					<svg className="animate-spin mx-auto h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					<p className="text-gray-500">Cargando transacciones...</p>
				</div>
			) : transactions.length > 0 ? (
				<div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
					<h2 className="px-6 pt-6 pb-2 text-lg font-semibold text-blue-700">Transacciones</h2>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuenta Origen</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titular Origen</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuenta Destino</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titular Destino</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{transactions.map((transaction) => (
									<tr key={transaction.transactionId} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{transaction.transactionId.slice(0, 8)}...</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
												${Number(transaction.amount).toFixed(2)}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{transaction.date ? new Date(transaction.date).toLocaleString() : ''}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.originAccount.accountNumber}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.originAccount.accountOwner}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.destinationAccount.accountNumber}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.destinationAccount.accountOwner}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			) : (
				<div className="py-12 text-center">
					<h3 className="text-lg font-medium text-gray-700">
						{error ? "Error en la carga" : "No se encontraron transacciones"}
					</h3>
					<p className="text-gray-500 mt-1">
						{error
							? "Por favor intente nuevamente"
							: "No hay transacciones registradas"}
					</p>
				</div>
			)}
		</div>
	);
};

export default TransactionSearch;