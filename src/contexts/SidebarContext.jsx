import React, {useState, createContext, useContext} from "react";

export const SidebarContext = createContext();

export const SidebarProvider = ({children}) => {
    const [visible, setVisible] = useState(false);

    function toggle(){
        setVisible((v) => !v);
    }
    return (
        <SidebarContext.Provider value={{visible, toggle}}>
            {children}
        </SidebarContext.Provider>
    )
}

export const useSidebar = () => {
    const ctx = useContext(SidebarContext)
    if(!ctx) throw new Error('useSidebar must be used within SidebarProvider');
    return ctx;
}