type GlowCardProps = {
    children: React.ReactNode;
    glowColor?: string;
    className?: string;
};

export default function GlowCard({
    children,
    glowColor = '#00d9ff',
    className = '',
}: GlowCardProps) {

    return (
        <div
            className={className}
            style={{
                background: '#111827',
                border: `1px solid ${glowColor}40`,
                borderRadius: '16px',
                padding: '20px',
                backdropFilter: 'blur(10px)',
                boxShadow: `0 0 20px ${glowColor}15, inset 0 0 20px ${glowColor}05`,
            }}
        >
            {children}
        </div>
    );

}