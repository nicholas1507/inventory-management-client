import React, { use, useEffect, useState } from "react";
import { getMyProfile } from '../../api/api';
import { dataUser } from '../../api/api';
import { useAuth } from "../../contexts/AuthContext";
import { Link, Outlet } from "react-router-dom";

export default function Profil() {
  const { user } = useAuth();
  const [profile, setProfile] = useState([]);
  const [data, setdata] = useState([]);

  async function getProfile() {
    const res = await getMyProfile();
    setProfile(res);
  }
  async function load() {
    const result = await dataUser();
    setdata(result);
  }
  useEffect(() => {
    getProfile();
    load();
  }, []);
  return (
    <>
      <div className="container d-flex justify-content-center align-items-center bg-light" style={{ minHeight: "100vh" }}>
        <div className="card shadow border-0 text-center p-4" style={{ width: "360px", borderRadius: "16px" }}>

          <img
            src={profile.imageURL || 'https://dummyimage.com/150x150'}
            alt="Profile"
            className="rounded-circle mx-auto mb-3 shadow-sm"
            width="120"
            height="120"
            style={{ objectFit: "cover" }}
          />

          <h4 className="fw-bold mb-0">{data.name}</h4>
          <p className="text-muted small mb-3">{data.email}</p>

          <hr />

          <div className="text-start small">
            <p className="mb-1"><strong>Role:</strong> {user.roles}</p>
            <p className="mb-1"><strong>Address:</strong> {profile.address}</p>
            <p className="mb-2"><strong>Bio:</strong> {profile.bio}</p>
          </div>

          <div className="d-grid gap-2 mt-3">
            <Link to={'/profile/edit'} className="btn btn-dark rounded-pill">Edit Profile</Link>
            <Link to={'/profile/change-password'} className="btn btn-outline-dark rounded-pill">Change Password</Link>
          </div>

        </div>
      </div>
    </>
  )
}