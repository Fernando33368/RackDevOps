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
    pcs, servers, cameras, phones, printers, switches
}: TopologyProps) {

    const W = 500;
    const H = 320;
    const cx = W / 2;
    const cy = H / 2;

    // nodo central: switch core
    const nodes: Node[] = [
        { id: 'core', label: 'Switch Core', x: cx, y: cy, color: '#00d9ff' },
    ];
    const edges: Edge[] = [];

    // helper para poner nodos en arco
    function addArc(
        count: number,
        prefix: string,
        label: string,
        color: string,
        angleStart: number,
        angleEnd: number,
        radius: number,
    ) {
        const total = Math.min(count, 6); // máximo 6 visibles
        for (let i = 0; i < total; i++) {
            const angle = total === 1
                ? (angleStart + angleEnd) / 2
                : angleStart + (i / (total - 1)) * (angleEnd - angleStart);
            const rad = (angle * Math.PI) / 180;
            const id = `${prefix}${i}`;
            nodes.push({
                id,
                label: total > 1 ? `${label} ${i + 1}` : label,
                x: cx + Math.cos(rad) * radius,
                y: cy + Math.sin(rad) * radius,
                color,
            });
            edges.push({ from: 'core', to: id });
        }

        // si hay más de 6, agrega nodo "...+N"
        if (count > 6) {
            const angle = angleEnd + 10;
            const rad = (angle * Math.PI) / 180;
            const id = `${prefix}_more`;
            nodes.push({
                id,
                label: `+${count - 6} más`,
                x: cx + Math.cos(rad) * radius,
                y: cy + Math.sin(rad) * radius,
                color: '#334155',
            }); 
            edges.push({ from: 'core', to: id });
        }
    }

    if (pcs > 0)      addArc(pcs,      'pc',      'PC',        '#94a3b8', 200, 340, 120);
    if (servers > 0)  addArc(servers,  'srv',     'Servidor',  '#22c55e', 340, 380,  110);
    if (cameras > 0)  addArc(cameras,  'cam',     'Cámara',    '#f59e0b',  10,  80, 120);
    if (phones > 0)   addArc(phones,   'phone',   'VoIP',      '#a855f7',  90, 160, 120);
    if (printers > 0) addArc(printers, 'printer', 'Impresora', '#ef4444', 165, 195, 110);

    // Posicision de texto de cada nodo
    function getTextAnchor(x: number) {
        if (x < cx - 20) return 'end';
        if (x > cx + 20) return 'start';
        return 'middle';
    }

    function getLabelOffset(node: Node) {
        const dy = node.y < cy ? -14 : 14;
        return dy;
    }

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: '100%', height: 'auto' }}
        >
            {/* líneas de conexión */}
            {edges.map((e, i) => {
                const from = nodes.find(n => n.id === e.from)!;
                const to   = nodes.find(n => n.id === e.to)!;
                return (
                    <line
                        key={i}
                        x1={from.x} y1={from.y}
                        x2={to.x}   y2={to.y}
                        stroke={to.color}
                        strokeWidth={1}
                        strokeOpacity={0.3}
                        strokeDasharray="4 3"
                    />
                );
            })}

            {/* nodos */}
            {nodes.map(node => (
                <g key={node.id}>
                    {/* halo */}
                    <circle
                        cx={node.x} cy={node.y}
                        r={node.id === 'core' ? 22 : 10}
                        fill={node.color}
                        fillOpacity={0.1}
                    />
                    {/* círculo principal */}
                    
                    <circle
                        cx={node.x} cy={node.y}
                        r={node.id === 'core' ? 12 : 6}
                        fill={node.color}
                        />


                    {/* label */}
                    <text
                        x={node.x}
                        y={node.y + getLabelOffset(node)}
                        textAnchor={getTextAnchor(node.x)}
                        fontSize={node.id === 'core' ? 9 : 8}
                        fill={node.color}
                        fontFamily="Consolas, monospace"
                    >
                        {node.label}
                    </text>
                </g>
            ))}
            
        </svg>

    );
}