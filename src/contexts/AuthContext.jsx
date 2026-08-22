import React,{useState, useEffect, createContext, useContext} from "react";
import { login as apiLogin } from "../api/api.js";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    })
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if(user){
            localStorage.setItem('user', JSON.stringify(user));
        }else{
            localStorage.removeItem('user');
        }
    },[user]);

    const login = async(credentials) => {
        setLoading(true);
        try{
            const data = await apiLogin(credentials);
            const token = data.token;
            const decode = data.userData;
            if(token){
                localStorage.setItem('token', token);
            }
            setUser({id: decode.id, roles: decode.roles});
            setLoading(false);
            return {success: true};
        }catch(err){
            setLoading(false);
            return {success: false, message: err.response?.data?.message || err.message}
        }
    }
    const logout = async() => {
        setLoading(true);
        try{
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setLoading(false);
            return {success: true};
        }catch(err){
            setLoading(false);
            return {success: false};
        }
    }
    return(
        <AuthContext.Provider value={{login, logout, loading, user}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}