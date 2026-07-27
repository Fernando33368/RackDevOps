import { useEffect, useState } from "react";
type CostEstimatorProps = {
    servers: number;
    switches24: number;
    switches48: number;
    poeSwitches24: number;
    poeSwitches48: number;
    rackSize: string;
    routers: number;
    firewalls: number;
    aps: number;
};
type EquipoCotizado = {
    codigo: string;
    nombre: string;
    categoria: string;
    precio: number;
    cantidad: number;
    subtotal: number;
    moneda: string;
    imagen: string;
};
export default function CostEstimator({
    servers,
    switches24,
    switches48,
    poeSwitches24,
    poeSwitches48,
    routers,
    firewalls,
    aps,
}: CostEstimatorProps) {
    const [equipos, setEquipos] = useState<EquipoCotizado[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const totalEquipos =
        servers +
        switches24 +
        switches48 +
        poeSwitches24 +
        poeSwitches48 +
        routers +
        firewalls +
        aps;
    const upsCount = Math.max(1, Math.ceil(totalEquipos / 20));
    const patchCount = Math.max(
        1,
        switches24 +
        switches48 +
        poeSwitches24 +
        poeSwitches48
    );
    const cablesCount = Math.max(1, Math.ceil(totalEquipos / 10));
    useEffect(() => {
        async function cargarCotizacion() {
            try {
                setLoading(true);
                const response = await fetch(
                    "http://localhost:3000/api/cotizacion",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            equipos: [
                                { codigo: "servidor", cantidad: servers },
                                { codigo: "switch24", cantidad: switches24 },
                                { codigo: "switch48", cantidad: switches48 },
                                { codigo: "switchPoe24", cantidad: poeSwitches24 },
                                { codigo: "switchPoe48", cantidad: poeSwitches48 },
                                { codigo: "router", cantidad: routers },
                                { codigo: "firewall", cantidad: firewalls },
                                { codigo: "accessPoint", cantidad: aps },
                                { codigo: "rack", cantidad: 1 },
                                { codigo: "ups", cantidad: upsCount },
                                { codigo: "patchPanel", cantidad: patchCount },
                                { codigo: "cableado", cantidad: cablesCount }
                            ].filter(e => e.cantidad > 0)
                        })
                    }
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }
                setEquipos(data.equipos);
                setTotal(data.total);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        cargarCotizacion();
    }, [
        servers,
        switches24,
        switches48,
        poeSwitches24,
        poeSwitches48,
        routers,
        firewalls,
        aps
    ]);
    function fmt(numero: number) {
        return numero.toLocaleString(
            "es-MX",
            {
                style: "currency",
                currency: "MXN",
                maximumFractionDigits: 2
            }
        );
    }

    return (
        <div>
            <p
                style={{
                    margin: "0 0 12px",
                    fontSize: 11,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em"
                }}
            >
                Estimación de Costos (MXN)
            </p>
            {
                loading && (
                    <p style={{ color: "white" }}>
                        Cargando cotización...
                    </p>
                )
            }
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6
                }}
            >
                {
                    equipos.map((equipo) => (
                        <div
                            key={equipo.codigo}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr auto auto",
                                gap: 8,
                                alignItems: "center",
                                fontSize: 11,
                                padding: "5px 0",
                                borderBottom: "1px solid #1e293b"
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8
                                }}
                            >
                                <img
                                    src={equipo.imagen}
                                    alt={equipo.nombre}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        objectFit: "contain",
                                        borderRadius: 6,
                                        background: "#fff",
                                        padding: 2
                                    }}
                                />
                                <div>
                                    <div
                                        style={{
                                            color: "#e2e8f0"
                                        }}
                                    >
                                        {equipo.nombre}
                                    </div>
                                    <div
                                        style={{
                                            color: "#64748b",
                                            fontSize: 10
                                        }}
                                    >
                                        {equipo.categoria}
                                    </div>
                                </div>
                            </div>
                            <span
                                style={{
                                    color: "#94a3b8"
                                }}
                            >
                                x{equipo.cantidad}
                            </span>
                            <span
                                style={{
                                    color: "#00ffff",
                                    fontFamily: "Consolas, monospace"
                                }}
                            >
                                {fmt(equipo.subtotal)}
                            </span>
                        </div>
                    ))
                }
            </div>
            <div
                style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid #334155",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <span
                    style={{
                        fontSize: 12,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em"
                    }}
                >
                    Total estimado
                </span>
                <span
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        fontFamily: "Consolas, monospace",
                        color: "#00ffff"
                    }}
                >
                    {fmt(total)}
                </span>
            </div>
        </div>
    );
}