import { useState } from 'react';
import { useAdminTransStore } from '../../store/useAdminTransStore';
import { toast } from 'react-toastify';

const TransactionSearch = () => {
	const [userId, setUserId] = useState('');
	const { transactions, loading, error, fetchTransactions } = useAdminTransStore();

	const handleSearch = async () => {
		if (!userId.trim()) {
			toast.error('Por favor ingrese un ID de usuario');
			return;
		}
		await fetchTransactions(userId);


	};

	const translateType = (type: string) => {
		switch (type) {
			case 'DEPOSIT': return 'Depósito';
			case 'WITHDRAWAL': return 'Retiro';
			case 'TRANSFER': return 'Transferencia';
			default: return type;
		}
	};
	return (
		<div className="w-full h-full px-6 py-8 bg-gray-50 rounded-2xl shadow-sm">
			<div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">Buscar Transacciones</h1>
					<p className="text-gray-500 mt-1">
						Ingrese el ID de usuario para ver su historial de transacciones
					</p>
				</div>

				<div className="flex mt-4 md:mt-0 space-x-3">
					<div className="relative flex-1 min-w-[300px]">
						<input
							type="text"
							placeholder="ID de usuario..."
							value={userId}
							onChange={(e) => setUserId(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
							disabled={loading}
						/>
						<div className="absolute left-3 top-3 text-gray-400">
						</div>
					</div>

					<button
						onClick={handleSearch}
						disabled={loading}
						className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center disabled:opacity-50"
					>
						{loading ? (
							<>
								<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Buscando...
							</>
						) : 'Buscar'}
					</button>
				</div>
			</div>

			{error && (
				<div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
					{error}
				</div>
			)}

			{transactions.length > 0 ? (
				<div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuenta</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{transactions.map((transaction) => (
									<tr key={transaction.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{transaction.id.slice(0, 8)}...</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
												${Number(transaction.amount).toFixed(2)}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{transaction.description}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.accountNumber}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{transaction.date ? new Date(transaction.date).toLocaleString() : ''}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{translateType(transaction.type)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.name}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			) : (
				!loading && (
					<div className="py-12 text-center">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
						</svg>
						<h3 className="text-lg font-medium text-gray-700">
							{error ? "Error en la búsqueda" : "No se encontraron transacciones"}
						</h3>
						<p className="text-gray-500 mt-1">
							{error
								? "Por favor intente nuevamente"
								: "Realice una búsqueda para ver las transacciones"}
						</p>
					</div>
				)
			)}
		</div>
	);
};

export default TransactionSearch;