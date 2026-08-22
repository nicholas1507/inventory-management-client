import React, { useState, useEffect } from "react";
import { getProducts } from "../api/api";
import { useAuth } from "../contexts/AuthContext";

export default function Products() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({totalPage: 1, totalData: 0, limit: 10});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  async function load(page = 1, keyword= "") {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts({page, limit: pagination.limit, search: keyword});
      setItems(Array.isArray(data) ? data : data.data || []);
      setPagination(Array.isArray(data) ? data : data.pagination || {totalPage: 1, totalData: 0, limit: 10});
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat product");
    }
    setLoading(false);
  }
  useEffect(() => {
    load(currentPage, search);
  }, [currentPage, search]);

  async function handleSearch(e){
    setSearch(e.target.value);
    setCurrentPage(1);
  }

  const startItems = (currentPage - 1) * pagination.limit + 1;
  const endItems = Math.min(currentPage * pagination.limit, pagination.totalData)
  return (
    <div>
      <h3>Products</h3>
      <p>
        Logged in as : <strong>{user?.roles || user?.name}</strong>
      </p>
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
          <h5 className="card-title">Product List</h5>
          {loading && <div>Loading.....</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!error && !loading && (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Image</th>
                    <th>Product Code</th>
                    <th>Name</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center">
                        No products found
                      </td>
                    </tr>
                  )}
                  {items.map((it, idx) => (
                    <tr key={it.id || it._id}>
                      <td>{idx + 1 + (currentPage-1) * pagination.limit}</td>
                      <td>{
                        <img src={it.imageURL}
                        width={175}
                        height={175}  />
                        }</td>
                      <td>{it.productCode}</td>
                      <td>{it.name}</td>
                      <td>{it.stock}</td>
                      <td>
                        {it.stock === 0 ? (
                          <span className="badge bg-danger">Out of stock</span>
                        ) : it.stock < it.minimumStock ? (
                          <span className="badge bg-warning text-dark">
                            Low Stock
                          </span>
                        ) : (
                          <span className="badge bg-success">Available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={6} className="px-3 py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span>
                          {`Showing ${startItems} to ${endItems} of ${pagination.totalData} entries`}
                        </span>
                        <div className="d-flex gap-2 mt-3">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                          >
                            Prev
                          </button>
                          {Array.from({length: pagination.totalPage}, (_,i) => (
                            <button key={i}
                            className= {`btn btn-sm ${currentPage === (i+1) ? `btn-primary` : `btn-outline-dark`}`}
                            onClick={() => setCurrentPage(i +1)}>
                              {i+1}
                            </button>
                          ))}
                          <button 
                          className="btn btn-outline-primary btn-sm"
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
  );
}
