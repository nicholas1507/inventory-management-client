import React from "react";
import { Outlet } from "react-router-dom";

export default function ProfileLayout(){
    return(
        <>
            <main>
                <Outlet />
            </main>
        </>
    )
}