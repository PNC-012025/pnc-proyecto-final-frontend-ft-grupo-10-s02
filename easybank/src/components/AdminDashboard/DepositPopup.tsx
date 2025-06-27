import { useState } from "react";
import { useDepositStore } from "../../store/useDepositStore";
import { DepositInput } from "../../schema/deposit-schema";

interface DepositPopupProps {
	userId: string;
	isOpen: boolean;
	onClose: () => void;
}

const initialForm: DepositInput = {
	accountId: "",
	amount: 0,
	description: "",
};

const DepositPopup = ({ userId, isOpen, onClose }: DepositPopupProps) => {
	const [form, setForm] = useState<DepositInput>(initialForm);
	const { depositToAccount, loading, error, success, reset } = useDepositStore();
	const [submitted, setSubmitted] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: name === "amount" ? Number(value) : value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitted(true);
		await depositToAccount(userId, form);
	};

	const handleClose = () => {
		setForm(initialForm);
		setSubmitted(false);
		reset();
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
			<div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
				<button
					className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
					onClick={handleClose}
				>
					&times;
				</button>
				<h2 className="text-xl font-bold mb-4 text-blue-700">Realizar Depósito</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-gray-700 mb-1">ID de Cuenta</label>
						<input
							type="text"
							name="accountId"
							value={form.accountId}
							onChange={handleChange}
							className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
							required
						/>
					</div>
					<div>
						<label className="block text-gray-700 mb-1">Monto</label>
						<input
							type="number"
							name="amount"
							value={form.amount}
							onChange={handleChange}
							className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
							min={1}
							required
						/>
					</div>
					<div>
						<label className="block text-gray-700 mb-1">Descripción</label>
						<textarea
							name="description"
							value={form.description}
							onChange={handleChange}
							className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
							required
						/>
					</div>
					{error && <div className="text-red-600 text-sm">{error}</div>}
					{success && submitted && (
						<div className="text-green-600 text-sm">Depósito realizado correctamente</div>
					)}
					<div className="flex justify-end gap-2">
						<button
							type="button"
							className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
							onClick={handleClose}
							disabled={loading}
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
							disabled={loading}
						>
							{loading ? "Procesando..." : "Depositar"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default DepositPopup;
