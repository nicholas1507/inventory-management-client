import { useAuth } from "../contexts/AuthContext";
import {Navigate, Outlet} from 'react-router-dom';

export default function RoleBasedRoute({allowedRoles}){
    const {user} = useAuth();

    const userRoles = user?.roles || [];
    const isAllowed = allowedRoles.some(role => userRoles.includes(role));
    return isAllowed ? <Outlet /> : <Navigate to={"/dashboard"}/>
}