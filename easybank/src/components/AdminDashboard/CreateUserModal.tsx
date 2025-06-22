import { useForm } from "react-hook-form";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import axios from "axios";
import { useAdminStore } from "../../store/useAdminStore";
import { toast } from "react-toastify";
import { RegisterFormData } from "../../types";
import { RegisterUserSchema } from "../../schema/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateUserModal = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { fetchAllUsers } = useAdminStore();
	const [showEmptyFieldAlert, setShowEmptyFieldAlert] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(RegisterUserSchema),
	});

	const onSubmit = async (data: RegisterFormData) => {

		const hasEmptyFields = Object.values(data).some(value => !value);

		if (hasEmptyFields) {
			setShowEmptyFieldAlert(true);
			return;
		}
		try {
			const token = localStorage.getItem("token");
			await axios.post(
				`${import.meta.env.VITE_API_URL}/auth/register`,
				data,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			toast.success("Usuario creado exitosamente");
			fetchAllUsers();
			reset();
			setIsOpen(false);
		} catch (e) {
			toast.error("Error al crear usuario");
			console.log(e);

		}
	};

	const handleOpen = () => {
		setShowEmptyFieldAlert(false);
		setIsOpen(true);
		reset();
	};

	const { trigger } = useForm<RegisterFormData>({
		resolver: zodResolver(RegisterUserSchema),
	});

	return (
		<>
			<button
				onClick={handleOpen}
				className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-5 py-2.5 rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium focus:ring-2 focus:ring-blue-300 focus:outline-none"
			>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
					<path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
				</svg>
				Crear Usuario
			</button>

			<Dialog
				open={isOpen}
				onClose={() => setIsOpen(false)}
				className="relative z-50"
			>
				{/* Fondo oscuro con transición */}
				<div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" />

				{/* Contenedor del modal centrado */}
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
						{/* Encabezado del modal */}
						<div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-indigo-100">
							<Dialog.Title
								as="h3"
								className="text-2xl font-bold leading-6 text-gray-800 flex items-center gap-3"
							>
								<div className="bg-indigo-100 p-2 rounded-full">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
									</svg>
								</div>
								<span>Nuevo Usuario</span>
							</Dialog.Title>
							<p className="mt-2 text-gray-600 text-sm">
								Complete todos los campos para registrar un nuevo usuario
							</p>
						</div>

						{/* Formulario */}
						<form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5 px-6 pb-1">
							{/* Alerta de campos vacíos */}
							{showEmptyFieldAlert && (
								<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
									<div className="flex items-start">
										<div className="flex-shrink-0">
											<svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
											</svg>
										</div>
										<div className="ml-3">
											<p className="text-sm text-red-700">
												<strong>Por favor complete todos los campos</strong> antes de crear el usuario.
											</p>
										</div>
									</div>
								</div>
							)}

							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Usuario <span className="text-red-500">*</span>
								</label>
								<input
									{...register("username")}
									placeholder="Nombre de usuario"
									className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${errors.username
										? "border-red-300 focus:ring-red-200 focus:border-red-500"
										: "border-gray-300 focus:ring-indigo-200 focus:border-indigo-500"
										}`}
									onBlur={() => trigger("username")}
								/>
								{errors.username && (
									<p className="text-red-500 text-sm mt-1 flex items-center gap-1">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
										</svg>
										{errors.username.message}
									</p>
								)}
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								<div className="space-y-2">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Nombre <span className="text-red-500">*</span>
									</label>
									<input
										{...register("firstName")}
										placeholder="Nombre"
										className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${errors.firstName
											? "border-red-300 focus:ring-red-200 focus:border-red-500"
											: "border-gray-300 focus:ring-indigo-200 focus:border-indigo-500"
											}`}
										onBlur={() => trigger("firstName")}
									/>
									{errors.firstName && (
										<p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
									)}
								</div>

								<div className="space-y-2">
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Apellido <span className="text-red-500">*</span>
									</label>
									<input
										{...register("lastName")}
										placeholder="Apellido"
										className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${errors.lastName
											? "border-red-300 focus:ring-red-200 focus:border-red-500"
											: "border-gray-300 focus:ring-indigo-200 focus:border-indigo-500"
											}`}
										onBlur={() => trigger("lastName")}
									/>
									{errors.lastName && (
										<p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
									)}
								</div>
							</div>

							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									DUI <span className="text-red-500">*</span>
								</label>
								<input
									{...register("dui")}
									placeholder="00000000-0"
									className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${errors.dui
										? "border-red-300 focus:ring-red-200 focus:border-red-500"
										: "border-gray-300 focus:ring-indigo-200 focus:border-indigo-500"
										}`}
									onBlur={() => trigger("dui")}
								/>
								{errors.dui && (
									<p className="text-red-500 text-sm mt-1">{errors.dui.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Correo electrónico <span className="text-red-500">*</span>
								</label>
								<input
									{...register("email")}
									placeholder="correo@ejemplo.com"
									className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${errors.email
										? "border-red-300 focus:ring-red-200 focus:border-red-500"
										: "border-gray-300 focus:ring-indigo-200 focus:border-indigo-500"
										}`}
									onBlur={() => trigger("email")}
								/>
								{errors.email && (
									<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Contraseña <span className="text-red-500">*</span>
								</label>
								<input
									type="password"
									{...register("password")}
									placeholder="••••••••"
									className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${errors.password
										? "border-red-300 focus:ring-red-200 focus:border-red-500"
										: "border-gray-300 focus:ring-indigo-200 focus:border-indigo-500"
										}`}
									onBlur={() => trigger("password")}
								/>
								{errors.password && (
									<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
								)}
							</div>

							{/* Pie del modal con botones */}
							<div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6 pb-6">
								<button
									type="button"
									onClick={() => setIsOpen(false)}
									className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-300 focus:ring-2 focus:ring-gray-300 focus:outline-none"
								>
									Cancelar
								</button>
								<button
									type="submit"
									disabled={isSubmitting}
									className={`px-5 py-2.5 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-1 focus:ring-2 focus:ring-blue-300 focus:outline-none ${isSubmitting
										? 'bg-indigo-400 cursor-not-allowed'
										: 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600'}`}
								>
									{isSubmitting ? (
										<>
											<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
							</div>
						</form>
					</Dialog.Panel>
				</div>
			</Dialog>
		</>
	);
};

export default CreateUserModal;
