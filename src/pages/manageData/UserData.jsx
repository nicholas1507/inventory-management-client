import React,{useState, useEffect} from "react";
import { getUsers,getRoles,deleteUser,updateUser, createUser } from "../../api/api";
import {useAuth} from '../../contexts/AuthContext';
import { CButton } from "@coreui/react";
import UserDataModal from "../../components/UserDataModal";

const UserData = () => {
    const [users,setUsers] = useState([]);
    const [loading,setLoading] = useState(false);
    const [loadingRoles,setLoadingRoles] = useState(false);
    const [error,setError] = useState(null);
    const [visible,setVisible] = useState(false);
    const [roles,setRoles] = useState([]);
    const [selectedData,setSelectedData] = useState(null);
    const [currentPage,setCurrentPage] = useState(1);
    const [search,setSearch] = useState("");
    const [pagination,setPagination] = useState({totalData: 0,totalPage: 1, limit: 10});
    const {user} = useAuth();

    const loadUsers = async(page = 1,keyword= "") => {
        setLoading(true);
        setError(null);
        try{
            const data = await getUsers({page,limit: pagination.limit, search: keyword});
            setUsers(Array.isArray(data) ? data : data.data);
        }catch(error){
            setError(error.response?.data?.message || "Failed to load users!");
        }finally{
            setLoading(false);
        }
    }
    const loadRoles = async() => {
        setLoadingRoles(true);
        setError(null);
        try{
            const data = await getRoles();
            setRoles(Array.isArray(data) ? data : data.data);
        }catch(error){
            setError(error.response?.data?.message || "Failed to load users!");
        }finally{
            setLoadingRoles(false);
        }
    }
    useEffect(() => {
        loadUsers(currentPage,search);
    },[currentPage,search]);
    useEffect(() => {
        loadRoles();
    },[]);
    const handleEdit = (user) => {
        setSelectedData(user);
        setVisible(true);
    }
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    }
    const handleDelete = async(id) => {
        setLoading(true);
        setError(null);
        try{
            await deleteUser(id);
            await loadUsers(currentPage,search)
        }catch(error){
            setError(error.response?.data?.message || "Failed to delete user!");
        }finally{
            setLoading(false);
        }
    }
    const handleSave = async(data) => {
        if(data.id){
            await updateUser(data.id,data);
        }else{
            await createUser(data);
        }
        await loadUsers(currentPage,search);
    }
    return(
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h3>Users</h3>
                <CButton color="primary" onClick={() => setVisible(true)}>
                    + Add User
                </CButton>
            </div>
            <p>Logged in as <strong>{user?.name || user?.roles}</strong></p>
            <div className="mb-3">
                {error && <div className="alert alert-danger">{error}</div>}
                <UserDataModal 
                visible={visible}
                setVisible={setVisible}
                onSubmit={handleSave}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                roles={roles}/>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <label className="form-label">Search</label>
                    <input 
                    type="text"
                    className="form-control" 
                    onChange={handleSearch}
                    placeholder="Search user..."/>
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="card-title">User List</div>
                    <hr />
                    {loading ? <div>Loading...</div> : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center">No data found</td>
                                        </tr>
                                    )}
                                    {users.map((user,idx) => (
                                        <tr key={user.id}>
                                            <td>{idx+1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.roles[0]['name'] || "-"}</td>
                                            <td>
                                                <button className="btn btn-primary me-2" onClick={() => handleEdit(user)}>
                                                    <i className="bi bi-save me-0"></i>
                                                </button>
                                                <button className="btn btn-danger">
                                                    <i className="bi bi-trash me-0"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserData;