import React, { use } from "react";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate('/login');
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Inventory</Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className={"nav-link"} to={"/"}>Home</NavLink>
                        </li>
                        {!user && (
                            <> 
                                <li className="nav-item">
                                    <NavLink className="nav-link" to={"/login"}>Login</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to={"/register"}>Register</NavLink>
                                </li>
                            </>
                        )}
                        {user && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to={"/dashboard"}>Dashboard</NavLink>
                                </li>  
                                <li className="nav-item">
                                    <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        )}
                        
                    </ul>
                </div>
            </div>
        </nav>
    )
}