import React, {useState, useEffect} from "react";
import {getCategories, createCategory, updateCategory, deleteCategory} from '../api/api';
import { useAuth } from "../contexts/AuthContext";
import CategoryModal from "../components/CategoryModal";
import { CButton } from "@coreui/react";

export default function Categories(){
    const {user} = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({totalData: 0, totalPage: 1, limit: 5});
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedData, setSelectedData] = useState(null);
    const [search, setSearch] = useState("");
    const [visible, setVisible] = useState(false);
    async function load(page = 1, keyword = ""){
        setLoading(true);
        setError(null);
        try{
            const data = await getCategories({page, limit: pagination.limit, search: keyword});
            setCategories(Array.isArray(data) ? data : data.data || []);
            setPagination(Array.isArray(data) ? data : data.pagination)
        }catch(err){
            setError(err.response?.data?.message || "Failed to load categories!");
        }
        setLoading(false);
    }

    useEffect(() => {
        load(currentPage, search);
    },[currentPage, search])

    function startEdit(cats){
        setSelectedData(cats);
        setVisible(true);
    }
    // async function onSubmit(e){
    //     e.preventDefault();
    //     setSaving(true);
    //     if(!form.name.trim()){
    //         setError("Categories cant be empty!");
    //     }
    //     try{
    //         if(editingId){
    //             await updateCategory(editingId, form);
    //         }else{
    //             await createCategory(form);
    //         }
    //         await load();
    //         cancelEdit();
    //     }catch(err){    
    //         setError(err.response?.data?.message || "Failed to input categories!");
    //     }
    //     setSaving(false);
    // }
    const handleSave = async(data) => {
        if(data.id){
            await updateCategory(data.id, data);
        }else{
            await createCategory(data);
        }
        await load();
        setVisible(false);
        setSelectedData(null);
    }

    async function handleDelete(id){
        if(!window.confirm("Hapus category ini ?")) return ;
        try{
            await deleteCategory(id);
            await load();
        }catch(err){
            setError(err.response?.data?.message || "Failed to delete category!");
        }
    }
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    }
    const startItems = (currentPage - 1) * pagination.limit + 1;
    const endItems = Math.min(currentPage * pagination.limit, pagination.totalData);
    return(
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Categories</h3>
                <CButton color="primary" onClick={() => setVisible(true)}>
                    + Add Category
                </CButton>
            </div>
            <p>Logged in as <strong>{user?.roles || user?.name}</strong></p>
            <div className="mb-3">
                    <CategoryModal 
                    visible={visible}
                    setVisible={setVisible}
                    onSubmit={handleSave}
                    selectedData={selectedData}
                    setSelectedData={setSelectedData}
                    />
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <label className="form-label">Search Category</label>
                    <input 
                    name="search"
                    type="text" 
                    onChange={handleSearch}
                    className="form-control"
                    placeholder="Search category..."/>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">List Categories</h5>
                    {loading ? <div>Loading...</div> : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length === 0 && 
                                        <tr>
                                            <td colSpan={3} className="text-center">No categories Found</td>    
                                        </tr>}
                                    {categories.map((cat,idx) => (
                                        <tr key={cat.id || cat._id}>
                                            <td>{(currentPage - 1) * pagination.limit + idx + 1}</td>
                                            <td>{cat.name}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(cat)}>Edit</button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat.id || cat._id)}>Delete</button>
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