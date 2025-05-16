import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);


    const login = (userData, token) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
    }

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");;
        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}