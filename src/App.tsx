import {
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/Home";
import ProjectEditor from "./pages/index";

export default function App() {
    return (
        <Routes>

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/project"
                element={<ProjectEditor />}
            />

        </Routes>
    );
}