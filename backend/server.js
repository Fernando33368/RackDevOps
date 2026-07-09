const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const db = require("./db");
const auth = require("./middleware/auth");
const app = express();
app.use(cors());
app.use(express.json());
const jwt = require("jsonwebtoken");

const JWT_SECRET = "RackDynamics_ClaveTemporal";

/* ==========================================
   Registrar usuario
========================================== */

app.post("/register", async (req, res) => {

    console.log(">>> Entró a /register");
    console.log(req.body);

    try {

        const { nombre, correo, password } = req.body;

        if (!nombre || !correo || !password) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "La contraseña debe tener al menos 8 caracteres."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(correo)) {
            return res.status(400).json({
                success: false,
                message: "Correo electrónico inválido."
            });
        }

        // Buscar usuario
        const [usuarios] = await db.query(
            "SELECT * FROM usuarios WHERE correo = ?",
            [correo]
        );

        if (usuarios.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Ese correo ya está registrado."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            `INSERT INTO usuarios
            (nombre, correo, password)
            VALUES (?, ?, ?)`,
            [nombre, correo, hashedPassword]
        );

        const token = jwt.sign(
            {
                id: result.insertId,
                nombre,
                correo
            },
            JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        res.status(201).json({
            success: true,
            message: "Usuario registrado correctamente.",
            token,
            user: {
                id: result.insertId,
                nombre,
                correo
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error interno del servidor.",
            error: error.message
        });

    }

});

/* ==========================================
   Iniciar sesión
========================================== */

app.post("/login", async (req, res) => {

    try {

        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({
                success: false,
                message: "Correo y contraseña son obligatorios."
            });
        }

        const [usuarios] = await db.query(
            "SELECT * FROM usuarios WHERE correo = ?",
            [correo]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Correo o contraseña incorrectos."
            });
        }

        const usuario = usuarios[0];

        const coincide = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!coincide) {
            return res.status(401).json({
                success: false,
                message: "Correo o contraseña incorrectos."
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo
            },
            JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        res.json({
            success: true,
            message: "Inicio de sesión correcto.",
            token,
            user: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error interno del servidor."
        });

    }

});

/* ==========================================
   CREAR PROYECTO
========================================== */   

app.post("/projects", auth, async (req, res) => {

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

        const [existeProyecto] = await db.query(
            `
            SELECT id
            FROM proyectos
            WHERE nombre = ?
            AND usuario_id = ?
            `,
            [
                nombre,
                req.user.id
            ]
            );

            if (existeProyecto.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Ya existe un proyecto con ese nombre."
                });
            }

        const [result] = await db.query(
            `
            INSERT INTO proyectos
            (usuario_id, nombre, configuracion)
            VALUES (?, ?, ?)
            `,
            [
            req.user.id,
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

app.get("/projects", auth, async (req, res) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM proyectos
        WHERE usuario_id = ?
        ORDER BY id DESC
        `,
    [
        req.user.id
]
);
        res.json(rows);
});

/* ==========================================
   OBTENER PROYECTO
========================================== */

app.get("/projects/:id", auth, async (req, res) => {

    const { id } = req.params;

    const [rows] = await db.query(
        `
        SELECT *
        FROM proyectos
        WHERE id = ?
        AND usuario_id = ?
        `,
    [
        id,
        req.user.id
    ]
);
        res.json(rows[0]);
});

/* ==========================================
   GUARDAR PROYECTO
========================================== */

app.put("/projects/:id", auth, async (req, res) => {

    const { id } = req.params;

    const {
    cfg,
    rackSize,
    nombre
} = req.body;

const configuracion = JSON.stringify({
    cfg,
    rackSize
});

if (nombre) {

    await db.query(
        `
        UPDATE proyectos
        SET nombre = ?, configuracion = ?
        WHERE id = ?
        AND usuario_id = ?
        `,
        [
            nombre,
            configuracion,
            id,
            req.user.id
        ]
    );

} else {

    await db.query(
        `
        UPDATE proyectos
        SET configuracion = ?
        WHERE id = ?
        AND usuario_id = ?
        `,
        [
            configuracion,
            id,
            req.user.id
        ]
    );

}

    res.json({
        message: "Proyecto actualizado"
    });

});

/* ==========================================
   ELIMINAR PROYECTO
========================================== */

app.delete("/projects/:id", auth, async (req, res) => {

    const { id } = req.params;

    await db.query(
    `
    DELETE
    FROM proyectos
    WHERE id = ?
    AND usuario_id = ?
    `,
    [
        id,
        req.user.id
    ]
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