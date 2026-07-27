import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const iniciarSesion = async () => {
    try {
        const respuesta = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo,
                password
            })
        });
        const data = await respuesta.json();
        if (!data.success) {
            alert(data.message);
            return;
        }
        login(data.user, data.token);
        navigate("/", { replace: true });
    } catch (error) {
        alert("No fue posible iniciar sesión.");
    }
};
    return (
    <div
        style={{
            minHeight: "100vh",
            background: "#163257",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}
    >
        <div
            style={{
                width: "420px",
                background: "#0b1728",
                borderRadius: "16px",
                padding: "40px",
                boxShadow: "0 15px 35px rgba(0,0,0,.35)"
            }}
        >
            <h1
                style={{
                    color: "white",
                    textAlign: "center",
                    marginBottom: "8px",
                    fontSize: "32px"
                }}
            >
                RackDevOps
            </h1>
            <p
                style={{
                    color: "#94a3b8",
                    textAlign: "center",
                    marginBottom: "35px"
                }}
            >
                Inicia sesión para continuar
            </p>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px"
                }}
            >
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "14px",
                        background: "#1e293b",
                        color: "white",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        outline: "none",
                        fontSize: "15px",
                        boxSizing: "border-box"
                    }}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "14px",
                        background: "#1e293b",
                        color: "white",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        outline: "none",
                        fontSize: "15px",
                        boxSizing: "border-box"
                    }}
                />
                <button
                    onClick={iniciarSesion}
                    style={{
                        width: "100%",
                        padding: "14px",
                        background: "#0ea5e9",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        fontSize: "15px",
                        cursor: "pointer",
                        transition: ".2s"
                    }}
                >
                    Iniciar sesión
                </button>
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "28px 0"
                }}
            >
                <div
                    style={{
                        flex: 1,
                        height: "1px",
                        background: "#334155"
                    }}
                />
                <span
                    style={{
                        margin: "0 15px",
                        color: "#94a3b8",
                        fontSize: "13px"
                    }}
                >
                    o
                </span>
                <div
                    style={{
                        flex: 1,
                        height: "1px",
                        background: "#334155"
                    }}
                />
            </div>
            <button
                onClick={() => navigate("/register")}
                style={{
                    width: "100%",
                    padding: "14px",
                    background: "transparent",
                    color: "#38bdf8",
                    border: "1px solid #38bdf8",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer"
                }}
            >
                Crear cuenta
            </button>
        </div>
    </div>
);
}