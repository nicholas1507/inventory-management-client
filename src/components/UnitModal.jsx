import React, {useState, useEffect} from "react";
import {
    CModal,CModalHeader,CModalBody,CModalTitle,CModalFooter,CButton
} from '@coreui/react';

const UnitModal = ({visible,setVisible,onSubmit,selectedData,setSelectedData}) => {
    const [form,setForm] = useState({
        name: "", abbreviation: ""
    });
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);
    useEffect(() => {
        if(selectedData){
            setForm({...form,
                id: selectedData.id,
                name: selectedData.name,
                abbreviation: selectedData.abbreviation
            });
        }else{
            setForm({name: "", abbreviation: ""});
        }
    },[selectedData, visible])
    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try{
            await onSubmit(form);
            handleCancel();
        }catch(error){
            setError(error.response?.data?.message || "Failed submit unit!");
        }finally{
            setLoading(false);
        }
    }
    function onChange(e){
        setForm({...form, [e.target.name]: e.target.value});
    }
    const handleCancel = () => {
        setForm({name: "", abbreviation: ""});
        setVisible(false);
        setSelectedData(null);
    }
    return(
        <CModal visible={visible} onClose={() => setVisible(false)}>
            <form onSubmit={handleSubmit}>
                <CModalHeader>
                    <CModalTitle>{selectedData ? "Edit Unit" : "Add Unit"}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input 
                        name="name"
                        type="text"
                        className="form-control"
                        value={form.name}
                        onChange={onChange}
                        required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Abbreviation</label>
                        <input 
                        name="abbreviation"
                        type="text" 
                        className="form-control"
                        value={form.abbreviation}
                        onChange={onChange}
                        required/>
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

export default UnitModal;