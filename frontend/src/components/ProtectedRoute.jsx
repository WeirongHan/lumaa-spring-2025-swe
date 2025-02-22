/**
 * JWT Token verification and authentication related logics
 */
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

// check if authorized, other redirect
function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    // when load ProtectedRoute, load auth
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);

    // check if token expired and set isAuthorized state
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        // get time by second
        const now = Date.now() / 1000;
        if (tokenExpiration < now) {
            setIsAuthorized(false);
        } else {
            setIsAuthorized(true);
        }
    }

    if (isAuthorized == null) {
        return <div> Loading... </div>
    }

    // from react-router-dom, if not authorized, redirect to login page
    return isAuthorized ? children : <Navigate to="/login" />

}

export default ProtectedRoute;