import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {User} from "@models/User.ts";
import {useUserQuery} from "@queries/UserQueryHook.ts";

type ContextType = {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    currentLanguage: string;
    setCurrentLanguage: (language: string) => void;
}

const AppContext = createContext<ContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used inside AppProvider");
    return context;
};

function AppProvider({children}: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentLanguage, setCurrentLanguage] = useState('vn');

    const userQuery = useUserQuery();

    useEffect(() => {
        if (userQuery.data) {
            setCurrentUser(userQuery.data);
        }
    }, [userQuery.data]);

    const value = useMemo(() => ({
        currentUser,
        setCurrentUser,
        currentLanguage,
        setCurrentLanguage
    }), [currentLanguage, currentUser])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;