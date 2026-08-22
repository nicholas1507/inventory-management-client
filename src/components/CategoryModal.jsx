import React, {useState, useEffect} from "react";
import {
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CModalFooter,
    CButton
} from '@coreui/react';

const CategoryModal = ({visible, setVisible, onSubmit, selectedData, setSelectedData}) => {
    const [form,setForm] = useState({
        name: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if(selectedData){
            setForm({
                id: selectedData.id,
                name: selectedData.name
            });
        }else{
            setForm({name: ""});
        }
    },[selectedData, visible]);
    const onChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };
    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try{
            await onSubmit(form);
            handleCancel();
        }catch(error){
            setError(error.response?.data?.message || "Submit Category Failed!");
        }finally{
            setLoading(false);
        }
    }
    const handleCancel = () => {
        setForm({name: ""});
        setVisible(false);
        setSelectedData(null);
    }
    return(
        <>
            <CModal visible={visible} onClose={() => setVisible(false)}>
                <form onSubmit={handleSubmit}>
                    <CModalHeader>
                        <CModalTitle>{selectedData ? "Edit Category": "Add Category"}</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        {error && <div className="alert alert-danger p-2 small">{error}</div>}
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                            name="name" 
                            type="text"
                            className="form-control"
                            onChange={onChange}
                            placeholder="Add category"
                            value={form.name}
                            required 
                            />
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={handleCancel}>Cancel</CButton>
                        <CButton color="primary" type="submit" disabled={loading}>{loading ? "Save..." : "Save"}</CButton>
                    </CModalFooter>
                </form>
            </CModal>
        </>
    )
}

export default CategoryModal;