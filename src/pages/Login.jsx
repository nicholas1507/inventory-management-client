import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login(){
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    function onChange(e){
        setForm({...form, [e.target.name]: e.target.value});
    }
    async function onSubmit(e){
        e.preventDefault();
        setError(null);
        setLoading(true);
        const result = await login(form);
        setLoading(false);
        if(result.success){
            navigate("/dashboard");
        }else{
            setError(result.message || "Login Failed");
        }
    }

    return(
        <>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="mb-4">LOGIN</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input 
                            name="email"
                            type="email"
                            onChange={onChange}
                            value={form.email}
                            className="form-control"
                            required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input 
                            name="password"
                            type="password"
                            onChange={onChange}
                            value={form.password}
                            className="form-control"
                            required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">{loading? "Loading...." : "Login"}</button>
                    </form>
                </div>
            </div>
        </>
    )
}
