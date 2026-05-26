import { useState } from 'react';
import { Monitor, Server, Camera, Phone, Printer } from 'lucide-react';

import GlowCard from '@/components/GlowCard';
import InputField from '@/components/InputField';
import StatDisplay from '@/components/StatDisplay';
import RackVisualization from '@/components/RackVisualization';
import type { RackItem } from '@/components/RackVisualization';
import NetworkTopology from '@/components/NetworkTopology';
import NetworkScene3D from '@/components/NetworkScene3D';

export default function App() {

    const [pcs, setPcs]           = useState(10);
    const [servers, setServers]   = useState(2);
    const [cameras, setCameras]   = useState(4);
    const [phones, setPhones]     = useState(5);
    const [printers, setPrinters] = useState(2);

    // cálculos derivados
    const totalDevices = pcs + servers + cameras + phones + printers;
    const switchCount  = Math.ceil(totalDevices / 24);
    const totalPorts   = switchCount * 24;
    const poeDevices   = cameras + phones;

    // items del rack
    const rackItems: RackItem[] = [
        { type: 'router',      units: 1, label: 'Router Core',   model: 'Cisco ISR 4331', status: 'online' },
        { type: 'firewall',    units: 1, label: 'Firewall',       model: 'FortiGate 60F',  status: 'online' },
        ...Array.from({ length: Math.min(servers, 4) }, (_, i) => ({
            type: 'server' as const,
            units: 2,
            label: `Servidor ${i + 1}`,
            model: 'Dell PowerEdge R750',
            status: 'online' as const,
            load: 45 + i * 10,
        })),
        { type: 'poe-switch',  units: 1, label: 'Switch PoE',    status: 'online' },
        { type: 'switch',      units: 1, label: 'Switch GbE',     status: 'online' },
        { type: 'patch-panel', units: 1, label: 'Patch Panel 48p' },
        { type: 'ups',         units: 2, label: 'UPS 3000VA',     status: 'online' },
    ];

    return (
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* título */}
            <h1 style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 'bold',
                color: '#00d9ff',
                fontFamily: 'Consolas, monospace',
                letterSpacing: '0.05em',
            }}>
                RackDevOps
            </h1>

            {/* stats */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <StatDisplay label="Hosts"    value={totalDevices}                    icon={Monitor} color="cyan"   />
                <StatDisplay label="Puertos"  value={`${totalDevices}/${totalPorts}`} icon={Monitor} color="green"  />
                <StatDisplay label="PoE"      value={poeDevices}                      icon={Monitor} color="orange" />
                <StatDisplay label="Switches" value={switchCount}                     icon={Monitor} color="purple" />
            </div>

            {/* fila principal */}
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr 240px', gap: 20 }}>

                {/* inputs */}
                <GlowCard>
                    <p style={{ margin: '0 0 16px', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Dispositivos
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <InputField label="PCs"        value={pcs}      onChange={setPcs}      icon={Monitor} />
                        <InputField label="Servidores" value={servers}  onChange={setServers}  icon={Server}  />
                        <InputField label="Cámaras IP" value={cameras}  onChange={setCameras}  icon={Camera}  />
                        <InputField label="VoIP"       value={phones}   onChange={setPhones}   icon={Phone}   />
                        <InputField label="Impresoras" value={printers} onChange={setPrinters} icon={Printer} />
                    </div>
                </GlowCard>

                {/* topología */}
                <GlowCard>
                    <p style={{ margin: '0 0 8px', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Topología de Red
                    </p>
                    <NetworkTopology
                        pcs={pcs}
                        servers={servers}
                        cameras={cameras}
                        phones={phones}
                        printers={printers}
                        switches={switchCount}
                    />
                </GlowCard>

                {/* escena 3D */}
                <GlowCard>
                    <p style={{ margin: '0 0 8px', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Vista 3D · arrastra para rotar
                    </p>
                    <div style={{ height: 280 }}>
                        <NetworkScene3D config={{
                            pcs, servers, cameras, phones, printers,
                            switchCount,
                            rackUnits: 22,
                        }} />
                    </div>
                </GlowCard>

                {/* rack */}
                <GlowCard>
                    <p style={{ margin: '0 0 8px', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Rack 22U
                    </p>
                    <RackVisualization items={rackItems} totalUnits={22} />
                </GlowCard>

            </div>

        </div>
    );
}