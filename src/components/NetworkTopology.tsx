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
    antenasptmp
}: TopologyProps) {

    const W = 900;
    const H = 800;

    const cx = W / 2;
    const cy = H / 2;

    const nodes: Node[] = [
        { id: "internet", label: "Internet", x: cx, y: 20, color: "#00FFFF"},
        { id: "firewall", label: "Firewall", x: cx, y: 60, color: "#00FF00"},
        { id: "router", label: "Router", x: cx, y: 100, color: "#87CEFA"},
        { id: "core", label: switches > 1 ? `Switch Core (${switches})` : "Switch Core", x: cx, y: 170, color: "#00d9ff"},
    ];

    const edges: Edge[] = [];

    edges.push(
        {from: "internet", to: "firewall"},
        {from: "firewall", to: "router"},
        {from: "router", to: "core"}
    );  

    // Función para obtener la imagen correspondiente a cada nodo
    function getImg(id: string) {
        console.log(id);

        if (id === 'core')
            return '/image/SwitchCore.png';

        if (id === "core")
            return "/image/SwitchCore.png";

        if (id.startsWith("pc"))
            return "/image/PCS.png";

        if (id.startsWith('cameraptz'))
            return '/image/CamPTZ.png';

        if (id.startsWith('camera'))
            return '/image/camara_ip.png';

        if (id.startsWith("cam"))
            return "/image/camara_ip.png";

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

        if(id==="internet")
            return "/image/internet.png";

        if(id==="router")
            return "/image/router.png";

        if(id==="firewall")
            return "/image/Firewall.png";

        return '/image/PCS.png';
    }

    function addGroup(
        count: number,
        prefix: string,
        label: string,
        color: string,
        startX: number,
        startY: number,
        columns = 4,
    ) {

        const gapX = 40;
        const gapY = 40;

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
                from: "core",
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

    addGroup(pcs, 'pc', 'PC', '#00FF7F', zones.usuarios.x - 50, zones.usuarios.y, 4);
    addGroup(servers, 'srv', 'Server', '#FF8C00', zones.servicios.x - 20, zones.servicios.y + 40, 4);
    addGroup(cameras, 'camera', 'Cám', '#7FFFD4', zones.seguridad.x - 6, zones.seguridad.y, 4);
    addGroup(phones, 'phone', 'VoIP', '#1E90FF', zones.wireless.x + 680, zones.wireless.y - 200, 4);
    addGroup(printers, 'printer', 'Impre', '#B0C4DE', zones.enlaces.x - 350, zones.enlaces.y + 100, 4);
    addGroup(nas, 'nas', 'NAS', '#FF0000', zones.servicios.x - 20, zones.servicios.y + 340, 4);
    addGroup(cameraptz, 'cameraptz', 'CámPTZ', '#40E0D0', zones.seguridad.x + 200, zones.seguridad.y, 4);
    addGroup(accessPoints, 'accesspoint', 'PAccess', '#FFFF00', zones.wireless.x + 280, zones.wireless.y + 100, 4);
    addGroup(antenasptp, 'antenaPTP', 'AntPTP', '#FF00FF', zones.enlaces.x + 265, zones.enlaces.y + 100, 4);
    addGroup(antenasptmp, 'antenaPTMP', 'AntPTMP', '#FFD700', zones.enlaces.x + 460, zones.enlaces.y + 100, 4);

    function getLabelY(node: Node) {
        return node.id === "core"
            ? node.y + 20
            : node.y + 20;
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
                        strokeWidth={1}
                        strokeOpacity={0.35}
                        strokeDasharray="5 4"
                    />
                );

            })}

            {nodes.map(node => {

                const size =
                    node.id === 'core'
                        ? 100
                        : 30;

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
                                node.id === 'core'
                                    ? 15
                                    : 7
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