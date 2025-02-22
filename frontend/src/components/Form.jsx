/**
 * Login and Register related logics
 */

import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "../components/LoadingIndicator"

// for login and register
function Form({route, method}) {
    const[username, setUsername] = useState("")
    const[password, setPassword] = useState("")
    const[loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login" ? "login" : "register"
    const other = method === "login" ? "register" : "login"
    const handleSubmit = async (e) => {
        setLoading(true)
        // prevent reload page
        e.preventDefault();

        // check username and password are not empty
        if (!username.trim() || !password.trim()) {
            alert("Username and password cannot be empty!");
            setLoading(false);
            return;
        }

        // if login, store access token. if register, redirect to login page after successfully registered
        try{
            if (method === "login") {
                const res = await api.post(route, { username, password });
                localStorage.setItem(ACCESS_TOKEN, res.data.token);
                navigate("/")
            } else {
                const res = await api.post("/auth/register", { username, password });
                alert("Registration Success!");
                navigate("/login")
            }
        }
        catch(error) {
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        } finally{
            setLoading(false)
        }
    }
    return <form onSubmit={handleSubmit} className = "form-container">
        <h1>{name}</h1>
        <input className="form-input" type="text"  value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
        <input className="form-input" type="password"  value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
        {loading && <LoadingIndicator />}
        <button className="form-button" type="submit"> {name} </button>
        <button className="form-button" type="submit" onClick={(e) => { e.preventDefault(); navigate(`/${other}`); }}> {other}</button>
    </form>
}

export default Form