import { createContext, useState } from "react";
import { getMe } from "./services/auth.api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    return (
        <AuthContext.Provider
            value={{ user, loading, setUser, setLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};
//sometimes people can think why we have created a AuthProvider a seprate function can we just not export AuthContext after keep data into varible but it is not possible and also
