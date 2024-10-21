import { createContext, useContext, useState, useEffect, SetStateAction, Dispatch } from "react";
import { UserType } from "../types";

type AuthContextType = {
    user: Omit<UserType, "password"> | null,
    login: (email: string, name: string) => void,
    logout: () => void,
    setUser: Dispatch<SetStateAction<Omit<UserType, "password"> | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthContextProvider({ children }: { children: JSX.Element }) {
    const [user, setUser] = useState<Omit<UserType, "password"> | null>(null);

    // Load user from session storage on initial render
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (email: string, name: string) => {
        const newUser = { email, name };
        setUser(newUser);
        sessionStorage.setItem('user', JSON.stringify(newUser)); // Store user in session storage
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user'); // Clear user from session storage
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used in AuthContextProvider context");
    return context;
}
