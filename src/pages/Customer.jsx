import React,{useState, useEffect} from "react";
import { CButton } from "@coreui/react";
import { useAuth } from "../contexts/AuthContext";
import {getCustomers, createCustomer, updateCustomer, deleteCustomer} from '../api/api';
import CustomerModal from "../components/CustomerModal";

const Customer = () => {
    const [customers,setCustomers] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination,setPagination] = useState({totalData: 0, totalPage: 1, limit: 5});
    const [search,setSearch] = useState("");
    const [visible,setVisible] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const {user} = useAuth();
    const load = async(page = 1, keyword = "") => {
        setLoading(true);
        setError(null);
        try{
            const data = await getCustomers({page, limit: pagination.limit, search: keyword});
            setCustomers(Array.isArray(data) ? data : data.data);
            setPagination(data.pagination);
        }catch(error){
            setError(error.response?.data?.message || "Failed to load customers!");
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        load(currentPage,search);
    },[currentPage, search]);

    const handleDelete = async(id) => {
        setLoading(true);
        setError(null);
        try{
            await deleteCustomer(id);
            await load();
        }catch(error){
            setError(error.response?.data?.message || "Failed to delete!");
        }finally{
            setLoading(false);
        }
    }
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    }
    const handleSave = async(data) => {
        if(data.id){
            await updateCustomer(data.id,data);
        }else{
            await createCustomer(data);
        }
        await load();
        setVisible(false);
        setSelectedData(null);
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
                <h3>Customers</h3>
                <CButton color="primary" onClick={() => setVisible(true)}>
                    + Add Customer
                </CButton>
            </div>
            <p>Logged in as <strong>{user?.name || user?.roles}</strong></p>
            <div className="mb-3">
                {error && <div className="alert alert-danger">{error}</div>}
                <CustomerModal 
                visible={visible}
                setVisible={setVisible}
                onSubmit={handleSave}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                />
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <label className="form-label">Search Customer</label>
                    <input 
                    name="customer"
                    type="text" 
                    onChange={handleSearch}
                    className="form-control"
                    placeholder="Search customer..."/>
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="card-title">List Customers</div>
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
                                    {customers.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center">No data found</td>
                                        </tr>
                                    )}
                                    {customers.map((customer,idx) => (
                                        <tr key={customer.id}>
                                            <td>{idx + 1 + (currentPage - 1) * pagination.limit}</td>
                                            <td>{customer.name}</td>
                                            <td>{customer.address}</td>
                                            <td>
                                                <CButton className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(customer)}>Edit</CButton>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(customer.id)}>Delete</button>
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
                                                        disabled={currentPage === 1}
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
                                                        disabled={currentPage === pagination.totalPage}
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

export default Customer;