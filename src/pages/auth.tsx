import { useState, useEffect } from "react";
import Login from "./login";
import SignUp from "./signup";
import { useAuth } from "../context/auth.context";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const [hasAccount, setHasAccount] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/profile");
        }
    }, [user, navigate]);

    const toggleAccountType = () => {
        setHasAccount((prev) => !prev);
    };

    return (
        <div>
            {hasAccount ? <Login /> : <SignUp />}
            <button onClick={toggleAccountType}>
                {hasAccount ? "Switch to Sign Up" : "Switch to Login"}
            </button>
        </div>
    );
}
