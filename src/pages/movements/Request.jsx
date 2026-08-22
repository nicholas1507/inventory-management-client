import React, {useState, useEffect} from "react";
import { getRequests,createRequest,cancelRequest,getProducts,getCustomers,getRequestItems } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import { CButton } from "@coreui/react";
import RequestModal from '../../components/movements/RequestModal';
import { Eye } from "lucide-react";

const Request = () => {
    const [requests,setRequests] = useState([]);
    const [products,setProducts] = useState([]);
    const [customers,setCustomers] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);
    const [visible,setVisible] = useState(false);
    const [currentPage,setCurrentPage] = useState(1);
    const [pagination,setPagination] = useState({totalData: 0, totalPage: 1, limit: 10});
    const [search,setSearch] = useState("");
    const [selectedData,setSelectedData] = useState(null);
    const [showModal,setShowModal] = useState(false);
    const [action,setAction] = useState("");

    const {user} = useAuth();
    const loadRequests = async(page = 1, keyword = "",processed = "") => {
        setLoading(true);
        setError(null);
        try{
            const data = await getRequests({page, limit: pagination.limit, search: keyword, status: processed});
            setRequests(Array.isArray(data) ? data : data.data);
            setPagination(data.pagination);
        }catch(error){
            setError(error.response?.data?.message || "Failed to load requests!");
        }finally{
            setLoading(false);
        }
    }
    const load = async() => {
        setLoading(true);
        setError(null);
        try{
            const [products,customers] = await Promise.all([
                getProducts(),
                getCustomers()
            ]);
            setProducts(Array.isArray(products) ? products : products.data);
            setCustomers(Array.isArray(customers) ? customers : customers.data);
        }catch(error){
            setError(error.response?.data?.message || "Failed to load products and customers");
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        load();
    },[]);
    useEffect(() => {
        loadRequests(currentPage,search,action);
    },[currentPage,search,action]);
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    }
    const handleSave = async(payload) => {
        await createRequest(payload);
        await loadRequests(currentPage,search);
    }
    const handleCancel = async(request) => {
        try{
            await cancelRequest(request.id, request);
            await loadRequests(currentPage,search);
        }catch(error){
            setError(error.response?.data?.message || "Failed to cancel request!");
        }
    }
    const openDetail = async(id) => {
        try{
            const reqItems = await getRequestItems(id);
            setSelectedData(Array.isArray(reqItems) ? reqItems : reqItems.data);
            setShowModal(true);
        }catch(error){
            setError(error.response?.data?.message || "Failed to open detail!");
        }
    }
    const startItems = (currentPage - 1) * pagination.limit + 1;
    const endItems = Math.min(currentPage * pagination.limit, pagination.totalData);
    return(
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Request Product Out</h3>
                <CButton color="primary" onClick={() => setVisible(true)}>
                    + Add Request
                </CButton>
            </div>
            <p>Logged in as <strong>{user?.name || user?.roles}</strong></p>
            <div className="mb-3">
                {error && <div className="alert alert-danger">{error}</div>}
                <RequestModal 
                visible={visible}
                setVisible={setVisible}
                onSubmit={handleSave}
                products={products}
                customers={customers}
                />
            </div>
            <div className="mb-3">
                <label className="form-label fw-semibold small text-uppercase text-muted">
                    Filter Status
                </label>
                <select
                onChange={e => setAction(e.target.value)}
                className="form-select border-2"
                >
                    <option value="">All</option>
                    <option value={"APPROVED"}>Approved</option>
                    <option value={"REJECTED"}>Rejected</option>
                    <option value={"PENDING"}>Pending</option>
                </select>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <label className="form-label">Search</label>
                    <input 
                    type="text"
                    onChange={handleSearch}
                    className="form-control"
                    placeholder="Search..." />
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="card-title">Requests Products Out</div>
                    {loading ? <div>Loading...</div> : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Requested By</th>
                                        <th>Customer</th>
                                        <th>ProcessedBy</th>
                                        <th>ProcessedAt</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center">No data found</td>
                                        </tr>
                                    )}
                                    {requests.map((req,idx) => (
                                        <tr key={req.id}>
                                            <td>{(currentPage - 1) * pagination.limit + 1 + idx}</td>
                                            <td>{req.creator.name}</td>
                                            <td>{req.customers?.name}</td>
                                            <td>{req.processor?.name || "-"}</td>
                                            <td>{req.processedAt || "-"}</td>
                                            <td className="align-middle">
                                                                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                                                        {req.status}
                                                    </span>

                                                    <button
                                                        onClick={() => openDetail(req.id)}
                                                        className="btn p-0 border-0 text-primary d-flex align-items-center"
                                                        title="See Detail"
                                                    >
                                                        <Eye size={18} strokeWidth={2.5} />
                                                    </button>
                                                </div>
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
            {showModal && selectedData && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow" style={{ borderRadius: '15px' }}>
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold text-dark">Detail Stock Request</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">

                                <div className="table-responsive border rounded" style={{ maxHeight: '300px' }}>
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr style={{ fontSize: '0.85rem' }}>
                                                <th>Product Name</th>
                                                <th className="text-center">Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedData?.map((item, i) => (
                                                <tr key={i}>
                                                    <td>{item.product?.name}</td>
                                                    <td className="text-center fw-bold text-primary">{item.quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer border-top-0 pt-0">
                                <button className="btn btn-light" onClick={() => setShowModal(false)} style={{ borderRadius: '8px' }}>Tutup</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


export default Request;