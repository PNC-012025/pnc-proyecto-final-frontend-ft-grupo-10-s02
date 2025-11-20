import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useAdminStore } from "../../../store/useAdminStore";
import { toast } from "react-toastify";
import { RegisterFormData } from "../../../types";


const CreateUserModal = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { fetchAllUsers } = useAdminStore();

	const {
		register,
		handleSubmit,
		reset,
		trigger,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormData>({
		mode: "onTouched",
	});

	const onSubmit = async (data: RegisterFormData) => {
		try {
			const token = localStorage.getItem("token");
			await axios.post(
				`${import.meta.env.VITE_API_URL}/auth/register`,
				data,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success("Usuario creado exitosamente");
			fetchAllUsers();
			reset();
			setIsOpen(false);
		} catch (e: unknown) {
			let msg = "Error al crear usuario";
			if (typeof e === "object" && e !== null && "response" in e) {
				const err = e as { response?: { data?: { message?: string } } };
				msg = err.response?.data?.message || msg;
			}
			toast.error(msg);
		}
	};

	const handleOpen = () => {
		setIsOpen(true);
		reset();
	};

	return (
		<>
			{/* Botón para abrir el modal */}
			<button
				onClick={handleOpen}
				className="btn-admin-new flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-5 py-2.5 rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 shadow hover:shadow-lg font-medium focus:ring-2 focus:ring-blue-300 focus:outline-none"
			>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
					<path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
				</svg>
				Crear Usuario
			</button>

			{/* Popup con animaciones */}
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
							{/* Encabezado */}
							<div className="p-6 border-b border-gray-200">
								<h2 className="text-xl font-semibold text-center">
									Nuevo Usuario
								</h2>
								<p className="text-gray-600 text-sm text-center mt-1">
									Complete todos los campos requeridos
								</p>
							</div>

							{/* Formulario */}
							<form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
								{/* Campos del formulario */}
								<div className="space-y-4">
									{/* Username */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Nombre de usuario <span className="text-red-500">*</span>
										</label>
										<input
											{...register("username")}
											className={`w-full px-4 py-2.5 rounded-lg border ${errors.username ?
												"border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500" :
												"border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
												} transition-colors in-admin-us`}
											placeholder="john_doe"
											onBlur={() => trigger("username")}
										/>
										{errors.username && (
											<p className="mt-1 text-sm text-red-600 flex items-center gap-1">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
												</svg>
												{errors.username.message}
											</p>
										)}
									</div>

									{/* Nombre y Apellido */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Nombre <span className="text-red-500">*</span>
											</label>
											<input
												{...register("firstName")}
												className={`w-full px-4 py-2.5 rounded-lg border ${errors.firstName ?
													"border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500" :
													"border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
													} transition-colors in-admin-us`}
												placeholder="John"
												onBlur={() => trigger("firstName")}
											/>
											{errors.firstName && (
												<p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Apellido <span className="text-red-500">*</span>
											</label>
											<input
												{...register("lastName")}
												className={`w-full px-4 py-2.5 rounded-lg border ${errors.lastName ?
													"border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500" :
													"border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
													} transition-colors in-admin-us`}
												placeholder="Doe"
												onBlur={() => trigger("lastName")}
											/>
											{errors.lastName && (
												<p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
											)}
										</div>
									</div>

									{/* DUI */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											DUI <span className="text-red-500">*</span>
										</label>
										<input
											{...register("dui")}
											className={`w-full px-4 py-2.5 rounded-lg border ${errors.dui ?
												"border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500" :
												"border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
												} transition-colors in-admin-us`}
											placeholder="00000000-0"
											onBlur={() => trigger("dui")}
										/>
										{errors.dui && (
											<p className="mt-1 text-sm text-red-600">{errors.dui.message}</p>
										)}
									</div>

									{/* Email */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Correo electrónico <span className="text-red-500">*</span>
										</label>
										<input
											{...register("email")}
											className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ?
												"border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500" :
												"border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
												} transition-colors in-admin-us`}
											placeholder="correo@ejemplo.com"
											onBlur={() => trigger("email")}
										/>
										{errors.email && (
											<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
										)}
									</div>

									{/* Contraseña */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Contraseña <span className="text-red-500">*</span>
										</label>
										<input
											type="password"
											{...register("password")}
											className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ?
												"border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500" :
												"border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
												} transition-colors in-admin-us`}
											placeholder="••••••••"
											onBlur={() => trigger("password")}
										/>
										{errors.password && (
											<p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
										)}
									</div>
								</div>

								{/* Botones de acción */}
								<div className="flex flex-col space-y-3 mt-6">
									<button
										type="submit"
										disabled={isSubmitting}
										className={`w-full py-2.5 text-white rounded-lg transition motion-btn flex items-center justify-center gap-2 ${isSubmitting
											? "bg-indigo-400 cursor-not-allowed"
											: "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 "
											}`}
									>
										{isSubmitting ? (
											<>
												<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
												Procesando...
											</>
										) : (
											<>
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
												</svg>
												Crear Usuario
											</>
										)}
									</button>

									<button
										type="button"
										onClick={() => setIsOpen(false)}
										className="w-full py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-lg transition motion-cancel"
									>
										Cancelar
									</button>
								</div>
							</form>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default CreateUserModal;