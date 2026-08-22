import React, { useState, useEffect } from "react";
import { updateMyProfile, getMyProfile,createProfile, updateMyUser, dataUser } from '../../api/api';
import { useNavigate } from "react-router-dom";

export default function EditProfil() {
    const [profile, setProfile] = useState([]);
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [form, setForm] = useState({
        address: "", bio: "",file: null
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();
    async function getProfile() {
        setLoading(true);
        setError(null);
        try{
            const profil = await getMyProfile();
            setProfile(profil);
        }catch(err){
            setError(err.response?.data?.message || `Failed to get profile!`);
        }
        setLoading(false);
    }
    async function getData() {
        setLoading(true);
        setError(null);
        try{
            const result = await dataUser();
            setData(result);    
        }catch(err){
            setError(err.response?.data?.message || `Failed to get user data!`);
        }
        setLoading(false);
    }
    useEffect(() => {
        getProfile();
        getData();
    }, []);
    useEffect(() => {
        if(profile){
            setForm({address: profile.address || "", bio: profile.bio || "", file: null});
        }
        if(data){
            setName(data.name || "");
        }
    },[profile,data])
    async function handleSubmit(e){
        e.preventDefault();
        setError(null);
        setSaving(true);
        try{
            const formData = new FormData();
            formData.append('address',form.address);
            formData.append('bio', form.bio);
            if(form.file) formData.append('image', form.file);
            if(profile.address || profile.bio || profile.imageURL){
                await updateMyProfile(formData);
            }else{
                await createProfile(formData);
            }
            const result2 = await updateMyUser({name: name});
            await getProfile();
            await getData();
            if(result2){
                navigate('/profile')
            }
        }catch(err){
            setError(err.response?.data?.message || `Failed to update profile!`);
        }finally{
            setSaving(false);
        }
    }
    async function onChange(e){
        setForm({...form, [e.target.name]: e.target.value});
    }
    function handleImage(e){
        const imageFile = e.target.files[0];
        setForm({...form, file: imageFile});
        if(preview){
            URL.revokeObjectURL(preview);
        }
        if(imageFile){
            setPreview(URL.createObjectURL(imageFile));
        }else{
            setPreview(null);
        }
    }
    function cancel(){
        setError(null);
        setForm({address: "", bio: "", file: null});
        navigate('/profile');
    }
    return (
        <>
            <div
                className="container d-flex justify-content-center align-items-center bg-light"
                style={{ minHeight: "100vh" }}
            >
                <div
                    className="card shadow border-0 p-4"
                    style={{ width: "400px", borderRadius: "16px" }}
                >
                    <h4 className="fw-bold text-center mb-4">Edit Profile</h4>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        {/* Profile Image */}
                        <div className="text-center mb-3" style={{ position: "relative" }}>
                            <img
                                src={preview ? preview : profile.imageURL ? profile.imageURL : "https://dummyimage.com/150x150"}
                                alt="Preview"
                                className="rounded-circle shadow-sm mb-2"
                                width="120"
                                height="120"
                                style={{ objectFit: "cover" }}
                            />
                            {/* Tombol edit/pensil */}
                            <label
                                htmlFor="imageInput"
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: "calc(50% - 60px)", 
                                    backgroundColor: "#f4efef",
                                    color: "#000",
                                    borderRadius: "50%",
                                    padding: "6px",
                                    cursor: "pointer",
                                    fontSize: "14px"
                                }}
                                title="Edit Profile Image"
                            >
                                ✏️
                            </label>

                            <input
                                type="file"
                                id="imageInput"
                                style={{ display: "none" }}
                                onChange={handleImage}
                            />
                        </div>

                        {/* Name */}
                        <div className="mb-3">
                            <label className="form-label small">Name</label>
                            <input
                                type="text"
                                name="name"
                                onChange={(e) => setName(e.target.value)}
                                className="form-control"
                                value={name}
                                required
                            />
                        </div>

                        {/* Address */}
                        <div className="mb-3">
                            <label className="form-label small">Address</label>
                            <input
                                type="text"
                                name="address"
                                className="form-control"
                                value={form.address}
                                onChange={onChange}
                            />
                        </div>

                        {/* Bio */}
                        <div className="mb-3">
                            <label className="form-label small">Bio</label>
                            <textarea
                                name="bio"
                                rows="3"
                                className="form-control"
                                value={form.bio}
                                onChange={onChange}
                            />
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-dark rounded-pill" disabled={saving}>
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
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
    );
}
