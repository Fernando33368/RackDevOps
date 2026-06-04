type Recommendation = {
    type: 'info' | 'warning' | 'tip' | 'success';
    title: string;
    description: string;
};

type RecommendationCardProps = {
    recommendations: Recommendation[];
};

const styles: Record<Recommendation['type'], { color: string; bg: string}> = {
    info:    { color: '#00d9ff', bg: '#00d9ff15'},
    warning: { color: '#f59e0b', bg: '#f59e0b15'},
    tip:     { color: '#a855f7', bg: '#a855f715'},
    success: { color: '#22c55e', bg: '#22c55e15'},
};

export default function RecommendationCard({ recommendations }: RecommendationCardProps) {
    return (
        <div>

            <p style={{
                margin: '0 0 12px',
                fontSize: 11,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
            }}>
                Recomendaciones
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recommendations.map((rec, i) => {
                    const s = styles[rec.type];
                    return (
                        <div key={i} style={{
                            background: s.bg,
                            border: `1px solid ${s.color}30`,
                            borderLeft: `3px solid ${s.color}`,
                            borderRadius: 8,
                            padding: '10px 12px',
                            display: 'flex',
                            gap: 10,
                            alignItems: 'flex-start',
                        }}>
                            <span style={{ fontSize: 14, lineHeight: 1, flexShrink: 0 }}>
                            </span>
                            <div>
                                <div style={{
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                    color: s.color,
                                    marginBottom: 3,
                                }}>
                                    {rec.title}
                                </div>
                                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>
                                    {rec.description}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {recommendations.length === 0 && (
                    <div style={{ fontSize: 12, color: '#334155', textAlign: 'center', padding: 20 }}>
                        Sin recomendaciones
                    </div>
                )}
            </div>

        </div>
    );
}