import { createContext, useContext, useState } from 'react';
import { mockLogin } from '../authApi'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    async function login(email, password) {
        try {
            const loggedInUser = await mockLogin(email, password);
            setUser(loggedInUser);
        } catch (err) {
            throw err;
        }
    }

    async function signup(email, password) {

    }

    async function logout() {

    }

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
