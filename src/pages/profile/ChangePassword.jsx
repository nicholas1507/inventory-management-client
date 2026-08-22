import React,{useState} from "react";
import {updateMyUser} from '../../api/api';
import {useNavigate} from 'react-router-dom';

export default function ChangePassword(){
    const [form, setForm] = useState({
        password: "", confirmPassword: "", prevPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);
        setError(null);
        if(!form.prevPassword.trim()){
            setError(`Previous password can't be empty!`);
        }
        if(!form.password.trim() && !form.confirmPassword.trim()){
            setError(`New password can't be empty!`);
        }
        try{
            await updateMyUser(form);
            alert("Password changed succesfully!");
            navigate('/profile');
        }catch(err){
            setError(err.response?.data?.message || `Failed to change Password!`);
        }
        setLoading(false);
    }
    function onChange(e){
        setForm({...form, [e.target.name]: e.target.value});
    }
    function cancel(){
        setForm({password: "", confirmPassword: "", prevPassword: ""});
        navigate('/profile');
    }
    return(
        <>
            <div className="container d-flex justify-content-center align-items-center bg-light"
            style={{minHeight: "100vh"}}>
                <div className="card shadow border-0 p-4" style={{width: "400px", borderRadius: "16px"}}>
                    <h4 className="fw-bold text-center mb-4">Change Password</h4>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label small">Old Password</label>
                            <input 
                            type="password"
                            name="prevPassword" 
                            onChange={onChange}
                            className="form-control" 
                            required/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label small">New Password</label>
                            <input 
                            type="password"
                            name="password"
                            onChange={onChange}
                            className="form-control"
                            required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small">Confirm New Password</label>
                            <input 
                            type="password"
                            name="confirmPassword"
                            onChange={onChange}
                            className="form-control"
                            required />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-dark rounded-pill">Update Password</button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary rounded-pill"
                                onClick={cancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </>
    )
}