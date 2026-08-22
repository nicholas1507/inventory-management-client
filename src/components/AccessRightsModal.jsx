import React,{useEffect, useState} from "react";
import {
    CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter,CButton
} from '@coreui/react'

const AccessRightsModal = ({visible,setVisible,onSubmit,selectedData,setSelectedData}) => {
    const [form,setForm] = useState({
        name: "",description: ""
    });
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    useEffect(() => {
        if(selectedData){
            setForm({...form,
                id: selectedData.id,
                name: selectedData.name,
                description: selectedData.description || ""
            });
        }
    },[selectedData,visible])
    const handleCancel = () => {
        setForm({name: "", description: ""});
        setVisible(false);
        setSelectedData(null)
    }
    const handleChange = (e) => {
        setForm({...form,[e.target.name]: e.target.value});
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try{
            await onSubmit(form);
            handleCancel();
        }catch(error){
            setError(error.response?.data?.message || "Failed to submit role!");
        }finally{
            setLoading(false);
        }
    }
    return(
        <CModal visible={visible} onClose={() => setVisible(false)}>
            <form onSubmit={handleSubmit}>
                <CModalHeader>
                    <CModalTitle>{selectedData ? "UPDATE ROLE" : "CREATE ROLE"}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input 
                        type="text" 
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="form-control"
                        required/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <input 
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="form-control" />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => handleCancel()}>Cancel</CButton>
                    <CButton color="primary" type="submit" disabled={loading}>{loading ? "Save..." : "Save"}</CButton>
                </CModalFooter>
            </form>
        </CModal>
    )
}

export default AccessRightsModal;