import React, {useState, useEffect} from "react";
import { CButton } from "@coreui/react";
import SupplierModal from "../components/SupplierModal";
import {getSuppliers, createSupplier, updateSupplier, deleteSupplier} from '../api/api';
import { useAuth } from "../contexts/AuthContext";

const Supplier = () => {
    const [suppliers,setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);
    const [currentPage,setCurrentPage] = useState(1);
    const [pagination,setPagination] = useState({totalData: 0, totalPage: 1, limit: 5});
    const [selectedData, setSelectedData] = useState(null);
    const [search,setSearch] = useState("");
    const [visible,setVisible] = useState(false);

    const {user} = useAuth();
    const load = async(page = 1, keyword = "") => {
        setLoading(true);
        setError(null);
        try{
            const data = await getSuppliers({page, limit: pagination.limit, search: keyword});
            setSuppliers(Array.isArray(data) ? data : data.data);
            setPagination(data.pagination)
        }catch(error){
            setError(error.response?.data?.message || "Failed to load suppliers!");
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        load(currentPage, search)
    },[currentPage, search]);
    const handleDelete = async(id) => {
        setLoading(true);
        setError(null);
        try{
            await deleteSupplier(id);
            await load();
        }catch(error){
            setError(error.response?.data?.message || "Failed to delete!");
        }finally{
            setLoading(false);
        }
    }
    const handleSave = async(data) => {
        if(data.id){
            await updateSupplier(data.id, data);
        }else{
            await createSupplier(data);
        }
        await load();
        setVisible(false);
        setSelectedData(null);
    }
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    }
    const handleEdit = (item) => {
        setSelectedData(item);
        setVisible(true);
    }
    const startItems = (currentPage - 1) * pagination.limit + 1;
    const endItems = Math.min(currentPage * pagination.limit, pagination.totalData);
    return(
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Suppliers</h3>
                <CButton color="primary" onClick={() => setVisible(true)}>
                    + Add Supplier
                </CButton>
            </div>
            <p>Logged in as <strong>{user?.name || user?.roles}</strong></p>
            <div className="mb-3">
                {error && <div className="alert alert-danger">{error}</div>}
                <SupplierModal 
                visible={visible}
                setVisible={setVisible}
                onSubmit={handleSave}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                />
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <label className="form-label">Search Supplier</label>
                    <input 
                    name="supplier"
                    type="text" 
                    onChange={handleSearch}
                    className="form-control"
                    placeholder="Search supplier..."/>
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="card-title">List Suppliers</div>
                    {loading ? <div>Loading...</div> : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suppliers.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center">No data found</td>
                                        </tr>
                                    )}
                                    {suppliers.map((supplier,idx) => (
                                        <tr key={supplier.id}>
                                            <td>{idx + 1 + (currentPage - 1) * pagination.limit}</td>
                                            <td>{supplier.name}</td>
                                            <td>{supplier.address}</td>
                                            <td>
                                                <CButton className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(supplier)}>Edit</CButton>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(supplier.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={6} className="px-3 py-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span>{`Show ${startItems} to ${endItems} of ${pagination.totalData} entries`}</span>
                                                <div className="d-flex gap-2 mt-3">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary" 
                                                        onClick={() => setCurrentPage(prev => prev -1)}
                                                        >
                                                            Prev
                                                    </button>
                                                    {Array.from({length: pagination.totalPage}, (_,i) => (
                                                        <button 
                                                        key={i+1}
                                                        className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary": "btn-outline-primary"}`}
                                                        onClick={() => setCurrentPage(i + 1)}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    ))}
                                                    <button
                                                        className="btn btn-sm btn-outline-primary" 
                                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                                        >
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

export default Supplier;
