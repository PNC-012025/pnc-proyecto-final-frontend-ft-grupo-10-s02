import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/useAdminStore';

interface User {
	id: string;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	active: boolean;
	dui: string;
	role: string;
}

interface UserDetailsPopupProps {
	userId: string;
	onClose: () => void;
}

export const UserDetailsPopup = ({ userId, onClose }: UserDetailsPopupProps) => {
	const users = useAdminStore(state => state.users);
	const getUserById = useAdminStore(state => state.getUserById);

	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const localUser = users.find(u => u.id === userId);
		if (localUser) {
			setUser(localUser);
			setLoading(false);
		} else {
			setLoading(true);
			getUserById(userId).then(userData => {
				setUser(userData);
				setLoading(false);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId, users]);

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<motion.div
					className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md"
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
				>
					<div className="p-6">
						<h2 className="text-xl font-semibold text-center mb-4">
							Detalles del Usuario
						</h2>

						{loading ? (
							<div className="text-center py-4">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
								<p className="mt-2">Cargando información...</p>
							</div>
						) : user ? (
							<div className="space-y-3">
								<div className="flex items-center">
									<span className="font-medium w-1/3">ID:</span>
									<span>{user.id}</span>
								</div>
								<div className="flex items-center">
									<span className="font-medium w-1/3">Nombre:</span>
									<span>{user.first_name} {user.last_name}</span>
								</div>
								<div className="flex items-center">
									<span className="font-medium w-1/3">Email:</span>
									<span className="text-blue-500">{user.email}</span>
								</div>
								<div className="flex items-center">
									<span className="font-medium w-1/3">DUI:</span>
									<span className="text-blue-500">{user.dui}</span>
								</div>
								<div className="flex items-center">
									<span className="font-medium w-1/3">Rol:</span>
									<span className="text-blue-500">{user.role}</span>
								</div>
							</div>
						) : (
							<p className="text-center py-4 text-red-500">Error al cargar la información del usuario</p>
						)}

						<div className="mt-6 flex justify-center">
							<button
								onClick={onClose}
								className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition motion-btn"
							>
								Cerrar
							</button>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

export default UserDetailsPopup;