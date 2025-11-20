import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';

interface Account {
	id: string;
	firstName: string;
	lastName: string;
	accountNumber: string;
	balance: number;
}

interface DepositPopupProps {
	open: boolean;
	onClose: () => void;
	userId: string;
	accounts: Account[];
	selectedAccountId: string;
	setSelectedAccountId: (id: string) => void;
	loadingAccounts: boolean;
	errorAccounts: string | null;
	onDeposit: (amount: number, description: string) => Promise<void>;
	loadingDeposit: boolean;
	errorDeposit: string | null;
	success: boolean;
}

const DepositPopup: React.FC<DepositPopupProps> = ({
	open,
	onClose,
	userId,
	accounts,
	selectedAccountId,
	setSelectedAccountId,
	loadingAccounts,
	errorAccounts,
	onDeposit,
	loadingDeposit,
	errorDeposit,
	success,
}) => {
	const [amount, setAmount] = useState('');
	const [description, setDescription] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!amount || isNaN(Number(amount)) || !selectedAccountId) return;
		await onDeposit(Number(amount), description);
	};

	useEffect(() => {
		if (success) {
			setAmount('');
			setDescription('');
			onClose();
		}
	}, [success, onClose]);

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<motion.div
						className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md motion"
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
					>
						<h2 className="text-xl font-semibold text-center p-6 border-b border-gray-200 motion-header">
							Realizar Depósito
						</h2>
						<div className="p-6">
							<form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
								<div className="space-y-2">
									<label className="block text-sm font-medium">ID Usuario</label>
									<input
										type="text"
										value={userId}
										disabled
										className="in-admin-us w-full px-4 py-2.5 rounded-lg bg-gray-100 border border-gray-300 cursor-not-allowed text-gray-500"
									/>
								</div>

								<div className="space-y-2">
									<label className="block text-sm font-medium">
										Cuenta <span className="text-red-500">*</span>
									</label>
									{loadingAccounts ? (
										<div className="text-sm text-gray-500">Cargando cuentas...</div>
									) : errorAccounts ? (
										<div className="text-sm text-red-500">{errorAccounts}</div>
									) : (
										<select
											value={selectedAccountId}
											onChange={(e) => setSelectedAccountId(e.target.value)}
											required
											className="in-admin-us w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
										>
											<option value="">Seleccione una cuenta</option>
											{accounts.map((acc) => (
												<option key={acc.id} value={acc.id}>
													{acc.firstName} {acc.lastName} ({acc.accountNumber})
												</option>
											))}
										</select>
									)}
								</div>

								<div className="space-y-2">
									<label className="block text-sm font-medium">
										Monto <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<span className="absolute left-3 top-3 text-gray-400"></span>
										<input
											type="number"
											value={amount}
											onChange={(e) => setAmount(e.target.value)}
											required
											min="1"
											className="in-admin-us w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
											placeholder="0.00"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label className="block text-sm font-medium">
										Descripción <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										required
										className="in-admin-us w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
										placeholder="Detalle del depósito"
									/>
								</div>

								{errorDeposit && (
									<p className="text-red-500 text-sm">{errorDeposit}</p>
								)}

								<div className="mt-8 flex flex-col space-y-3">
									<button
										type="submit"
										disabled={loadingDeposit || loadingAccounts}
										className="w-full py-2.5 bg-blue-950 text-white rounded-lg transition motion-btn disabled:opacity-70 flex items-center justify-center"
									>
										{loadingDeposit ? (
											<>
												<svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
												</svg>
												Procesando...
											</>
										) : (
											"Depositar"
										)}
									</button>
									<button
										type="button"
										onClick={onClose}
										className="w-full py-2.5 bg-gray-100 text-white rounded-lg transition motion-cancel"
										disabled={loadingDeposit}
									>
										Cancelar
									</button>
								</div>
							</form>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default DepositPopup;
