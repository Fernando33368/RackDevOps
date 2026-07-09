import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {

    const navigate = useNavigate();

    const [projects, setProjects] = useState<any[]>([]);
    const [projectName, setProjectName] = useState("");

    const loadProjects = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:3000/projects",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProjects(res.data);

        } catch (error) {

            console.error(error);

        }
    };

    useEffect(() => {

        loadProjects();

    }, []);

    const createProject = async () => {

        if (!projectName.trim()) {

            alert("Escribe un nombre para el proyecto");
            return;

        }

        try {

            const token = localStorage.getItem("token");

            const res = await axios.post(
                "http://localhost:3000/projects",
                {
                    nombre: projectName
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            localStorage.setItem(
                "projectId",
                res.data.id
            );

            navigate("/project");

        } catch (error) {

            console.error(error);

            alert("Error al crear proyecto");

        }
    };

    const openProject = (id: number) => {

        localStorage.setItem(
            "projectId",
            id.toString()
        );

        navigate("/project");
    };
    
    const deleteProject = async (id: number) => {

    const confirmar = window.confirm(
        "¿Deseas eliminar este proyecto?"
    );

    if (!confirmar) return;

    try {

        const token = localStorage.getItem("token");

        await axios.delete(
            `http://localhost:3000/projects/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        loadProjects();

    } catch (error) {

        console.error(error);

        alert("Error al eliminar proyecto");

    }
};

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#163257",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white"
            }}
        >
            <div
                style={{
                    width: "600px",
                    padding: "30px",
                    borderRadius: "12px",
                    background: "#0b1728"
                }}
            >
                <h1>RackDynamics</h1>

                <h3>Crear Proyecto</h3>

                <input
                    type="text"
                    placeholder="Nombre del proyecto"
                    value={projectName}
                    onChange={(e) =>
                        setProjectName(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "10px"
                    }}
                />

                <button
                    onClick={createProject}
                    style={{
                        width: "100%",
                        padding: "15px",
                        marginBottom: "25px",
                        cursor: "pointer"
                    }}
                >
                    Crear Proyecto
                </button>

                <h3>Proyectos Guardados</h3>

                {
                    projects.length === 0
                        ? (
                            <p>
                                No hay proyectos guardados.
                            </p>
                        )
                        : (
                            projects.map((project) => (
                                <div
                                    key={project.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "10px",
                                        marginBottom: "10px",
                                        background: "#1e293b",
                                        borderRadius: "8px"
                                    }}
                                >
                                    <span>
                                        {project.nombre}
                                    </span>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px"
                                    }}
                                >
                                    <button
                                        onClick={() =>
                                            openProject(project.id)
                                        }
                                        style={{
                                            cursor: "pointer",
                                            borderRadius: "4px",
                                            padding: "6px 12px"
                                        }}
                                    >
                                        Abrir
                                    </button>
                                    
                                    <button
                                        onClick={() =>
                                            deleteProject(project.id)
                                        }
                                        style={{
                                            background: "#dc2626",
                                            color: "white",
                                            border: "none",
                                            padding: "6px 12px",
                                            cursor: "pointer",
                                            borderRadius: "4px"
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                                </div>
                            ))
                        )
                }
            </div>
        </div>
    );
}