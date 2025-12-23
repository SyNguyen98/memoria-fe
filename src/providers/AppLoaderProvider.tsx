import {createContext, ReactNode, useContext, useMemo, useState} from "react";
import AppLoader from "../components/app-loader/AppLoader.tsx";

type ContextType = {
    showAppLoader: () => void;
    hideAppLoader: () => void;
}

const AppContext = createContext<ContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppLoaderContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppLoaderContext must be used inside AppLoaderProvider");
    return context;
};

function AppLoaderProvider({children}: { children: ReactNode }) {
    const [open, setOpen] = useState(false);

    const value = useMemo(() => ({
        showAppLoader: () => setOpen(true),
        hideAppLoader: () => setOpen(false)
    }), [])

    return (
        <AppContext.Provider value={value}>
            {children}
            {open && (
                <div className="app-loader-container" style={{
                    position: "fixed",
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    top: 0,
                    zIndex: 9999
                }}>
                    <AppLoader/>
                </div>
            )}
        </AppContext.Provider>
    );
}

export default AppLoaderProvider;