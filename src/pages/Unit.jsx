import React,{useState, useEffect} from "react";
import {getUnits,createUnit,updateUnit,deleteUnit} from '../api/api';
import { CButton } from "@coreui/react";
import { useAuth } from "../contexts/AuthContext";
import UnitModal from "../components/UnitModal";

export default function Unit(){
    const [items,setItems] = useState([]);
    const [visible,setVisible] = useState(false);
    const [selectedData,setSelectedData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination,setPagination] = useState({totalData: 0, totalPage: 1, limit: 5});
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(false);
    const [search,setSearch] = useState("");
    const {user} = useAuth();

    const load = async(page = 1,keyword="") => {
        setLoading(true);
        try{
            const data = await getUnits({page, limit: pagination.limit, search: keyword});
            setItems(Array.isArray(data) ? data: data.data);
            setPagination(data.pagination);
        }catch(error){
            setError(error.response?.data?.message || "Failed to load units!");
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        load(currentPage,search);
    },[currentPage,search]);
    const handleDelete = async(id) => {
        setLoading(true);
        if(!window.confirm("Yakin hapus unit?")) return;
        try{
            await handleDelete(id);
            await load();
        }catch(error){
            setError(error.response?.data?.message || "Failed to delete!");
        }finally{
            setLoading(false);
        }
    }
    const handleEdit = async(item) => {
        setSelectedData(item);
        setVisible(true);
    }
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    }
    const handleSave = async(data) => {
        if(data.id){
            await updateUnit(data.id, data);
        }else{
            await createUnit(data);
        }
        await load();
        setVisible(false);
        setSelectedData(null);
    }
    const startItems = (currentPage - 1) * pagination.limit + 1;
    const endItems = Math.min((currentPage*pagination.limit), pagination.totalData);
    return(
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Unit</h3>
                <CButton color="primary" onClick={() => setVisible(true)}>
                    + Add Unit
                </CButton>
            </div>
            <p>Logged in as <strong>{user?.name || user?.roles}</strong></p>
            <div className="mb-3">
                {error && <div className="alert alert-danger">{error}</div>}
                <UnitModal 
                visible={visible}
                setVisible={setVisible}
                onSubmit={handleSave}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                />
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <label className="form-label">Search Unit</label>
                    <input 
                    name="search"
                    type="text" 
                    onChange={handleSearch}
                    className="form-control"
                    placeholder="Search unit..."/>
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="card-title">List Units</div>
                    {loading ? <div>Loading...</div> : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Name</th>
                                        <th>Abbreviation</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center">No data Found!</td>
                                        </tr>
                                    )}
                                    {items.map((item,idx) => (
                                        <tr key={item.id}>
                                            <td>{(currentPage - 1 ) * pagination.limit + 1 + idx}</td>
                                            <td>{item.name}</td>
                                            <td>{item.abbreviation}</td>
                                            <td>
                                                <CButton onClick={() => handleEdit(item)} className="btn btn-sm btn-outline-primary me-2">Edit</CButton>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>Delete</button>
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