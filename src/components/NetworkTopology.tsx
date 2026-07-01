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
    const H = 650;

    const cx = W / 2;
    const cy = H / 2;

    const nodes: Node[] = [
        { id: "internet", label: "Internet", x: cx, y: 20, color: "#00ffff"},
        { id: "firewall", label: "Firewall", x: cx, y: 60, color: "#ff9800"},
        { id: "router", label: "Router", x: cx, y: 100, color: "#38bdf8"},
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

        if (id.startsWith('pc'))
            return '/image/PCS.png';

        if (id.startsWith('srv'))
            return '/image/servidor.png';

        if (id.startsWith('cameraptz'))
            return '/image/CamPTZ.png';

        if (id.startsWith('camera'))
            return '/image/camara_ip.png';

        if (id.startsWith('phone'))
            return '/image/telefono_voip.png';

        if (id.startsWith('printer'))
            return '/image/impresora.png';

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

        const gapX = 35;
        const gapY = 35;

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
                from: 'core',
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

    addGroup(pcs, 'pc', 'PC', '#94a3b8', zones.usuarios.x, zones.usuarios.y, 4);
    addGroup(servers, 'srv', 'Servidor', '#22c55e', zones.servicios.x, zones.servicios.y, 4);
    addGroup(cameras, 'camera', 'Cámara', '#f59e0b', zones.seguridad.x, zones.seguridad.y, 4);
    addGroup(phones, 'phone', 'VoIP', '#a855f7', zones.wireless.x, zones.wireless.y, 4);
    addGroup(printers, 'printer', 'Impresora', '#ef4444', zones.enlaces.x, zones.enlaces.y, 4);
    addGroup(nas, 'nas', 'NAS', '#3b82f6', zones.servicios.x, zones.servicios.y + 80, 4);
    addGroup(cameraptz, 'cameraptz', 'Cámara PTZ', '#f97316', zones.seguridad.x, zones.seguridad.y + 80, 4);
    addGroup(accessPoints, 'accesspoint', 'Punto de Acceso', '#8b5cf6', zones.wireless.x, zones.wireless.y + 80, 4);
    addGroup(antenasptp, 'antenaPTP', 'Antena PTP', '#f43f5e', zones.enlaces.x, zones.enlaces.y + 80, 4);
    addGroup(antenasptmp, 'antenaPTMP', 'Antena PTMP', '#10b981', zones.enlaces.x + 80, zones.enlaces.y + 80, 4);

    function getLabelY(node: Node) {
        return node.id === 'core'
            ? node.y + 20
            : node.y + 25;
    }

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            style={{
                width: '100%',
                height: '90%',
                overflow: 'visible',
            }}
        >

            {/* conexiones */}
            {edges.map((edge, i) => {

                const from =
                    nodes.find(
                        n => n.id === edge.from
                    )!;

                const to =
                    nodes.find(
                        n => n.id === edge.to
                    )!;

                return (
                    <line
                        key={i}
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        stroke={to.color}
                        strokeWidth={1}
                        strokeOpacity={0.3}
                        strokeDasharray="5 4"
                    />
                );
            })}

            {/* nodos */}
            {nodes.map(node => {

                const size =
                    node.id === 'core'
                        ? 80
                        : 35;

                return (
                    <g key={node.id}>

                        {/* imagen */}
                        <image
                            href={getImg(node.id)}
                            x={node.x - size / 2}
                            y={node.y - size / 2}
                            width={size}
                            height={size}
                            preserveAspectRatio="xMidYMid meet"
                        />

                        {/* texto */}
                        <text
                            x={node.x}
                            y={getLabelY(node)}
                            textAnchor="middle"
                            fill={node.color}
                            fontSize={
                                node.id === 'core'
                                    ? 10
                                    : 11
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