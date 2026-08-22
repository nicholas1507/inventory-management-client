import React, { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, getUnits } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import {
    CButton
} from '@coreui/react';
import ProductModal from "../components/ProductModal";

export default function ProductAdmin() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ totalPage: 1, totalData: 0, limit: 10 });
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [visible, setVisible] = useState(false);
    const [units, setUnits] = useState([]);

    async function load(page = 1, keyword = "") {
        setLoading(true);
        setError(null);
        try {
            const data = await getProducts({ page, limit: pagination.limit, search: keyword });
            setItems(Array.isArray(data) ? data : data.data);
            setPagination(Array.isArray(data) ? data : data.pagination || { totalPage: 1, totalData: 0, limit: 10 });
        } catch (err) {
            setError(err.response?.data?.message || "Products not found!");
        }
        setLoading(false);
    }

    async function loadCategories() {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(Array.isArray(data) ? data : data.data);
        } catch (err) {
            console.warn("Failed to load categories", err);
        }finally{
            setLoading(false);
        }
    }

    async function loadUnits(){
        try{
            const data = await getUnits();
            setUnits(Array.isArray(data) ? data : data.data);
        }catch(err){
            console.warn("Failed to load units", err);
        }
    }
    useEffect(() => {
        load(currentPage, search);
        loadCategories();
        loadUnits();
    }, [currentPage, search]);
    function handleSearch(e) {
        setSearch(e.target.value);
        setCurrentPage(1);
    }
    const startItems = (currentPage - 1) * pagination.limit + 1
    const endItems = Math.min(currentPage * pagination.limit, pagination.totalData);
    function startEdit(item) {
        setSelectedData(item);
        setVisible(true);
    }
    // function cancelEdit() {
    //     setEditingId(null);
    //     setForm({ name: "", stock: "", price: "", categoryId: "" });
    // }

    // async function onSubmit(e) {
    //     e.preventDefault()
    //     setError(null);
    //     if (!form.name.trim()) {
    //         setError("Name cant be empty!");
    //         return;
    //     }
    //     if (!form.categoryId) {
    //         setError("Chose the category for the product!");
    //         return;
    //     }
    //     setSaving(true);
    //     try {
    //         const payload = { ...form, stock: parseInt(form.stock), price: parseInt(form.price), category: form.categoryId }
    //         if (editingId) {
    //             await updateProduct(editingId, payload)
    //         } else {
    //             await createProduct(payload);
    //         }
    //         await load();
    //         cancelEdit();
    //     } catch (err) {
    //         setError(err.response?.data?.message || "Gagal menyimpan product");
    //     } finally {
    //         setSaving(false);
    //     }
    // }

    const handleSaveProduct = async(data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('minimumStock', Number(data.minimumStock));
        formData.append('description', data.description);
        formData.append('price', Number(data.price));
        formData.append('productCode', data.productCode);
        formData.append('unitId', Number(data.unitId));
        formData.append('categoryId', Number(data.categoryId));
        if(data.file) formData.append('image', data.file);

        if(data.id){
            await updateProduct(data.id, formData);
        }else{
            await createProduct(formData);
        }
        await load();
        setVisible(false);
        setSelectedData(null);
    }

    async function handleDelete(id) {
        if (!window.confirm("Hapus produk ini ?")) return;
        try {
            await deleteProduct(id);
            await load();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete product!");
        }
    }
    function renderCategoryName(it) {
        if (!it) return "-";
        if (it.category?.name) return it.category.name;
        const categoryId = it.category?.id || it.category?._id || it.category || it.categoryId;
        const find = categories.find(c => c.id === categoryId || c._id === categoryId);
        return find ? find.name : "-";
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Products</h3>
                <CButton color="primary" onClick={() => setVisible(true)}>
                    + Add Product
                </CButton>
            </div>
            <p>Logged in as <strong>{user?.roles || user?.name}</strong></p>
            <div className="mb-3">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <ProductModal 
                    visible={visible}
                    setVisible={setVisible}
                    onSubmit={handleSaveProduct}
                    categories={categories}
                    units={units}
                    selectedData={selectedData}
                    setSelectedData={setSelectedData}
                    />
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <label className="form-label">Search Product</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search product..."
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <h5>List Products</h5>
                    {loading ? <div>loading...</div> : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Image</th>
                                        <th>Product Code</th>
                                        <th>Name</th>
                                        <th>Stock</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center">No data found</td>
                                        </tr>
                                    )}
                                    {items.map((item, idx) => (
                                        <tr key={item.id}>
                                            <td>{idx + 1}</td>
                                            <td>{
                                                <img 
                                                src={item.imageURL}
                                                alt="product-image"
                                                width={175}
                                                height={175}
                                                />
                                                }</td>
                                            <td>{item.productCode}</td>
                                            <td>{item.name}</td>
                                            <td>{item.stock}</td>
                                            <td>
                                                <CButton className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(item)}>Edit</CButton>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id || item._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={6} className="px-3 py-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span>{`Showing ${startItems} to ${endItems} of ${pagination.totalData} entries`}</span>
                                                <div className="d-flex gap-2 mt-3">
                                                    <button 
                                                    className="btn btn-sm btn-outline-primary"
                                                    disabled={currentPage === 1}
                                                    onClick={() => setCurrentPage(prev => prev - 1)}>
                                                        Prev
                                                    </button>
                                                    {Array.from({length: pagination.totalPage}, (_,i) => (
                                                        <button 
                                                        key={i}
                                                        className={`btn btn-sm ${currentPage === (i+1) ? `btn-primary` : `btn-outline-primary`}`}
                                                        onClick={() => setCurrentPage(i + 1)}>
                                                            {i + 1}
                                                        </button>
                                                    ))}
                                                    <button 
                                                    className="btn btn-sm btn-outline-primary"
                                                    disabled={currentPage === pagination.totalPage}
                                                    onClick={() => setCurrentPage(prev => prev + 1)}>
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}