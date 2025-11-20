import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';

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
					className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md motion"
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
				>
					<h2 className="text-xl font-semibold motion-header text-center p-6 border-b border-gray-200">
						Detalles del Usuario
					</h2>

					<div className="p-6">
						{loading ? (
							<div className="text-center py-4">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
								<p className="mt-2 text-gray-600">Cargando información...</p>
							</div>
						) : user ? (
							<div className="space-y-4 text-gray-700">
								<div className="flex justify-between">
									<span className="font-medium">ID:</span>
									<span className="text-gray-900">{user.id}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium">Nombre:</span>
									<span className="text-gray-900">{user.first_name} {user.last_name}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium">Email:</span>
									<span className="text-blue-500">{user.email}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium">DUI:</span>
									<span className="text-blue-500">{user.dui}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium">Rol:</span>
									<span className="text-blue-500">{user.role}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium">Estado:</span>
									<span className={`${user.active ? 'text-green-500' : 'text-red-500'}`}>
										{user.active ? 'Activo' : 'Inactivo'}
									</span>
								</div>
							</div>
						) : (
							<p className="text-center py-4 text-red-500">Error al cargar la información del usuario</p>
						)}

						<div className="mt-8 flex flex-col space-y-3">
							<button
								onClick={onClose}
								className="w-full py-2.5 bg-blue-950 text-white rounded-lg transition motion-btn"
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