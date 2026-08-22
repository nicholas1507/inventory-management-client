import Sidebar from '../components/Sidebar';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';

const PrivateLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const {visible, toggle} = useSidebar();
    async function handleLogout() {
        await logout();
        navigate("/login");
    }
    function handleToggle(){
        toggle();
    }
    return (
        <>
            <div>
                <Sidebar />
                <div className="d-flex flex-column" 
                    style={{ 
                        minHeight: '100vh' , 
                        marginLeft: visible ? '200px' : '0',
                        transition: 'margin-left 0.3s'}}>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container-fluid">
                            <button onClick={handleToggle} className='btn btn-outline-secondary border-0'>☰</button>
                            <Link className="navbar-brand" to="/dashboard">Inventory</Link>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/dashboard">Home</NavLink>
                                    </li>
                                    <li className='nav-item'>
                                        <NavLink className="nav-link" to="/profile">Profile</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <main className="flex-grow-1 p-3">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    )
}
export default PrivateLayout;