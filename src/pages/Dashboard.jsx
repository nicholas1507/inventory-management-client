import React from "react";
import { useAuth } from "../contexts/AuthContext";
import AdminDashboard from '../dashboard/AdminDashboard'
import SuperAdminDashboard from "../dashboard/SuperAdminDashboard";
import UserDashboard from '../dashboard/UserDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    const role = user?.roles?.[0];

    if(role === "Super Admin"){
        return <SuperAdminDashboard />
    }
    if (role === "User") {
        return <UserDashboard />;
    }

    if (role === "Admin") {
        return <AdminDashboard />;
    }

    return (
        <div className="container-fluid px-4 py-4">
            <div className="alert alert-warning">
                Unknown user role: {role || "Unknown"}
            </div>
        </div>
    );
};

export default Dashboard;