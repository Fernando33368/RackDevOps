const axios = require("axios");

async function buscarProducto(nombreProducto) {

    const respuesta = await axios.get(
        "https://serpapi.com/search.json",
        {
            params: {
                engine: "google_shopping",
                q: nombreProducto,
                api_key: process.env.SERP_API_KEY
            }
        }
    );

    const resultados = respuesta.data.shopping_results || [];

    if (resultados.length === 0) {
        throw new Error("No se encontraron resultados en SerpAPI.");
    }

    const producto = resultados[0];

    return {

        nombre: producto.title || nombreProducto,

        marca: producto.brand || null,

        modelo: producto.title || nombreProducto,

        categoria: null,

        precio:
            producto.extracted_price ??
            producto.price ??
            null,

        moneda:
            producto.currency ||
            "MXN",

        tienda:
            producto.source ||
            "Desconocida",

        url:
            producto.link ||
            null,

        imagen:
            producto.thumbnail ||
            producto.image ||
            null

    };

}

module.exports = {
    buscarProducto
};