const jwt = require("jsonwebtoken");
const JWT_SECRET = "RackDynamics_ClaveTemporal";

const auth = (req, res, next) => {

    // Obtener el encabezado Authorization
    const authHeader = req.headers.authorization;

    // ¿Existe el encabezado?
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Token no proporcionado."
        });
    }

    // Debe venir como:
    // Bearer eyJhbGc...

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token inválido."
        });
    }

    try {

        // Verificar el token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Guardar los datos del usuario
        req.user = decoded;

        // Continuar con la ruta
        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Token inválido o expirado."
        });

    }

};

module.exports = auth;