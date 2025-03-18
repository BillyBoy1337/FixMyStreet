import useAuthStore from "@/store/authStore";
import useShowToast from "./useShowToast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
    const [error, setError] = useState(null);
	const showToast = useShowToast();
	const logoutUser = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			localStorage.removeItem("user");
            localStorage.removeItem("token");
			logoutUser();
            navigate("/login");
		} catch (error) {
            setError(error.response?.data?.error? error.response.data.error : error.message);
			showToast("Error", error.message, "error");
		}
	};
	return { handleLogout, error };
};

export default useLogout;
