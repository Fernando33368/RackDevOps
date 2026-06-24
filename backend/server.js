const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* ==========================================
   CREAR PROYECTO
========================================== */

app.post("/projects", async (req, res) => {

    try {

        const { nombre } = req.body;

        const configuracionInicial = {
            cfg: {
                pcs: 0,
                servers: 0,
                cameras: 0,
                phones: 0,
                printers: 0,
                sw24: 0,
                sw48: 0,
                poe24: 0,
                poe48: 0,
                routers: 0,
                firewalls: 0,
                aps: 0
            },
            rackSize: "22U"
        };

        const [result] = await db.query(
            `
            INSERT INTO proyectos
            (nombre, configuracion)
            VALUES (?,?)
            `,
            [
                nombre,
                JSON.stringify(configuracionInicial)
            ]
        );

        res.json({
            id: result.insertId
        });

    } catch (error) {

        console.log(error);

        res.status(500).json(error);

    }
});

/* ==========================================
   LISTAR PROYECTOS
========================================== */

app.get("/projects", async (req, res) => {

    const [rows] = await db.query(
        "SELECT * FROM proyectos ORDER BY id DESC"
    );

    res.json(rows);

});

/* ==========================================
   OBTENER PROYECTO
========================================== */

app.get("/projects/:id", async (req, res) => {

    const { id } = req.params;

    const [rows] = await db.query(
        "SELECT * FROM proyectos WHERE id=?",
        [id]
    );

    res.json(rows[0]);

});

/* ==========================================
   GUARDAR PROYECTO
========================================== */

app.put("/projects/:id", async (req, res) => {

    const { id } = req.params;

    const {
        cfg,
        rackSize
    } = req.body;

    await db.query(
        `
        UPDATE proyectos
        SET configuracion=?
        WHERE id=?
        `,
        [
            JSON.stringify({
                cfg,
                rackSize
            }),
            id
        ]
    );

    res.json({
        message: "Proyecto actualizado"
    });

});

/* ==========================================
   ELIMINAR PROYECTO
========================================== */

app.delete("/projects/:id", async (req, res) => {

    const { id } = req.params;

    await db.query(
        "DELETE FROM proyectos WHERE id=?",
        [id]
    );

    res.json({
        message: "Proyecto eliminado"
    });

});

/* ==========================================
   INICIAR SERVIDOR
========================================== */

app.listen(3000, () => {
    console.log("Servidor activo puerto 3000");
});