import { useState, useMemo, useEffect } from 'react';
import {
    Monitor, Server, Camera, Phone, Printer,
    Network, Cpu, Zap, HardDrive, Activity,
    Wifi, Router, Shield, Clock, Globe, Box,
    ChevronUp, ChevronDown, BarChart2,
} from 'lucide-react';

import GlowCard from '@/components/GlowCard';
import InputField from '@/components/InputField';
import StatDisplay from '@/components/StatDisplay';
import RackVisualization from '@/components/RackVisualization';
import type { RackItem } from '@/components/RackVisualization';
import NetworkTopology from '@/components/NetworkTopology';
import NetworkScene3D from '@/components/NetworkScene3D';
import CostEstimator from '@/components/CostEstimator';
import RecommendationCard from '@/components/RecommendationCard';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

// ── Spinner ──────────────────────────────────────────────────────
function Spinner({ value, onChange, min = 0, max = 9999 }: {
    value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
    return ( 
        <div style={{
            display: 'flex', alignItems: 'center',
            border: '1px solid #1e293b', borderRadius: 8,
            overflow: 'hidden', background: '#0a1018', width: 80,
        }}>
            <span style={{
                flex: 1, textAlign: 'center',
                color: 'white', fontFamily: 'Consolas, monospace', fontSize: 14, padding: '6px 0',
            }}>
                {value}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #1e293b' }}>
                <button onClick={() => onChange(Math.min(max, value + 1))} style={{
                    padding: '3px 8px', background: 'transparent', border: 'none',
                    color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center',
                }}>
                    <ChevronUp size={12} />
                </button>
                <button onClick={() => onChange(Math.max(min, value - 1))} style={{
                    padding: '3px 8px', background: 'transparent',
                    border: 'none', borderTop: '1px solid #1e293b',
                    color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center',
                }}>
                    <ChevronDown size={12} />
                </button>
            </div>
        </div>
    );
}

// ── Index ─────────────────────────────────────────────────────────
export default function index() {

    const [tab, setTab] = useState<'dispositivos' | 'infraestructura'>('infraestructura');

    const [cfg, setCfg] = useState({
    pcs: 0,
    servers: 0,
    cameras: 0,
    phones: 0,
    printers: 0,
    sw24: 0,
    sw48: 0,
    poe24: 0,
    poe48: 0,
    routers: 0,
    firewalls: 0,
    aps: 0,
});

    const set = (k: keyof typeof cfg) => (v: number) =>
        setCfg(c => ({ ...c, [k]: v }));

    const [rackSize, setRackSize] = useState<'12U' | '22U' | '36U' | '42U'>('22U');
    const projectId = localStorage.getItem("projectId");
    const navigate = useNavigate();
    const saveProject = async () => {

    try {

        await axios.put(
            `http://localhost:3000/projects/${projectId}`,
            {
                cfg,
                rackSize
            }
        );

        alert("Proyecto guardado correctamente");

    } catch (error) {

        console.error(error);

        alert("Error al guardar proyecto");

    }
};

useEffect(() => {

    const loadProject = async () => {

        if (!projectId) return;

        try {

            const res = await axios.get(
                `http://localhost:3000/projects/${projectId}`
            );

            if (!res.data) return;

            const data =
                typeof res.data.configuracion === "string"
                    ? JSON.parse(res.data.configuracion)
                    : res.data.configuracion;

            if (data?.cfg) {
                setCfg(data.cfg);
            }

            if (data?.rackSize) {
                setRackSize(data.rackSize);
            }

        } catch (error) {

            console.error(error);

        }
    };

    loadProject();

}, [projectId]);

    const rackU = parseInt(rackSize);

    // cálculos
    const totalHosts   = cfg.pcs + cfg.servers + cfg.cameras + cfg.phones + cfg.printers;
    const totalPorts   = cfg.sw24 * 24 + cfg.sw48 * 48 + cfg.poe24 * 24 + cfg.poe48 * 48;
    const usedPorts    = totalHosts + cfg.aps;
    const poeDevices   = cfg.cameras + cfg.phones;
    const poePorts     = cfg.poe24 * 24 + cfg.poe48 * 48;
    const poeWatts     = cfg.cameras * 15 + cfg.phones * 8;
    const switchCount  = cfg.sw24 + cfg.sw48 + cfg.poe24 + cfg.poe48;
    const utilPct      = totalPorts > 0 ? Math.round((usedPorts / totalPorts) * 100) : 0;
    const projected    = Math.round(totalHosts * 1.3);
    const ipsAvail     = 254 - totalHosts;
    const subnetLabel  = totalHosts <= 30 ? '/27' : totalHosts <= 62 ? '/26' : totalHosts <= 126 ? '/25' : '/24';
    const bwGbps       = (cfg.sw24 * 24 + cfg.sw48 * 48 + cfg.poe24 * 24 + cfg.poe48 * 48).toFixed(0);
    const [time]       = useState(() => new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    // rack items
    const rackItems = useMemo<RackItem[]>(() => {
        const items: RackItem[] = [];
        for (let i = 0; i < cfg.routers; i++)
            items.push({ type: 'router', units: 1, label: `Router Core ${i + 1}`, model: 'Cisco ISR 4331', status: 'online' });
        for (let i = 0; i < cfg.firewalls; i++)
            items.push({ type: 'firewall', units: 1, label: `Firewall ${i + 1}`, model: 'FortiGate 60F', status: 'online' });
        for (let i = 0; i < cfg.servers; i++)
            items.push({ type: 'server', units: 2, label: `Servidor ${i + 1}`, model: 'Dell PowerEdge R750', status: 'online', load: 45 + i * 10 });
        for (let i = 0; i < (cfg.poe24 + cfg.poe48);i++)
        for (let i = 0; i < (cfg.sw24 + cfg.sw48);i++)
            items.push({ type: 'switch', units: 1, label: `Switch GbE ${i + 1}`, status: 'online' });
        items.push({ type: 'patch-panel', units: 1, label: 'Patch Panel Cat6 48p' });
        items.push({ type: 'ups', units: 2, label: 'UPS 3000VA Online' });
        return items;
    }, [cfg]);

    const usedRackU = rackItems.reduce((a, b) => a + b.units, 0);

    // recomendaciones
    const recommendations = [
        poeDevices > 0 && {
            type: 'info' as const,
            title: 'Switches PoE requeridos',
            description: `${poeDevices} dispositivos necesitan PoE. Se recomiendan ${cfg.poe24 + cfg.poe48} switch(es) PoE+.`,
        },
        cfg.cameras > 0 && {
            type: 'tip' as const,
            title: 'NVR para cámaras IP',
            description: `Con ${cfg.cameras} cámaras considera un NVR dedicado para grabación centralizada.`,
        },
        cfg.servers >= 2 && {
            type: 'success' as const,
            title: 'Virtualización disponible',
            description: 'Con 2+ servidores puedes usar VMware o Proxmox para optimizar recursos.',
        },
        {
            type: 'warning' as const,
            title: 'Capacidad UPS',
            description: `Verifica que el UPS soporte ~${Math.round(totalHosts * 25 + cfg.servers * 400)}W de carga total.`,
        },
    ].filter(Boolean) as { type: 'info' | 'warning' | 'tip' | 'success'; title: string; description: string }[];

    // estilos reutilizables
    const label = (text: string, color = '#64748b') => (
        <p style={{ margin: '0 0 8px', fontSize: 10, color, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
            {text}
        </p>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#163257', color: 'white', fontFamily: 'system-ui, sans-serif' }}>

            {/* ── HEADER ── */}
            <header style={{
                position: 'sticky', top: 0, zIndex: 50,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 24px',
                background: 'rgba(7,17,29,0.92)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #1e2d42',
            }}>
                {/* logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Network size={16} color="#00d9ff" />
                    </div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 'bold', letterSpacing: '0.03em' }}>NetArch Simulator Pro</div>
                        <div style={{ fontSize: 9, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                            Diseño de Infraestructura de Red
                        </div>
                    </div>
                </div>

                {/* stats chips */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <StatDisplay label="Hosts"    value={totalHosts}               color="cyan"   />
                    <StatDisplay label="Puertos"  value={`${usedPorts}/${totalPorts}`} color="green"  />
                    <StatDisplay label="PoE"      value={poeDevices}               color="orange" />
                    <StatDisplay label="Switches" value={switchCount}              color="purple" />
                    <StatDisplay label="Uso"      value={`${utilPct}%`}            color={utilPct > 80 ? 'red' : 'green'} />
                    <StatDisplay label="Subred"   value={subnetLabel}              color="cyan"   />
                    <StatDisplay label="BW"       value={bwGbps} unit="Gbps"       color="cyan"   />
                    <StatDisplay label="Rack"     value={rackSize}                 color="purple" />
                </div>
                
                {/* reloj + estado */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
<button
    onClick={() => navigate("/")}
    style={{
        width: '100px',
            height: '45px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            background: '#3b82f6',
            color: 'white'
    }}
>
    Inicio
</button>

<button
    onClick={saveProject}
    style={{
        width: '100px',
            height: '45px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            background: '#22c55e',
            color: 'white'
    }}
>
    Guardar Proyecto
</button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                        <Clock size={14} />{time}
                    </div>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 12px', borderRadius: 999,
                        background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                        fontSize: 11, color: '#22c55e',
                    }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                        Sistema Activo
                    </div>
                </div>
            </header>

            {/* ── LAYOUT 3 COLUMNAS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 280px', height: 'calc(100vh - 57px)' }}>

                {/* ═══ PANEL IZQUIERDO ═══ */}
                <aside style={{
                    borderRight: '1px solid #1e2d42', overflowY: 'auto',
                    background: 'rgba(7,17,29,0.6)', padding: 16,
                    display: 'flex', flexDirection: 'column', gap: 12,
                }}>

                    {/* tabs */}
                    <div style={{
                        display: 'flex', gap: 4, padding: 4,
                        background: '#0a1018', borderRadius: 12, border: '1px solid #1e2d42',
                    }}>
                        {(['dispositivos', 'infraestructura'] as const).map(t => (
                            <button key={t} onClick={() => setTab(t)} style={{
                                flex: 1, padding: '8px 4px', borderRadius: 8, border: 'none',
                                cursor: 'pointer', fontSize: 10, textTransform: 'uppercase',
                                letterSpacing: '0.08em', fontWeight: 700, transition: 'all 0.2s',
                                background: tab === t ? '#00d9ff' : 'transparent',
                                color: tab === t ? '#060d16' : '#64748b',
                            }}>
                                {t}
                            </button>
                        ))}
                    </div>

                    {tab === 'infraestructura' ? (
                        <>
                            {/* tamaño rack */}
                            <GlowCard>
                                {label('Tamaño del Rack')}
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {(['12U', '22U', '36U', '42U'] as const).map(s => (
                                        <button key={s} onClick={() => setRackSize(s)} style={{
                                            padding: '6px 10px', borderRadius: 8, border: '1px solid',
                                            cursor: 'pointer', fontSize: 11, fontFamily: 'Consolas, monospace', fontWeight: 700,
                                            background: rackSize === s ? '#00d9ff' : '#0a1018',
                                            color: rackSize === s ? '#060d16' : '#64748b',
                                            borderColor: rackSize === s ? '#00d9ff' : '#1e2d42',
                                        }}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </GlowCard>

                            {/* switches regulares */}
                            <GlowCard glowColor="#22c55e">
                                {label('Switches Regulares', '#22c55e')}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div>
                                        {label('24 Puertos')}
                                        <Spinner value={cfg.sw24} onChange={set('sw24')} />
                                    </div>
                                    <div>
                                        {label('48 Puertos')}
                                        <Spinner value={cfg.sw48} onChange={set('sw48')} />
                                    </div>
                                </div>
                            </GlowCard>

                            {/* switches poe */}
                            <GlowCard glowColor="#f59e0b">
                                {label('Switches PoE', '#f59e0b')}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div>
                                        {label('24 Puertos')}
                                        <Spinner value={cfg.poe24} onChange={set('poe24')} />
                                    </div>
                                    <div>
                                        {label('48 Puertos')}
                                        <Spinner value={cfg.poe48} onChange={set('poe48')} />
                                    </div>
                                </div>
                            </GlowCard>

                            {/* equipos de red */}
                            <GlowCard glowColor="#3b82f6">
                                {label('Equipos de Red', '#3b82f6')}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                    <div>
                                        {label('Routers')}
                                        <Spinner value={cfg.routers} onChange={set('routers')} max={4} />
                                    </div>
                                    <div>
                                        {label('Firewalls')}
                                        <Spinner value={cfg.firewalls} onChange={set('firewalls')} max={4} />
                                    </div>
                                </div>
                                {label('Access Points WiFi', '#a855f7')}
                                <Spinner value={cfg.aps} onChange={set('aps')} />
                            </GlowCard>
                        </>
                    ) : (
                        <>
                            {[
                                { key: 'pcs',      label: 'PCs / Workstations', icon: Monitor, color: '#00d9ff' },
                                { key: 'servers',  label: 'Servidores',          icon: Server,  color: '#22c55e' },
                                { key: 'cameras',  label: 'Cámaras IP',          icon: Camera,  color: '#f59e0b' },
                                { key: 'phones',   label: 'Teléfonos VoIP',      icon: Phone,   color: '#a855f7' },
                                { key: 'printers', label: 'Impresoras',          icon: Printer, color: '#ef4444' },
                            ].map(({ key, label: lbl, icon: Icon, color }) => (
                                <GlowCard key={key} glowColor={color}>
                                    <InputField
                                        label={lbl}
                                        value={cfg[key as keyof typeof cfg]}
                                        onChange={set(key as keyof typeof cfg)}
                                        icon={Icon}
                                    />
                                </GlowCard>
                            ))}
                        </>
                    )}
                </aside>

                {/* ═══ PANEL CENTRAL ═══ */}
                <main style={{ overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16, background: '#060d16' }}>

                    {/* escena 3D */}
                    <GlowCard style={{ height: 260, padding: 0, overflow: 'hidden', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 10, left: 14, fontSize: 9, color: 'rgba(0,217,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', zIndex: 10 }}>
                            Vista 3D · Arrastra para rotar
                        </div>
                        <NetworkScene3D config={{
                            pcs: cfg.pcs, servers: cfg.servers, cameras: cfg.cameras,
                            phones: cfg.phones, printers: cfg.printers,
                            switchCount, rackUnits: rackU,
                        }} />
                    </GlowCard>

                    {/* análisis de capacidad */}
                    <GlowCard>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <Activity size={16} color="#00d9ff" />
                            <span style={{ fontSize: 13, fontWeight: 'bold' }}>Análisis de Capacidad</span>
                        </div>

                        {/* barra utilización */}
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>
                                <span>Utilización de Puertos</span>
                                <span style={{ fontFamily: 'Consolas, monospace', color: 'white' }}>
                                    {usedPorts} / {totalPorts} ({utilPct}%)
                                </span>
                            </div>
                            <div style={{ height: 8, background: '#0a1018', borderRadius: 4, overflow: 'hidden', border: '1px solid #1e2d42' }}>
                                <div style={{
                                    height: '100%', borderRadius: 4, transition: 'width 0.5s',
                                    width: `${Math.min(utilPct, 100)}%`,
                                    background: utilPct > 80
                                        ? 'linear-gradient(90deg, #ef4444, #f97316)'
                                        : 'linear-gradient(90deg, #00d9ff, #22c55e)',
                                }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#334155', marginTop: 4 }}>
                                <span>0%</span><span>50%</span><span>100%</span>
                            </div>
                        </div>

                        {/* métricas */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            {[
                                { lbl: 'HOSTS ACTUALES',  val: totalHosts,              unit: '',  color: '#00d9ff' },
                                { lbl: 'PROYECTADOS',     val: projected,               unit: '',  color: '#a855f7' },
                                { lbl: 'PUERTOS PoE',     val: `${poeDevices}/${poePorts}`, unit: '', color: '#f59e0b' },
                                { lbl: 'CONSUMO PoE',     val: poeWatts,                unit: 'W', color: '#f59e0b' },
                                { lbl: 'IPS DISPONIBLES', val: ipsAvail,                unit: '',  color: '#22c55e' },
                                { lbl: 'UNIDADES RACK',   val: `${usedRackU}/${rackU}`, unit: 'U', color: '#a855f7' },
                            ].map(({ lbl, val, unit, color }) => (
                                <div key={lbl} style={{
                                    padding: '10px 12px', borderRadius: 10,
                                    background: `${color}10`, border: `1px solid ${color}25`,
                                }}>
                                    <div style={{ fontSize: 9, color, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                                        {lbl}
                                    </div>
                                    <div style={{ fontSize: 22, fontWeight: 'bold', fontFamily: 'Consolas, monospace', color }}>
                                        {val}<span style={{ fontSize: 12, opacity: 0.6, marginLeft: 3 }}>{unit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlowCard>

                    {/* topología */}
                    <GlowCard glowColor="#22c55e">
                        {label('Topología de Red')}
                        <NetworkTopology
                            pcs={cfg.pcs} servers={cfg.servers} cameras={cfg.cameras}
                            phones={cfg.phones} printers={cfg.printers} switches={switchCount}
                        />
                    </GlowCard>

                    {/* fila inferior */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <GlowCard glowColor="#22c55e">
                           <CostEstimator
                            servers={cfg.servers}
                            switches24={cfg.sw24}
                            switches48={cfg.sw48}
                            poeSwitches24={cfg.poe24}
                            poeSwitches48={cfg.poe48}
                            rackSize={rackSize}
                            routers={cfg.routers}
                            firewalls={cfg.firewalls}
                            aps={cfg.aps}
                            />
                        </GlowCard>
                        <GlowCard glowColor="#a855f7">
                            <RecommendationCard recommendations={recommendations} />
                        </GlowCard>
                    </div>

                </main>

                {/* ═══ PANEL DERECHO — RACK ═══ */}
                <aside style={{
                    borderLeft: '1px solid #1e2d42', overflowY: 'auto',
                    background: 'rgba(7,17,29,0.6)', padding: 16,
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Box size={16} color="#22c55e" />
                            <span style={{ fontSize: 13, fontWeight: 'bold' }}>Rack {rackSize}</span>
                        </div>
                        <span style={{ fontSize: 10, color: '#475569', fontFamily: 'Consolas, monospace' }}>
                            {usedRackU}U / {rackU}
                        </span>
                    </div>
                    <RackVisualization items={rackItems} totalUnits={rackU} />
                </aside>

            </div>

        </div>
    );
}