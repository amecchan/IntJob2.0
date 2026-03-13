// components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem(ACCESS_TOKEN);

    // If there's a token, show the page (children).
    // If not, redirect them to the login page.
    return token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;