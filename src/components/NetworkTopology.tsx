type TopologyProps = {
    pcs: number;
    servers: number;
    cameras: number;
    phones: number;
    printers: number;
    switches: number;
    nas: number;
    cameraptz: number;
    accessPoints: number;
    antenasptp: number;
    antenasptmp: number;
    routersTopo: number;
};

type Node = {
    id: string;
    label: string;
    x: number;
    y: number;
    color: string;
};

type Edge = {
    from: string;
    to: string;
};

export default function NetworkTopology({
    pcs,
    servers,
    cameras,
    phones,
    printers,
    switches,
    nas,
    cameraptz,
    accessPoints,
    antenasptp,
    antenasptmp,
    routersTopo,
}: TopologyProps) {

    const W = 1200;
    const H = 1300;

    const cx = W / 2;
    const cy = H / 2;

    const nodes: Node[] = [
        { id: "rack", label: "Rack Principal", x: cx, y: 80, color: "#00FFFF" },
    ];

    const edges: Edge[] = [];



    // Función para obtener la imagen correspondiente a cada nodo
    function getImg(id: string) {
        console.log(id);

        if (id === 'rack')
            return '/image/rack.png';

        if (id.startsWith("pc"))
            return "/image/PCS.png";

        if (id.startsWith("srv"))
            return "/image/Servidor.png";

        if (id.startsWith('cameraptz'))
            return '/image/CamPTZ.png';

        if (id.startsWith('camera'))
            return '/image/camara_ip.png';

        if (id.startsWith("cam"))
            return "/image/camara_ip.png";

        if (id.startsWith("printer"))
            return "/image/impresora.png";

        if (id.startsWith("phone"))
            return "/image/telefono_voip.png";

        if (id.startsWith('nas'))
            return '/image/NAS.png';

        if (id.startsWith('accesspoint'))
            return '/image/access_point.png';

        if (id.startsWith('antenaPTP'))
            return '/image/antPTP.png';

        if (id.startsWith('antenaPTMP'))
            return '/image/antPTMP.png';

        if( id.startsWith('routers'))
            return "/image/router.png";

        
        return '/image/PCS.png';
    }

    function addGroup(
        count: number,
        prefix: string,
        label: string,
        color: string,
        startX: number,
        startY: number,
        columns = 5,
    ) {

        const gapX = 35; // Espacio horizontal entre nodos
        const gapY = 35; // Espacio vertical entre nodos

        for (let i = 0; i < count; i++) {

            const col = i % columns;
            const row = Math.floor(i / columns);

            const id = `${prefix}${i}`;

            nodes.push({
                id, label: `${label} ${i + 1}`,
                x: startX + col * gapX,
                y: startY + row * gapY,
                color,
            });

            edges.push({
                from: "rack",
                to: id,
            });
        }
    }

    const zones = {
        usuarios: {x: 40, y: 220},
        servicios: {x: 200, y: 180},
        seguridad: {x: 400, y: 220},
        wireless: {x: 120, y: 420},
        enlaces: {x: 340, y: 420}
    };

    addGroup(pcs, 'pc', 'PC', '#0000FF', zones.usuarios.x - 25, zones.usuarios.y, 5);
    addGroup(servers, 'srv', 'Server', '#00FFFF', zones.servicios.x + 20, zones.servicios.y + 40, 5);
    addGroup(cameras, 'camera', 'Cám', '#0000FF', zones.seguridad.x + 20, zones.seguridad.y, 5);
    addGroup(cameraptz, 'cameraptz', 'CámPTZ', '#0000FF', zones.seguridad.x + 250, zones.seguridad.y, 5);
    addGroup(phones, 'phone', 'VoIP', '#00FFFF', zones.wireless.x + 740, zones.wireless.y - 200, 5);
    addGroup(printers, 'printer', 'Impre', '#0000FF', zones.enlaces.x + 730, zones.enlaces.y - 200, 5);
    addGroup(nas, 'nas', 'NAS', '#00FFFF', zones.servicios.x - 80, zones.servicios.y + 550, 5);
    addGroup(accessPoints, 'accesspoint', 'AccessP', '#00FFFF', zones.wireless.x + 200, zones.wireless.y + 310, 5);
    addGroup(antenasptp, 'antenaPTP', 'AntPTP', '#0000FF', zones.enlaces.x + 205, zones.enlaces.y + 310, 5);
    addGroup(antenasptmp, 'antenaPTMP', 'AntPTMP', '#00FFFF', zones.enlaces.x + 420, zones.enlaces.y + 310, 5);
    addGroup(routersTopo, 'routers', 'Router', '#00FFFF', zones.enlaces.x + 640, zones.enlaces.y + 310, 5);

    function getLabelY(node: Node) {    
        return node.id === "rack"
            ? node.y + 70 // Ajuste vertical para el rack
            : node.y + 20; // Ajuste vertical para los nodos
    }

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            style={{
                width: "100%",
                height: "100%",
                overflow: "visible",
            }}
        >


            {edges.map((edge, i) => {

                const from = nodes.find(n => n.id === edge.from)!;
                const to = nodes.find(n => n.id === edge.to)!;

                return (
                    <line
                        key={i}
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        stroke={to.color}
                        strokeWidth={2}
                        strokeOpacity={0.7}
                        strokeDasharray="8 6"
                    />
                );

            })}


            {nodes.map(node => {

                const size =
                    node.id === 'rack'
                        ? 130 // Tamaño del rack
                        : 30; // Tamaño de los nodos


                return (

                    <g key={node.id}>


                        <image
                            href={getImg(node.id)}
                            x={node.x - size / 2}
                            y={node.y - size / 2}
                            width={size}
                            height={size}

                        />


                        <text
                            x={node.x}
                            y={getLabelY(node)}
                            textAnchor="middle"
                            fill={node.color}
                            fontSize={
                                node.id === 'rack'
                                    ? 15 // Tamaño de fuente para el rack
                                    : 7 // Tamaño de fuente para los nodos
                            }
                            fontFamily="Consolas, monospace"
                        >
                            {node.label}
                        </text>

                    </g>

                );

            })}

        </svg>

    );

}