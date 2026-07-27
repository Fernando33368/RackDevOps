const db = require("../db");
const catalogoEquipos = require("../catalog/equipos");
const { buscarProducto } = require("./serpApiService");

async function obtenerEquipo(codigo){

    const equipoCatalogo = catalogoEquipos[codigo];

    if(!equipoCatalogo){

        throw new Error("Equipo no encontrado.");

    }

    const [rows] = await db.query(

        `
        SELECT *
        FROM equipos
        WHERE codigo=?
        `,

        [codigo]

    );

    if(rows.length>0){

        return rows[0];

    }

    const producto = await buscarProducto(
        equipoCatalogo.nombre
    );

    await db.query(

        `
        INSERT INTO equipos(

            codigo,

            nombre,

            marca,

            modelo,

            categoria,

            precio,

            moneda,

            tienda,

            url,

            imagen

        )

        VALUES(?,?,?,?,?,?,?,?,?,?)

        `,

        [

            codigo,

            producto.nombre,

            producto.marca,

            producto.modelo,

            equipoCatalogo.categoria,

            producto.precio,

            producto.moneda,

            producto.tienda,

            producto.url,

            producto.imagen

        ]

    );

    return {

        codigo,

        nombre: producto.nombre,

        marca: producto.marca,

        modelo: producto.modelo,

        categoria: equipoCatalogo.categoria,

        precio: Number(producto.precio) || 0,

        moneda: producto.moneda,

        tienda: producto.tienda,

        url: producto.url,

        imagen: producto.imagen

    };

}

module.exports = {

    obtenerEquipo

};