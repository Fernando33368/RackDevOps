import { useState } from "react";
import axios from "axios";

export default function NewProject() {

    const [name, setName] = useState("");

    const createProject = async () => {

        await axios.post(
            "http://localhost:3000/projects",
            {
                name
            }
        );
    };

    return (
        <>
            <input
                value={name}
                onChange={(e)=>setName(e.target.value)}
            />

            <button onClick={createProject}>
                Crear
            </button>
        </>
    );
}