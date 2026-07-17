type CostEstimatorProps = {
    pcs: number;
    servers: number;
    cameras: number;
    phones: number;
    printers: number;
    nas: number;
    cameraptz: number;
    accessPoints: number;
    antenasptp: number;
    antenasptmp: number;
    routersTopo: number;

    switches24: number;
    switches48: number;
    poeSwitches24: number;
    poeSwitches48: number;
    rackSize: string;
    routerCore: number;
    firewalls: number;
    aps: number;
};

type LineItem = {
    label: string;
    qty: number;
    unitPrice: number;
    image: string;
};

export default function CostEstimator({
    pcs,
    servers,
    cameras,
    phones,
    printers,
    nas,
    cameraptz,
    accessPoints,
    antenasptp,
    antenasptmp,
    routersTopo,
    
    switches24,
    switches48,
    poeSwitches24,
    poeSwitches48,
    rackSize,
    routerCore,
    firewalls,
    aps,

}: CostEstimatorProps) {

    const rackPrice: Record<string, number> = {
        '12U': 2800, '22U': 5200, '36U': 8500, '42U': 11000,
    };

    // cálculos automáticos
    const totalEquipos = pcs + servers + cameras + phones + cameraptz + printers + 
    nas + accessPoints + antenasptp + antenasptmp + routersTopo + switches24 + switches48 + 
    poeSwitches24 + poeSwitches48 + routerCore + firewalls + aps;
    const upsCount     = Math.max(1, Math.ceil(totalEquipos / 20));
    const patchCount   = Math.max(1, switches24 + switches48 + poeSwitches24 + poeSwitches48);
    const cablesCount  = Math.max(1, Math.ceil(totalEquipos / 10));

    const items: LineItem[] = [
        { label: 'PC / Workstation',          qty: pcs,                    unitPrice: 80000,                               image: '/image/PCS.png' },
        { label: 'Servidor Dell R750',        qty: servers,               unitPrice: 85000,                               image: '/image/servidor.png' },
        { label: 'Cámara IP',                  qty: cameras,              unitPrice: 3500,                                 image: '/image/camara_ip.png' },
        { label: 'Phone VoIP',                 qty: phones,                unitPrice: 2500,                                 image: '/image/telefono_voip.png' },
        { label: 'Cámara PTZ',                qty: cameraptz,           unitPrice: 12000,                                image: '/image/CamPTZ.png' },
        { label: 'Impresora',                    qty: printers,              unitPrice: 4000,                                 image: '/image/impresora.png' },
        { label: 'Almacenamiento NAS',     qty: nas,                    unitPrice: 8000,                               image: '/image/NAS.png' },
        { label: 'Access Point WiFi',          qty: accessPoints,         unitPrice: 3500,                                 image: '/image/access_point.png' },
        { label: 'Antena PTP',                 qty: antenasptp,          unitPrice: 7000,                               image: '/image/antPTP.png' },
        { label: 'Antena PTMP',              qty: antenasptmp,        unitPrice: 9000,                               image: '/image/antPTMP.png' },
        { label: 'Router',                        qty: routersTopo,         unitPrice: 6000,                                 image: '/image/router.png' },

        { label: 'Switch 24p GbE',            qty: switches24,           unitPrice: 3400,                                 image: '/image/switch_24p.png' },
        { label: 'Switch 48p GbE',            qty: switches48,           unitPrice: 6000,                                 image: '/image/switch_48p.png' },
        { label: 'Switch PoE 24p',            qty: poeSwitches24,       unitPrice: 6500,                                  image: '/image/switch_24p.png' },
        { label: 'Switch PoE 48p',            qty: poeSwitches48,       unitPrice: 13000,                                image: '/image/switch_48p.png' },
        { label: 'Router Cisco ISR 4331',   qty: routerCore,           unitPrice: 22000,                                image: '/image/RouterCore.png' },
        { label: 'Firewall FortiGate 60F',   qty: firewalls,              unitPrice: 15000,                                image: '/image/Firewall.png' },
        { label: 'Access Point WiFi',         qty: aps,                     unitPrice: 3500,                                  image: '/image/access_point.png' },
        { label: `Rack ${rackSize}`,         qty: 1,                        unitPrice: rackPrice[rackSize] ?? 5000,     image: '/image/rack.png' },
        { label: 'UPS 3000VA',             qty: upsCount,              unitPrice: 11000,                                image: '/image/UPS.png' },
        { label: 'Patch Panel Cat6 48p',   qty: patchCount,           unitPrice: 1100,                                  image: '/image/PATCH_PANEL.png' },
        { label: 'Cableado estructurado',  qty: cablesCount,           unitPrice: 7500,                                 image: '/image/bobina_de_cable.png' },
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
                            <img 
                                src={item.image} 
                                alt={item.label} 
                                style={{
                                    width: 40, 
                                    height: 40,
                                    borderRadius: '50%',
                                    background: item.image,
                                    flexShrink: 0,
                                }} />
                            <span style={{ color: '#94a3b8' }}>{item.label}</span> 
                        </div>
                        <span style={{ color: '#475569', textAlign: 'center' }}>
                            x{item.qty}
                        </span>
                        <span style={{ 
                            background: 'linear-gradient(to right, #00FF00, #00FFFF)', 
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontFamily: 'Consolas, monospace', 
                            textAlign: 'right' 
                            }}>
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
                <span style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>
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