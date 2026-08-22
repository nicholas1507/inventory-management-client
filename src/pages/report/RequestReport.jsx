import React,{useState, useEffect} from "react";
import {getMovementsRequest} from '../../api/api';
import { useAuth } from "../../contexts/AuthContext";
import MovementPDF from "./MovementPDF";
import {PDFViewer} from '@react-pdf/renderer';

const OutboundReport = () => {
    const [movements, setMovements] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search,setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination,setPagination] = useState({totalData: 0, totalPage: 1, limit: 10});
    const [appliedFilter,setAppliedFilter] = useState({
        startDate: "", endDate: ""
    });
    const [fromDate,setFromDate] = useState("");
    const [toDate,setToDate] = useState("");
    const [showModal,setShowModal] = useState(false);
    const {user} = useAuth();

    const load = async(page = 1, keyword = "", start = "", end = "") => {
        setLoading(true);
        setError(null);
        try{
            const data = await getMovementsRequest({page, limit: pagination.limit, search: keyword, type: "OUT", startDate: start, endDate: end});
            setMovements(Array.isArray(data) ? data : data.data);
            setPagination(data.pagination);
        }catch(error){
            setError(error.response?.data?.message || "Failed to load movements");
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        load(currentPage,search,appliedFilter.startDate,appliedFilter.endDate);
    },[currentPage,search,appliedFilter]);
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    }
    const resetDate = () => {
        setAppliedFilter({
            startDate: "",endDate: ""
        });
        setSearch("");
        setFromDate("");
        setToDate("");
        setCurrentPage(1);
    }
    const handleFilter = () => {
        setAppliedFilter({
            startDate: fromDate,endDate: toDate
        })
    }
    const startItems = (currentPage - 1) * pagination.limit + 1;
    const endItems = Math.min(currentPage * pagination.limit, pagination.totalData);
    return(
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Outbound Request Report</h3>
                <button 
                    className="btn btn-outline-danger" 
                    onClick={() => setShowModal(true)}
                    disabled={movements.length === 0}
                >
                    <i className="bi bi-file-earmark-pdf me-2"></i> Print PDF
                </button>
            </div>
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content" style={{ height: '90vh' }}>
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">Laporan Preview</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-0">
                                {/* PDFViewer akan merender dokumen di sini */}
                                <PDFViewer width="100%" height="100%" showToolbar={true} style={{ border: 'none' }}>
                                    <MovementPDF 
                                        data={movements} 
                                        user={user} 
                                        filters={appliedFilter} 
                                        type={"OUT"}
                                        outbound={"User"}
                                    />
                                </PDFViewer>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Tutup</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <p>Logged in as <strong>{user?.name || user?.roles}</strong></p>
            <div className="mb-3">
                <label className="form-label fw-semibold small text-uppercase text-muted">
                    Date Filter
                </label>
                <div className="d-flex gap-2 mb-4">
                    <input 
                    type="date"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)} />
                    <input 
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)} />
                    <button className="btn btn-sm btn-primary" onClick={handleFilter}>Filter</button>
                    <button className="btn btn-sm btn-outline-primary" onClick={resetDate}>Reset</button>
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <label className="form-label">Search</label>
                    <input 
                    name="search"
                    type="text" 
                    onChange={handleSearch}
                    className="form-control"
                    placeholder="Search Reference Code"/>
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="card-title">List Outbound Report</div>
                    {loading ? <div>Loading...</div> : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Reference Code</th>
                                        <th>Release Date</th>
                                        <th>Product Name</th>
                                        <th>Stock Out</th>
                                        <th>Customer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movements.length === 0 && (
                                        <tr>
                                           <td colSpan={6} className="text-center">No data found</td> 
                                        </tr>
                                    )}
                                    {movements.map((mvm,idx) => (
                                        <tr key={mvm.id}>
                                            <td>{idx + 1 + (currentPage - 1) * pagination.limit}</td>
                                            <td>{mvm.referenceCode}</td>
                                            <td>{new Date(mvm.createdAt).toLocaleDateString('en-GB')}</td>
                                            <td>{mvm.product.name}</td>
                                            <td>{mvm.quantity}</td>
                                            <td>{mvm.customer.name}</td>
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

export default OutboundReport;