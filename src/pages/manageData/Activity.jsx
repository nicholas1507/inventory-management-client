import React, { useEffect, useState } from "react";
import { userActivity } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

const Activity = () => {
  const [activities, setActivities] = useState({
    movements: [],
    requests: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search,setSearch] = useState("");
  const [currentPage,setCurrentPage] = useState(1);
  const [pagination,setPagination] = useState({totalData: 0,totalPage: 1, limit: 10});

  const { user } = useAuth();

  const load = async (page = 1, keyword = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await userActivity({page, limit: pagination.limit, search: keyword});
      setActivities(data.data);
      setPagination(data.pagination)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(currentPage,search);
  }, [currentPage,search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  }
  const startItems = (currentPage - 1) * pagination.limit + 1;
  const endItems = Math.min(currentPage * pagination.limit, pagination.totalData);
  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">User Activity</h3>
      </div>

      <p>
        Logged in as <strong>{user?.name || user?.roles}</strong>
      </p>
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <label className="form-label">Search</label>
        <input 
        type="text"
        onChange={handleSearch}
        className="form-control"
        placeholder="search..." />
      </div>
    </div>
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <h5 className="mb-3">Activity Details</h5>
          <hr />

          {loading ? (
            <div className="text-center py-3">Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light text-center">
                  <tr>
                    <th style={{ width: "5%" }}>No</th>
                    <th>User</th>
                    <th>Request</th>
                    <th>Movement</th>
                    <th>Description</th>
                    <th>Created At</th>
                  </tr>
                </thead>

                <tbody>
                  {/* 🔹 MOVEMENTS */}
                  {activities.movements.map((mv, idx) => (
                    <tr key={`mv-${mv.id}`}>
                      <td className="text-center">{startItems + idx }</td>

                      <td>{mv.user?.name || "-"}</td>

                      <td className="text-muted text-center">-</td>

                      <td>
                        <div className="small">
                          <div><strong>{mv.product?.name || "-"}</strong></div>
                          <div>User: {mv.user?.name}</div>
                          <div>Qty: {mv.quantity}</div>
                          <div>Supplier: {mv.supplier?.name || "-"}</div>
                          <div>Customer: {mv.customer?.name || "-"}</div>
                          <div>Stock: {mv.stockBefore} → {mv.stockAfter}</div>
                          <div className="text-muted">{mv.referenceCode}</div>
                        </div>
                      </td>

                      <td>
                        <span className="badge bg-primary">
                          {mv.requestId
                            ? `Request Approved (${mv.type})`
                            : `Direct Movement (${mv.type})`}
                        </span>
                      </td>

                      <td className="small text-muted">
                        {new Date(mv.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}

                  {/* 🔹 REQUESTS */}
                  {activities.requests.map((req, idx) => (
                    <tr key={`req-${req.id}`}>
                      <td className="text-center">
                        {startItems + idx + activities.movements.length }
                      </td>

                      <td>{req.creator?.name}</td>

                      <td>
                        <div className="small">
                          {req.requestItems.map((item, i) => (
                            <div key={item.id} className="mb-2">
                              <strong>Item {i + 1}</strong>
                              <div>{item.product.name}</div>
                              <div>Qty: {item.quantity}</div>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="text-muted text-center">-</td>

                      <td>
                        <span
                          className={`badge ${
                            req.status === "Approved"
                              ? "bg-success"
                              : req.status === "Rejected"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>

                      <td className="small text-muted">
                        {new Date(req.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}

                  {/* 🔹 EMPTY STATE */}
                  {activities.movements.length === 0 &&
                    activities.requests.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-3">
                          No activity found
                        </td>
                      </tr>
                    )}
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
  );
};

export default Activity;