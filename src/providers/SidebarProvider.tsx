import {createContext, ReactNode, useContext, useMemo, useState} from "react";

type ContextType = {
    sidebarOpened: boolean;
    setSidebarOpened: (opened: boolean) => void;
}

const SidebarContext = createContext<ContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useSidebarContext = () => {
    const context = useContext(SidebarContext);
    if (!context) throw new Error("useSidebarContext must be used inside AppProvider");
    return context;
};

function SidebarProvider({children}: { children: ReactNode }) {
    const [sidebarOpened, setSidebarOpened] = useState(false);

    const value = useMemo(() => ({
        sidebarOpened,
        setSidebarOpened,
    }), [sidebarOpened])

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
}

export default SidebarProvider;