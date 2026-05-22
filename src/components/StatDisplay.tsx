import type { LucideIcon } from 'lucide-react';

type StatDisplayProps = {
    label: string;
    value: string | number;
    unit?: string;
    icon?: LucideIcon;
    color?: 'cyan' | 'purple' | 'green' | 'orange' | 'red';
};

const colors = {
    cyan:   '#00d9ff',
    purple: '#a855f7',
    green:  '#22c55e',
    orange: '#f59e0b',
    red:    '#ef4444',
};

export default function StatDisplay({
    label,
    value,
    unit,
    icon: Icon,
    color = 'cyan',
}: StatDisplayProps) {

    const c = colors[color];

    return (
        <div style={{
            background: '#111827',
            border: `1px solid ${c}30`,
            borderRadius: 12,
            padding: '10px 16px',
            minWidth: 90,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        }}>

            <div style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
            }}>
                {Icon && <Icon size={11} />}
                {label}
            </div>

            <div style={{
                fontSize: 20,
                fontWeight: 'bold',
                fontFamily: 'Consolas, monospace',
                color: c,
            }}>
                {value}
                {unit && (
                    <span style={{ fontSize: 11, color: '#64748b', marginLeft: 4 }}>
                        {unit}
                    </span>
                )}
            </div>

        </div>
    );

}