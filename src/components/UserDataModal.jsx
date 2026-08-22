import React,{useState,useEffect} from "react";
import {
    CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter,CButton
} from '@coreui/react';

const UserDataModal = ({visible,setVisible,onSubmit,selectedData,setSelectedData,roles}) => {
    const [form,setForm] = useState({
        name: "", email: "", password: "",confirmationPassword: "",roleIds: []
    });
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    useEffect(() => {
        if(selectedData){
            setForm({...form,
                id: selectedData.id || "",
                name: selectedData.name || "",
                email: selectedData.email || "",
                password: selectedData.password || "",
                confirmationPassword: selectedData.password || "",
                roleIds: selectedData.roles || ""
            });
        }else{
            setForm({name: "", email: "", password: "",confirmationPassword: "",roleIds: []})
        }
    },[selectedData,visible])
    const handleCancel = () => {
        setForm({name: "", email: "", password: "",confirmationPassword: "",roleIds: []});
        setVisible(false);
        setSelectedData(null);
    }
    const onChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try{
            await onSubmit(form);
            handleCancel();
        }catch(error){
            setError(error.response?.data?.message || "Failed to submit user!");
        }finally{
            setLoading(false);
        }
    }
    return(
        <CModal visible={visible} onClose={() => setVisible(false)}>
            <form onSubmit={handleSubmit}>
                <CModalHeader>
                    <CModalTitle>{selectedData ? "UPDATE USER" : "CREATE USER"}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input 
                        type="text" 
                        name="name"
                        onChange={onChange} 
                        value={form.name}
                        className="form-control"
                        required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input 
                        type="text" 
                        name="email"
                        onChange={onChange} 
                        value={form.email}
                        className="form-control"
                        required />
                    </div>
                    {!selectedData && (
                        <>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input 
                                type="password" 
                                name="password"
                                onChange={onChange} 
                                value={form.password}
                                className="form-control"
                                required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Confirmation Password</label>
                                <input 
                                type="password" 
                                name="confirmationPassword"
                                onChange={onChange} 
                                value={form.confirmationPassword}
                                className="form-control"
                                required />
                            </div>
                        </>
                    )}
                    <div className="mb-3">
                        {selectedData && (
                            <div>{`Akun ini memiliki roles: ${form.roleIds[0]['name']}`}</div>
                        )}
                        {roles.map((role) => (
                        <div key={role.id}>
                            <label className="form-label me-3">{role.name}</label>
                            <input 
                            type="checkbox" 
                            value={role.id}
                            onChange={(e) => setForm({...form, roleIds: [e.target.value]})}
                            required/>
                        </div>
                        ))}
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCancel}>Cancel</CButton>
                    <CButton color="primary" type="submit" disabled={loading}>{loading ? "Save..." : "Save"}</CButton>
                </CModalFooter>
            </form>
        </CModal>
    )
}

export default UserDataModal;