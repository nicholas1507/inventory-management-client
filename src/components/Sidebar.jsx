import React, {useState} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSidebar } from "../contexts/SidebarContext";
import { sidebarConfig } from "../configs/sidebarConfig";
import { hasAccess } from "../helper/helper";
import {
    CSidebar,CSidebarBrand,CSidebarNav,CNavItem,CNavTitle,CNavGroup
} from '@coreui/react'
import CIcon from '@coreui/icons-react';

const Sidebar = () => {
    const SIDEBAR_WIDTH = 250 //px
    const navigate = useNavigate();
    const {logout, user} = useAuth();
    const {visible} = useSidebar();
    const userRoles = user?.roles || [];
    
    async function handleLogout(){
        await logout();
        navigate("/login");
    }
    return(
        <>
            <CSidebar
            unfoldable={false}
            visible={visible}
            style={{
                width: SIDEBAR_WIDTH,
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1050,
                overflow: 'hidden'
            }}
            >
                <CSidebarBrand 
                style={{height: 56}}
                className="d-flex align-items-center justify-content-center">
                    <strong>Inventory</strong>
                </CSidebarBrand>
                <CSidebarNav
                style={{
                    height: 'calc(100vh - 56px)',
                    overflowY: 'auto',
                    paddingTop: 8,
                    fontSize: '14px'
                }}
                >
                    {sidebarConfig.map((item, idx) => {
                        const access = hasAccess(userRoles, item.roles);
                        if(!access) return null;
                        if(item.type === "title"){
                            return <CNavTitle key={idx}>{item.label}</CNavTitle>
                        }
                        // Group menu
                        if(item.type === "group"){
                            return (
                                <CNavGroup key={idx} toggler={
                                    <>
                                    {item.icon && <CIcon icon={item.icon} className="me-2" />}
                                    {item.label}
                                    </>
                                }>
                                    {item.children.map((child, cidx) => {
                                        return (
                                            <CNavItem key={cidx}>
                                                <NavLink
                                                to={child.path}
                                                className={({isActive}) => "child nav-link" + (isActive ? " active" : "")}>
                                                    {child.icon && <CIcon icon={child.icon} className="me-2" />}
                                                    {child.label}
                                                </NavLink>
                                            </CNavItem>
                                        )
                                    })}
                                </CNavGroup>
                            )
                        }

                        // Single menu
                        return(
                            <CNavItem key={idx}>
                                <NavLink
                                to={item.path}
                                className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>
                                    {item.icon && <CIcon icon={item.icon} className="me-2" />}
                                    {item.label}
                                </NavLink>
                            </CNavItem>
                        )
                    })}
                </CSidebarNav>
            </CSidebar>
        </>
    )
}

export default Sidebar;