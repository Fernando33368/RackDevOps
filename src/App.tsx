import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/index";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { useAuth } from "./auth/AuthContext";

export default function App() {

    const { token } = useAuth();

    console.log("TOKEN EN APP:", token);

    return (

        <Routes>

            {/* Públicas */}

            <Route
                path="/login"
                element={
                    token
                        ? <Navigate to="/" />
                        : <Login />
                }
            />

            <Route
                path="/register"
                element={
                    token
                        ? <Navigate to="/" />
                        : <Register />
                }
            />

            {/* Privadas */}

            <Route
                path="/"
                element={
                    token
                        ? <Home />
                        : <Navigate to="/login" />
                }
            />

            <Route
                path="/project"
                element={
                    token
                        ? <Index />
                        : <Navigate to="/login" />
                }
            />

        </Routes>

    );

}