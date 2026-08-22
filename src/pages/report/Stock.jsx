import React,{useState, useEffect} from "react";
import {getProducts, getProductStock} from '../../api/api';
import { useAuth } from "../../contexts/AuthContext";
import {PDFViewer} from '@react-pdf/renderer';
import StockPDF from './StockPDF';

const Stock = () => {
    const [products,setProducts] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination,setPagination] = useState({totalData: 0, totalPage: 1, limit: 10});
    const [filter,setFilter] = useState("");
    const [showModal,setShowModal] = useState(false);

    const {user} = useAuth();
    const loadProducts = async(page = 1,keyword = "", type = "") => {
        setLoading(true);
        setError(null);
        try{
            const data = await getProductStock({page, limit: pagination.limit, search: keyword,filterType: type});
            setProducts(Array.isArray(data) ? data : data.data);
            setPagination(data.pagination);
        }catch(error){
            setError(error.response?.data?.message || "Failed to load products!");
        }finally{
            setLoading(false);
        }
    }   
    useEffect(() => {
        loadProducts(currentPage,search,filter);
    },[currentPage,search,filter]);
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    }
    const startItems = (currentPage - 1) * pagination.limit + 1;
    const endItems = Math.min(currentPage * pagination.limit, pagination.totalData);
    return(
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Stock</h3>
                <button 
                    className="btn btn-outline-danger" 
                    onClick={() => setShowModal(true)}
                    disabled={products.length === 0}
                >
                    <i className="bi bi-file-earmark-pdf me-2"></i> Print PDF
                </button>
            </div>
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content" style={{ height: '90vh' }}>
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">Stock Report Preview</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-0">
                                <PDFViewer width="100%" height="100%" showToolbar={true}>
                                    <StockPDF 
                                        data={products} 
                                        user={user} 
                                        filter={filter} 
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
                    Filter Status
                </label>
                <select
                onChange={e => setFilter(e.target.value)}
                className="form-select border-2"
                >
                    <option value="">All</option>
                    <option value={"EMPTY"}>Out Of Stock</option>
                    <option value={"LOW"}>Minimum Limit</option>
                </select>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <label className="form-label">Search Product</label>
                    <input 
                    type="text"
                    onChange={handleSearch}
                    className="form-control"
                    placeholder="search product..." />
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="card-title">List Products Stock</div>
                    {loading ? <div>Loading...</div> : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Product Code</th>
                                        <th>Product Name</th>
                                        <th>Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length === 0 && (
                                        <tr>
                                            <td className="text-center" colSpan={4}>No data found</td>
                                        </tr>
                                    )}
                                    {products.map((p,idx) => (
                                        <tr key={p.id}>
                                            <td>{idx + 1 + (currentPage-1) * pagination.limit}</td>
                                            <td>{p.productCode}</td>
                                            <td>{p.name}</td>
                                            <td>{p.stock}</td>                                     
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

export default Stock;