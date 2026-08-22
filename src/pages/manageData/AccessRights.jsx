import React,{useState, useEffect, use} from "react";
import { getRoles,createRole,updateRole,deleteRole } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import { CButton } from "@coreui/react";
import AccessRightsModal from "../../components/AccessRightsModal";

const AccessRights = () => {
    const [roles,setRoles] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);
    const [loadDelete,setLoadDelete] = useState(false);
    const [selectedData,setSelectedData] = useState(null);
    const [visible,setVisible] = useState(false);
    const {user} = useAuth();

    const loadRoles = async() => {
        setLoading(true);
        setError(null);
        try{
            const data = await getRoles();
            setRoles(Array.isArray(data) ? data : data.data);
        }catch(error){
            setError(error.response?.data?.message || "Failed to load roles!");
        }finally{
            setLoading(false);
        }
    }
    const editRole = (role) => {
        setSelectedData(role);
        setVisible(true);
    }
    useEffect(() => {
        loadRoles();
    },[]);
    const handleSave = async(data) => {
        if(data.id){
            await updateRole(data.id, data);
        }else{
            await createRole(data);
        }
        await loadRoles();
        setVisible(false);
        setSelectedData(null);
    }
    const handleDelete = async(id) => {
        setLoadDelete(true);
        setError(null);
        if(!window.confirm("Yakin hapus role ini ?")) return;
        try{
            await deleteRole(id);
            await loadRoles();
        }catch(error){
            setError(error.response?.data?.message || "Failed to delete role!");
        }finally{
            setLoadDelete(false);
        }
    }
    return(
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Roles</h3>
                <CButton color="primary" onClick={() => setVisible(true)}>+ Add Role</CButton>
            </div>
            <p>Logged in as <strong>{user?.name || user?.roles}</strong></p>
            <div className="mb-3">
                {error && <div className="alert alert-danger">{error}</div>}
                <AccessRightsModal 
                visible={visible}
                setVisible={setVisible}
                onSubmit={handleSave}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                />
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="card-title">Role List</div>
                    <hr />
                    {loading ? <div>Loading...</div> : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Role Name</th>
                                        <th>Description</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center">No data found</td>
                                        </tr>
                                    )}
                                    {roles.map((role,idx) => (
                                        <tr key={role.id}>
                                            <td>{idx + 1}</td>
                                            <td>{role.name}</td>
                                            <td className="description-role">
                                                {role.description || "-"}
                                            </td>
                                            <td>
                                                <button className="btn btn-primary me-2" onClick={() => editRole(role)}>
                                                    <i className="bi bi-save me-0"></i>
                                                </button>
                                                <button className="btn btn-danger" onClick={() => handleDelete(role.id)}>
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

export default AccessRights;