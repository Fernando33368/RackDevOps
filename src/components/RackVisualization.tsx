export type RackItem = {
    type: 'router' | 'firewall' | 'server' | 'switch' | 'poe-switch' | 'patch-panel' | 'ups';
    units: number;
    label: string;
    model?: string;
    status?: 'online' | 'offline' | 'warning';
    load?: number;
};

const colors: Record<RackItem['type'], string> = {
    router:       '#3b82f6',
    firewall:     '#ef4444',
    server:       '#22c55e',
    switch:       '#00d9ff',
    'poe-switch': '#f59e0b',
    'patch-panel':'#64748b',
    ups:          '#a855f7',
};

function StatusDot({ status }: { status?: RackItem['status'] }) {
    const c = status === 'online' ? '#22c55e' : status === 'warning' ? '#f59e0b' : '#ef4444';
    if (!status) return null;
    return (
        <div style={{
            width: 8, height: 7,
            borderRadius: '50%',
            background: c,
            boxShadow: `0 0 6px ${c}`,
            flexShrink: 0,
        }} />
    );
}

function RackUnit({ item }: { item: RackItem }) {
    const c = colors[item.type];
    const height = item.units * 28;

    return (
        <div style={{
            height,
            background: `${c}15`,
            border: `1px solid ${c}50`,
            borderLeft: `3px solid ${c}`,
            borderRadius: 4,
            padding: '4px 8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 2,
        }}>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
            }}>
                <span style={{
                    fontSize: 11,
                    fontWeight: 'bold',
                    color: c,
                    fontFamily: 'Consolas, monospace',
                }}>
                    {item.label}
                </span>
                <StatusDot status={item.status} />
            </div>

            {item.model && (
                <span style={{ fontSize: 9, color: '#475569' }}>
                    {item.model}
                </span>
            )}

            {item.load !== undefined && (
                <div style={{
                    height: 3,
                    background: '#1e293b',
                    borderRadius: 2,
                    overflow: 'hidden',
                    marginTop: 2,
                }}>
                    <div style={{
                        height: '100%',
                        width: `${item.load}%`,
                        background: item.load > 80 ? '#bb1414' : '#22c55e',
                        borderRadius: 2,
                        transition: 'width 0.5s',
                    }} />   
                </div>
            )}

        </div>
    );
}

type RackVisualizationProps = {
    items: RackItem[];
    totalUnits: number;
};

export default function RackVisualization({ items, totalUnits }: RackVisualizationProps) {
    const usedUnits = items.reduce((a, b) => a + b.units, 0);
    const freeUnits = totalUnits - usedUnits;

    return (
        <div>

            {/* encabezado */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 10,
                color: '#475569',
                marginBottom: 8,
                fontFamily: 'Consolas, monospace',
            }}>
                <span>{usedUnits}U usadas</span>
                <span>{freeUnits}U libres</span>
            </div>

            {/* slots del rack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                {items.map((item, i) => (
                    <RackUnit key={i} item={item} />
                ))}

                {/* espacio libre */}
                {freeUnits > 0 && (
                    <div style={{
                        height: freeUnits * 28,
                        border: '1px dashed #1e293b',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        color: '#334155',
                        fontFamily: 'Consolas, monospace',
                    }}>
                        {freeUnits}U disponibles
                    </div>
                )}

            </div>

        </div>
    );
}