import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import App from './app/App';
import {Provider} from "react-redux";
import store from './app/store';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1
        }
    }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <BrowserRouter basename={import.meta.env.VITE_BASENAME}>
                    <App/>
                </BrowserRouter>
            </Provider>
        </QueryClientProvider>
    </React.StrictMode>
)
