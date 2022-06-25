
import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./admin/App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "./admin/context";

const Admin = () => {
    return (
        <BrowserRouter basename="/admin">
            <MaterialUIControllerProvider>
            <App />
            </MaterialUIControllerProvider>
        </BrowserRouter>
    );
}

export default Admin;