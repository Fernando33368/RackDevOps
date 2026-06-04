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
    poeSwitches24,
    poeSwitches48,
    routers,
    firewalls,
    aps,
    rackSize,
}: CostEstimatorProps) {

    const rackPrice: Record<string, number> = {
        '12U': 2800, '22U': 5200, '36U': 8500, '42U': 11000,
    };

    // cálculos automáticos
    const totalEquipos = servers + switches24 + switches48 + poeSwitches24 + poeSwitches48 + routers + firewalls + aps;
    const upsCount     = Math.max(1, Math.ceil(totalEquipos / 20));
    const patchCount   = Math.max(1, switches24 + switches48 + poeSwitches24 + poeSwitches48);
    const cablesCount  = Math.max(1, Math.ceil(totalEquipos / 10));

    const items: LineItem[] = [
        { label: 'Servidor Dell R750',     qty: servers,       unitPrice: 85000,                    color: '#22c55e' },
        { label: 'Switch 24p GbE',         qty: switches24,    unitPrice: 3400,                     color: '#00d9ff' },
        { label: 'Switch 48p GbE',         qty: switches48,    unitPrice: 6000,                     color: '#00d9ff' },
        { label: 'Switch PoE 24p',         qty: poeSwitches24, unitPrice: 6500,                     color: '#f59e0b' },
        { label: 'Switch PoE 48p',         qty: poeSwitches48, unitPrice: 13000,                    color: '#f59e0b' },
        { label: 'Router Cisco ISR 4331',  qty: routers,       unitPrice: 22000,                    color: '#3b82f6' },
        { label: 'Firewall FortiGate 60F', qty: firewalls,     unitPrice: 15000,                    color: '#ef4444' },
        { label: 'Access Point WiFi',      qty: aps,           unitPrice: 3500,                     color: '#a855f7' },
        { label: `Rack ${rackSize}`,       qty: 1,             unitPrice: rackPrice[rackSize] ?? 5200, color: '#a855f7' },
        { label: 'UPS 3000VA',             qty: upsCount,      unitPrice: 11000,                    color: '#7c3aed' },
        { label: 'Patch Panel Cat6 48p',   qty: patchCount,    unitPrice: 1100,                     color: '#64748b' },
        { label: 'Cableado estructurado',  qty: cablesCount,   unitPrice: 7500,                     color: '#64748b' },
    ].filter(item => item.qty > 0);

    const total = items.reduce((acc, item) => acc + item.qty * item.unitPrice, 0);

    function fmt(n: number) {
        return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
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
                Estimación de Costos (MXN)
            </p>

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
                    color: '#00ffff',
                }}>
                    {fmt(total)}
                </span>
            </div>

        </div>
    );
}