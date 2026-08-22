import React, {useState, useEffect} from "react";
import {
    CModal,CModalHeader,CModalTitle,CModalBody,CModalFooter,CButton
} from '@coreui/react';

const ProductModal = ({visible, setVisible, onSubmit, categories, units, selectedData, setSelectedData}) => {
    const [form, setForm] = useState({
        name: "",
        minimumStock: "",
        description: "",
        price: "",
        productCode: "",
        file: null,
        unitId: "",
        categoryId: ""
    });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if(selectedData){
            setForm({
            id: selectedData.id,
            name: selectedData.name || "", 
            minimumStock: selectedData.minimumStock ?? "", 
            description: selectedData.description || "",
            price: selectedData.price ?? "",
            productCode: selectedData.productCode || "",
            file: null,
            unitId: selectedData.unitId || "",
            categoryId: selectedData.categoryId || ""
            });
            setPreview(selectedData.imageURL || null);
        }else{
            setForm({
                id: null,
                name: "",
                minimumStock: "",
                description: "",
                price: "",
                productCode: "",
                file: null,
                unitId: "",
                categoryId: ""
            })
            setPreview(null);
        }
    },[selectedData,visible])
    const onChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    }
    const handleImage = (e) => {
        const fileImage = e.target.files[0]
        setForm({...form, file: fileImage});

        if(preview){
            URL.revokeObjectURL(preview);
        }
        if(fileImage){
            setPreview(URL.createObjectURL(fileImage));
        }else{
            setPreview(null);
        }
    }
    // const handleEdit = async(item) => {
    //     const categoryId = item.category?.id || item.category?._id || item.category;
    //     setForm({
    //         name: item.name || "", 
    //         minimumStock: item.minimumStock ?? "", 
    //         description: item.name || "",
    //         price: item.price ?? "",
    //         productCode: item.productCode || "",
    //         file: null,
    //         unitId: item.unitId || "",
    //         categoryId: item.categoryId || ""
    //     })
    // }
    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if(!form.name.trim()){
            setError("Product name required!");
            return;
        }
        if(!form.minimumStock || !form.description || !form.price || !form.productCode){
            setError("Error, product data incomplete!");
            return;
        }
        if(!form.unitId || !form.categoryId){
            setError("Chose the unit and category for product!");
            return;
        }
        try{
            await onSubmit(form);

            handleCancel();
        }catch(error){
            setError(error.response?.data?.message || "Submit failed!");
        }finally{
            setLoading(false);
        }
    } 
    const handleCancel = () => {
        setForm({
                name: "",
                minimumStock: "",
                description: "",
                price: "",
                productCode: "",
                file: null,
                unitId: "",
                categoryId: ""
            });
        setPreview(null);
        setVisible(false);
        setSelectedData(null);
    }
    return(
        <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
            <form onSubmit={handleSubmit}>
                <CModalHeader>
                    <CModalTitle>{selectedData ? "Edit Product" : "Add Product"}</CModalTitle>
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
                        value={form.name}
                        required/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Minimum Stock</label>
                        <input 
                        name="minimumStock"
                        type="number" 
                        className="form-control"
                        onChange={onChange}
                        value={form.minimumStock}
                        required/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <input 
                        name="description"
                        type="text" 
                        className="form-control"
                        onChange={onChange}
                        value={form.description}
                        required/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input 
                        name="price"
                        type="number" 
                        className="form-control"
                        onChange={onChange}
                        value={form.price}
                        required/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Product Code</label>
                        <input 
                        name="productCode"
                        type="text" 
                        className="form-control"
                        onChange={onChange}
                        value={form.productCode}
                        required/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Image</label>
                        <input 
                        type="file" 
                        className="form-control"
                        onChange={handleImage}
                        required/>
                    </div>
                    {preview && (
                        <img src={preview} alt="preview" style={{width: "150px", height: "150px"}}/>
                    )}
                    <div className="mb-3">
                        <label className="form-label">Category</label>
                        <select name="categoryId" className="form-select" value={form.categoryId} onChange={onChange} required>
                            <option>Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Unit</label>
                        <select name="unitId" className="form-select" value={form.unitId} onChange={onChange} required>
                            <option>Select Unit</option>
                            {units.map(unit => (
                                <option key={unit.id} value={unit.id}>{unit.name}</option>
                            ))}
                        </select>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCancel}>
                        Cancel
                    </CButton>
                    <CButton color="primary" type="submit" disabled={loading}>
                        {loading ? "Save..." : "Save"}
                    </CButton>
                </CModalFooter>
            </form>
        </CModal>
    )
}

export default ProductModal;