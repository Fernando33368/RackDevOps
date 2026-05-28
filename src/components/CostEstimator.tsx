type CostEstimatorProps = {
    servers: number;
    switches24: number;
    switches48: number;
    poeSwitches: number;
    rackSize: string;
};

type LineItem = {
    label: string;
    qty: number;
    unitPrice: number;
    color: string;
};

export default function CostEstimator({
    servers,
    switches24,
    switches48,
    poeSwitches,
    rackSize,
}: CostEstimatorProps) {

    const rackPrice: Record<string, number> = {
        '12U': 150, '22U': 280, '36U': 450, '42U': 600,
    };

    const items: LineItem[] = [
        { label: 'Servidor Dell R750',     qty: servers,     unitPrice: 4500,  color: '#22c55e' },
        { label: 'Switch 24p GbE',         qty: switches24,  unitPrice: 180,   color: '#00d9ff' },
        { label: 'Switch 48p GbE',         qty: switches48,  unitPrice: 320,   color: '#00d9ff' },
        { label: 'Switch PoE 24p',         qty: poeSwitches, unitPrice: 350,   color: '#f59e0b' },
        { label: 'Router Cisco ISR 4331',  qty: 1,           unitPrice: 1200,  color: '#3b82f6' },
        { label: 'Firewall FortiGate 60F', qty: 1,           unitPrice: 800,   color: '#ef4444' },
        { label: `Rack ${rackSize}`,       qty: 1,           unitPrice: rackPrice[rackSize] ?? 280, color: '#a855f7' },
        { label: 'UPS 3000VA',             qty: 1,           unitPrice: 600,   color: '#7c3aed' },
        { label: 'Patch Panel Cat6 48p',   qty: 1,           unitPrice: 60,    color: '#64748b' },
        { label: 'Cableado estructurado',  qty: 1,           unitPrice: 400,   color: '#64748b' },
    ].filter(item => item.qty > 0);

    const total = items.reduce((acc, item) => acc + item.qty * item.unitPrice, 0);

    function fmt(n: number) {
        return n.toLocaleString('es-MX', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    }

    return (
        <div>

            <p style={{
                margin: '0 0 12px',
                fontSize: 11,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
            }}>
                Estimación de Costos
            </p>

            {/* tabla */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {items.map((item, i) => (
                    <div key={i} style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto auto',
                        gap: 8,
                        alignItems: 'center',
                        fontSize: 11,
                        padding: '5px 0',
                        borderBottom: '1px solid #1e293b',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{
                                width: 6, height: 6,
                                borderRadius: '50%',
                                background: item.color,
                                flexShrink: 0,
                            }} />
                            <span style={{ color: '#94a3b8' }}>{item.label}</span>
                        </div>
                        <span style={{ color: '#475569', textAlign: 'center' }}>
                            x{item.qty}
                        </span>
                        <span style={{ color: item.color, fontFamily: 'Consolas, monospace', textAlign: 'right' }}>
                            {fmt(item.qty * item.unitPrice)}
                        </span>
                    </div>
                ))}
            </div>

            {/* total */}
            <div style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: '1px solid #334155',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <span style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Total estimado
                </span>
                <span style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    fontFamily: 'Consolas, monospace',
                    color: '#00d9ff',
                }}>
                    {fmt(total)}
                </span>
            </div>

        </div>
    );
}