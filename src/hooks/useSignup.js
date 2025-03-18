import { useState } from 'react';
import axios from 'axios';
import useAuthStore from "@/store/authStore";
import useShowToast from "./useShowToast";
import { API_BASE_URL } from "@/constants";
import { useNavigate } from 'react-router-dom';

function useSignUpWithEmailAndPassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const showToast = useShowToast();
    const loginUser = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const signup = async (inputs) => {
        if (!inputs.email || !inputs.password || !inputs.username || !inputs.fullName) {
            showToast("Error", "Please fill all the fields", "error");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(API_BASE_URL + "/api/auth/signup", inputs);
            if (response.status === 201) {
                loginUser(response.data);
                showToast("Success", "Account created successfully", "success");
                navigate("/");
            }
        } catch (error) {
            if (error.response.data.error === "User already exists") {
                setError("User already exists");
                showToast("Error", "User already exists", "error");
            }
            else if (error.response.data.error === "Invalid email") {
                setError("Invalid email");
                showToast("Error", "Invalid email", "error");
            }
            else if (error.response.data.error === "Invalid password") {
                setError("Invalid password");
                showToast("Error", "Invalid password", "error");
            }
            else {
                setError(error.message);
                showToast("Error", error.message, "error");
            }
        
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, signup };
}

export default useSignUpWithEmailAndPassword;