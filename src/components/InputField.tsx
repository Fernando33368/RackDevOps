import type { LucideIcon } from 'lucide-react';

type InputFieldProps = {
    label: string;
    value: number;
    onChange: (value: number) => void;
    icon?: LucideIcon;
    min?: number;
    max?: number;
};

export default function InputField({
    label,
    value,
    onChange,
    icon: Icon,
    min = 0,
    max = 999,
}: InputFieldProps) {

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

            <label style={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
            }}>
                {Icon && <Icon size={14} />}
                {label}
            </label>

            <input
                type="number"
                value={value}
                min={min}
                max={max}
                onChange={e => onChange(Number(e.target.value))}
                style={{
                    background: '#1a2332',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: '#e2e8f0',
                    fontSize: 14,
                    fontFamily: 'Consolas, monospace',
                    width: '100%',
                    outline: 'none',
                    boxSizing: 'border-box',
                }}
            />

        </div>
    );

}