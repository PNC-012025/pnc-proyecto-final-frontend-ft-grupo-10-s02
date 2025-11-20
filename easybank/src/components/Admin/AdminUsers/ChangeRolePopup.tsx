import { motion, AnimatePresence } from 'framer-motion';

interface ChangeRolePopupProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	userName?: string;
	currentRole: string;
	newRole: string;
}

export const ChangeRolePopup = ({
	isOpen,
	onClose,
	onConfirm,
	userName,
	currentRole,
	newRole
}: ChangeRolePopupProps) => {
	return (
		<AnimatePresence>
			{isOpen && (
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
							Cambiar Rol de Usuario
						</h2>

						<div className="p-6">
							<div className="flex flex-col items-center mb-6">
								<div className="mx-auto bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-8 w-8 text-yellow-600 mx-auto"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
										/>
									</svg>
								</div>

								<p className="text-gray-700 font-medium text-center">
									¿Está seguro de cambiar el rol de este usuario?
								</p>

								{userName && (
									<p className="mt-3 text-gray-900 font-semibold text-center">
										{userName}
									</p>
								)}

								<div className="mt-4 bg-gray-50 p-3 rounded-lg w-full text-center">
									<p className="text-sm text-gray-600">
										<span className="font-medium">Rol actual:</span> {currentRole}
									</p>
									<p className="text-sm text-gray-600 mt-1">
										<span className="font-medium">Nuevo rol:</span>
										<span className="text-blue-600 ml-1">{newRole}</span>
									</p>
								</div>

								<p className="mt-4 text-sm text-gray-500 text-center">
									Esta acción modificará los permisos y acceso del usuario en el sistema.
								</p>
							</div>

							<div className="flex flex-col space-y-3">
								<button
									onClick={onConfirm}
									className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition motion-btn"
								>
									Confirmar Cambio
								</button>

								<button
									onClick={onClose}
									className="w-full py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-lg transition motion-cancel"
								>
									Cancelar
								</button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};