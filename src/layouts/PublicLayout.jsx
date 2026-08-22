import { Outlet, Link, NavLink } from "react-router-dom";

const PublicLayout = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Inventory</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" to={"/login"}>Login</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to={"/register"}>Register</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    )
}
export default PublicLayout;