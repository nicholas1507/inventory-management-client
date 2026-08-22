import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { CButton } from "@coreui/react";
import OutboundModal from "../../components/movements/OutboundModal";
import { getMovements, createMovement, getProducts, getCustomers } from '../../api/api';

const Outbound = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [visible, setVisible] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ totalData: 0, totalPage: 1, limit: 10 });
    const [movements, setMovements] = useState([]);
    const [search, setSearch] = useState("");
    const { user } = useAuth();

    const loadMovements = async (page = 1, keyword = "") => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMovements({ page, limit: pagination.limit, search: keyword, type: "OUT" });
            setMovements(Array.isArray(data) ? data : data.data);
            setPagination(data.pagination);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to load movements!");
        } finally {
            setLoading(false);
        }
    }
    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const [products, customers] = await Promise.all([
                getProducts(),
                getCustomers()
            ])
            setProducts(Array.isArray(products) ? products : products.data);
            setCustomers(Array.isArray(customers) ? customers : customers.data);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to load products!");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        load();
    }, [])
    useEffect(() => {
        loadMovements(currentPage, search);
    }, [currentPage, search]);
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    }
    const handleSubmit = async (payload) => {
        await createMovement(payload);
        await loadMovements();
    }
    const startItems = (currentPage - 1) * pagination.limit + 1;
    const endItems = Math.min(currentPage * pagination.limit, pagination.totalData);
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Outbound Products</h3>
                <CButton
                    color="primary"
                    onClick={() => setVisible(true)}
                >
                    + Add Outbound
                </CButton>
            </div>
            <p>Logged in as <strong>{user?.name || user?.roles}</strong></p>
            <div className="mb-3">
                {error && <div className="alert alert-danger">{error}</div>}
                <OutboundModal
                    visible={visible}
                    setVisible={setVisible}
                    onSubmit={handleSubmit}
                    products={products}
                    customers={customers} />
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <label className="form-label">Search Movement</label>
                    <input
                        name="search"
                        type="text"
                        onChange={handleSearch}
                        className="form-control"
                        placeholder="search movement..." />
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="card-title">List Movements</div>
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
                                    {movements.map((mv, idx) => (
                                        <tr key={mv.id}>
                                            <td>{idx + 1 + (currentPage - 1) * pagination.limit}</td>
                                            <td>{mv.referenceCode}</td>
                                            <td>{new Date(mv.createdAt).toLocaleDateString('en-GB')}</td>
                                            <td>{mv.product.name}</td>
                                            <td>{mv.quantity}</td>
                                            <td>{mv.customer.name}</td>
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
                                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        Prev
                                                    </button>
                                                    {Array.from({ length: pagination.totalPage }, (_, i) => (
                                                        <button
                                                            key={i + 1}
                                                            className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"}`}
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

export default Outbound;