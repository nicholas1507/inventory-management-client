import React, {useState} from "react";
import { register } from '../api/api';
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password : "",
        confirm_password: "",
    });
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(" ");

    function onChange(e) {
        setForm({...form, [e.target.name]: e.target.value});
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError(null);
        if(form.password !== form.confirm_password){
            setError({error: `Password don't match!`});
            return;
        }
        setLoading(true);
        try{
            const result = await register(form);
            if(result) {
                setSuccess("Register berhasil!");
            }else{
                setError("Register gagal!")
            }
            setLoading(false);
            navigate("/login");
            return {success: true}
        }catch(err){
            setError(err.response?.data?.message || "Registration failed");
            return {success: false}
        }finally{
            setLoading(false);
        }
    }
    return(
        <>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="mb-4">Register</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input 
                            name="name"
                            type="text"
                            className="form-control"
                            onChange={onChange}
                            value={form.name}
                            required                             
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input 
                            name="email"
                            type="text"
                            className="form-control"
                            onChange={onChange}
                            value={form.email}
                            required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input 
                            name="password"
                            type="password"
                            className="form-control"
                            onChange={onChange}
                            value={form.password}
                            required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirmation Password</label>
                            <input 
                            name="confirm_password"
                            type="password"
                            className="form-control"
                            onChange={onChange}
                            value={form.confirm_password}
                            required 
                            />
                        </div>
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary">Register</button>
                        </div>
                        {success && <p className="text-center" style={{color: "green"}}>{success}</p>}
                    </form>
                </div>
            </div>
        </>
    )
}