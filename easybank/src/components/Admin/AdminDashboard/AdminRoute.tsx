import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEasyBankStore } from "../../../store/userStore";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
	const { fetchWhoami, isAdmin, isAuthenticated } = useEasyBankStore();
	const navigate = useNavigate();

	useEffect(() => {
		const checkAdmin = async () => {
			try {
				await fetchWhoami();
				if (!isAdmin()) {
					navigate("/dashboard", { replace: true });
				}
			} catch {
				navigate("/login", { replace: true });
			}
		};
		if (isAuthenticated) {
			checkAdmin();
		} else {
			navigate("/login", { replace: true });
		}
		// eslint-disable-next-line
	}, [isAuthenticated]);

	return <>{children}</>;
};

export default AdminRoute;