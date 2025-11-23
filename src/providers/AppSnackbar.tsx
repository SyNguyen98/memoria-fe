import {createContext, ReactNode, useContext, useMemo, useState} from "react";
import {Alert, Snackbar} from "@mui/material";

type ContextType = {
    openSnackbar: (type: 'success' | 'warning' | 'error', message: string) => void;
}

const AppContext = createContext<ContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppSnackbarContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppSnackbarContext must be used inside AppSnackbarProvider");
    return context;
};

function AppSnackbarProvider({children}: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<'success' | 'warning' | 'error'>('success');
    const [message, setMessage] = useState('');

    const handleOpenSnackbar = (type: 'success' | 'warning' | 'error', message: string) => {
        setOpen(true);
        setType(type);
        setMessage(message);
    }

    const value = useMemo(() => ({
        openSnackbar: handleOpenSnackbar
    }), [])

    return (
        <AppContext.Provider value={value}>
            {children}
            <Snackbar open={open} autoHideDuration={3000}
                      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                      onClose={() => setOpen(false)}>
                <Alert severity={type}>
                    {message}
                </Alert>
            </Snackbar>
        </AppContext.Provider>
    );
}

export default AppSnackbarProvider;