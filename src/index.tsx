import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router";
import App from "./App.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import AudioProvider from "./providers/AudioProvider.tsx";
import AppProvider from "./providers/AppProvider.tsx";
import AppSnackbarProvider from "@providers/AppSnackbarProvider.tsx";
import AppLoaderProvider from "@providers/AppLoaderProvider.tsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false
        }
    }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AppProvider>
                <AppLoaderProvider>
                    <AppSnackbarProvider>
                        <AudioProvider>
                            <BrowserRouter basename={import.meta.env.VITE_BASENAME}>
                                <App/>
                            </BrowserRouter>
                        </AudioProvider>
                    </AppSnackbarProvider>
                </AppLoaderProvider>
            </AppProvider>
        </QueryClientProvider>
    </React.StrictMode>
)
