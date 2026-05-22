import StatDisplay from '@/components/StatDisplay';
import { Monitor, Activity, Cpu, Zap } from 'lucide-react';

export default function App() {
    return (
        <div style={{ padding: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <StatDisplay label="Hosts" value={43} icon={Monitor} color="cyan" />
            <StatDisplay label="Puertos" value="57/96" icon={Activity} color="green" />
            <StatDisplay label="Switches" value={3} icon={Cpu} color="purple" />
            <StatDisplay label="BW" value={4.1} unit="Gbps" icon={Zap} color="orange" />
        </div>
    );
}