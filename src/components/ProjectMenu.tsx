import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import {
    Folder,
    Save,
    Pencil,
    ArrowLeft,
    ChevronDown,
} from "lucide-react";

type Props = {
    projectId: string | null;
    projectName: string;
    setProjectName: React.Dispatch<React.SetStateAction<string>>;
    cfg: any;
    rackSize: string;
};

export default function ProjectMenu({
    projectId,
    projectName,
    setProjectName,
    cfg,
    rackSize,
}: Props) {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const [open, setOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        function close(e: MouseEvent) {

            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {

                setOpen(false);

            }

        }

        document.addEventListener(
            "mousedown",
            close
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                close
            );

    }, []);

    const saveProject = async () => {

        try {

            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:3000/projects/${projectId}`,
                {
                    cfg,
                    rackSize,
                    nombre: projectName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Proyecto guardado correctamente");

        } catch (err) {

            console.error(err);

            alert("No se pudo guardar el proyecto");

        }

    };

    const renameProject = async () => {

        const nuevoNombre = window.prompt(
            "Nuevo nombre del proyecto",
            projectName
        );

        if (!nuevoNombre) return;

        try {

            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:3000/projects/${projectId}`,
                {
                    nombre: nuevoNombre,
                    cfg,
                    rackSize,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProjectName(
                nuevoNombre
            );

            alert("Nombre actualizado");

        } catch (err) {

            console.error(err);

            alert("No se pudo cambiar el nombre");

        }

    };

    const cerrarSesion = () => {

    logout();

    localStorage.removeItem("projectId");

    navigate("/");

};

    return (

    <>
        <div
            style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "15px",
                marginBottom: "15px",
            }}
        >
            <span
                style={{
                    color: "white",
                    fontWeight: "bold",
                }}
            >
                👤 {user?.nombre}
            </span>

            <button
                onClick={cerrarSesion}
                style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
            >
                Cerrar sesión
            </button>
        </div>

        <div
            ref={menuRef}
            style={{
                position: "relative",
            }}
        >

            <button
                onClick={() =>
                    setOpen(!open)
                }
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,

                    background:
                        "rgba(0,217,255,.12)",

                    color: "#00d9ff",

                    border:
                        "1px solid rgba(0,217,255,.35)",

                    borderRadius: 10,

                    padding:
                        "10px 16px",

                    cursor: "pointer",

                    fontWeight: 700,

                    transition:
                        ".25s",
                }}
            >

                <Folder size={18} />

                Proyecto

                <ChevronDown size={16} />

            </button>

            {

                open &&

                <div
                    style={{

                        position: "absolute",

                        right: 0,

                        marginTop: 10,

                        width: 260,

                        background:
                            "#07111d",

                        border:
                            "1px solid #223247",

                        borderRadius: 12,

                        overflow: "hidden",

                        boxShadow:
                            "0 12px 30px rgba(0,0,0,.45)",

                        zIndex: 999,

                    }}
                >

                    <div
                        style={{

                            padding:
                                "14px",

                            borderBottom:
                                "1px solid #223247",

                            color: "#00d9ff",

                            fontWeight: "bold",

                            fontSize: 13,

                        }}
                    >

                        {projectName || "Proyecto"}

                    </div>

                    <MenuItem
                        icon={<Save size={18} />}
                        text="Guardar proyecto"
                        onClick={() => {

                            saveProject();

                            setOpen(false);

                        }}
                    />

                    <MenuItem
                        icon={<Pencil size={18} />}
                        text="Cambiar nombre"
                        onClick={() => {

                            renameProject();

                            setOpen(false);

                        }}
                    />

                    <MenuItem
                        icon={<ArrowLeft size={18} />}
                        text="Volver al inicio"
                        onClick={() => {

                            navigate("/");

                        }}
                    />

                </div>

            }

        </div>

    </>

);

}

type MenuItemProps = {

    icon: React.ReactNode;

    text: string;

    onClick: () => void;

};

function MenuItem({

    icon,

    text,

    onClick,

}: MenuItemProps) {

    return (

        <button
            onClick={onClick}
            style={{

                width: "100%",

                display: "flex",

                alignItems: "center",

                gap: 12,

                background: "transparent",

                color: "white",

                padding: "15px",

                border: "none",

                cursor: "pointer",

                fontSize: 14,

                transition: ".2s",

                borderBottom:
                    "1px solid #162231",

            }}
            onMouseEnter={(e) => {

                e.currentTarget.style.background =
                    "#102338";

            }}
            onMouseLeave={(e) => {

                e.currentTarget.style.background =
                    "transparent";

            }}
        >

            {icon}

            {text}

        </button>

    );

}