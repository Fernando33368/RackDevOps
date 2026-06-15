type TopologyProps = {
    pcs: number;
    servers: number;
    cameras: number;
    phones: number;
    printers: number;
    switches: number;
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
}: TopologyProps) {

    const W = 500;
    const H = 320;

    const cx = W / 2;
    const cy = H / 2;

    const nodes: Node[] = [
        {
            id: 'core',
            label: switches > 1
                ? `Switch Core (${switches})`
                : 'Switch Core',
            x: cx,
            y: cy,
            color: '#00d9ff',
        },
    ];

    const edges: Edge[] = [];

    function getImg(id: string) {
        if (id === 'core')
            return '/image/SwitchCore.png';

        if (id.startsWith('pc'))
            return '/image/PCS.png';

        if (id.startsWith('srv'))
            return '/image/servidor.png';

        if (id.startsWith('cam'))
            return '/image/camara_ip.png';

        if (id.startsWith('phone'))
            return '/image/telefono_voip.png';

        if (id.startsWith('printer'))
            return '/image/impresora.png';

        return '/image/PCS.png';
    }

    function addArc(
        count: number,
        prefix: string,
        label: string,
        color: string,
        angleStart: number,
        angleEnd: number,
        radius: number,
    ) {

        const total = Math.min(count, 3000);

        for (let i = 0; i < total; i++) {

            const angle =
                total === 1
                    ? (angleStart + angleEnd) / 2
                    : angleStart +
                      (i / (total - 1)) *
                      (angleEnd - angleStart);

            const rad =
                (angle * Math.PI) / 180;

            const id = `${prefix}${i}`;

            nodes.push({
                id,
                label:
                    total > 1
                        ? `${label} ${i + 1}`
                        : label,

                x:
                    cx +
                    Math.cos(rad) *
                    radius,

                y:
                    cy +
                    Math.sin(rad) *
                    radius,

                color,
            });

            edges.push({
                from: 'core',
                to: id,
            });
        }
    }

    if (pcs > 0) addArc(pcs, 'pc', 'PC', '#94a3b8', 200, 340, 120);
    if (servers > 0) addArc(servers, 'srv', 'Servidor', '#22c55e', 340, 380, 110);
    if (cameras > 0) addArc(cameras, 'cam', 'Cámara', '#f59e0b', 10, 80, 120);
    if (phones > 0) addArc(phones, 'phone', 'VoIP', '#a855f7', 90, 160, 120);
    if (printers > 0) addArc(printers, 'printer', 'Impresora', '#ef4444', 165, 195, 110);

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
                        : 15;

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
                                    ? 9
                                    : 8
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