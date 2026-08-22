import React, {useState, useEffect} from "react";
import {
    CModal,CModalBody,CModalHeader,CModalTitle,CModalFooter,CButton
} from '@coreui/react';

const CustomerModal = ({visible,setVisible,onSubmit,selectedData,setSelectedData}) => {
    const [form,setForm] = useState({
        name:"", address: ""
    });
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    useEffect(() => {
        if(selectedData){
            setForm({...form,
                id: selectedData.id,
                name: selectedData.name,
                address: selectedData.address
            });
        }else{
            setForm({name: "", address: ""});
        }
    },[selectedData,visible])
    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try{
            await onSubmit(form);
            handleCancel();
        }catch(error){
            setError(error.response?.data?.message || "Failed to submit customer!");
        }finally{
            setLoading(false);
        }
    }
    const onChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    }
    const handleCancel = () => {
        setForm({name: "", address: ""});
        setVisible(false);
        setSelectedData(null);
    }
    return(
        <CModal visible={visible} onClose={() => setVisible(false)}>
            <form onSubmit={handleSubmit}>
                <CModalHeader>
                    <CModalTitle>{selectedData ? "Edit Customer" : "Add Customer"}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input 
                        name="name"
                        type="text"
                        onChange={onChange}
                        className="form-control"
                        value={form.name}
                        required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input 
                        name="address"
                        type="text" 
                        onChange={onChange}
                        className="form-control"
                        value={form.address}
                        required/>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCancel}>Cancel</CButton>
                    <CButton color="primary" type="submit" disabled={loading}>{loading ? "Save...": "Save"}</CButton>
                </CModalFooter>
            </form>
        </CModal>
    )
}

export default CustomerModal;