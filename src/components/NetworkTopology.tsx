type TopologyProps = {
    pcs: number;
    servers: number;
    cameras: number;
    phones: number;
    printers: number;
    switches: number;
};

type Device = {
    label: string;
    icon: string;
    color: string;
};

export default function NetworkTopology({
    pcs,
    servers,
    cameras,
    phones,
    printers,
}: TopologyProps) {

    const devices: Device[] = [];

    for (let i = 1; i <= pcs; i++) {
        devices.push({
            label: `PC ${i}`,
            icon: "🖥️",
            color: "#94a3b8"
        });
    }

    for (let i = 1; i <= servers; i++) {
        devices.push({
            label: `Servidor ${i}`,
            icon: "🗄️",
            color: "#22c55e"
        });
    }

    for (let i = 1; i <= cameras; i++) {
        devices.push({
            label: `Cam ${i}`,
            icon: "📹",
            color: "#f59e0b"
        });
    }

    for (let i = 1; i <= phones; i++) {
        devices.push({
            label: `VoIP ${i}`,
            icon: "☎️",
            color: "#a855f7"
        });
    }

    for (let i = 1; i <= printers; i++) {
        devices.push({
            label: `Imp ${i}`,
            icon: "🖨️",
            color: "#ef4444"
        });
    }

    const devicesPerSwitch = 24;

    const switchCount =
        Math.max(
            1,
            Math.ceil(
                devices.length / devicesPerSwitch
            )
        );

    const switches = Array.from(
        { length: switchCount },
        (_, i) => ({
            id: i + 1
        })
    );

    const W =
        Math.max(
            900,
            switchCount * 220
        );

    const H =
        700 +
        Math.ceil(
            devices.length / switchCount
        ) *
        26;

    const internetX = W / 2;
    const firewallX = W / 2;
    const coreX = W / 2;

    return (

        <div
            style={{
                overflowX: "auto",
                overflowY: "auto",
                maxHeight: 650
            }}
        >

            <svg
                width={W}
                height={H}
            >

                {/* Internet */}
                <text
                    x={internetX}
                    y={40}
                    textAnchor="middle"
                    fontSize="28"
                >
                    🌐
                </text>

                <text
                    x={internetX}
                    y={65}
                    textAnchor="middle"
                    fill="#00d9ff"
                    fontSize="11"
                >
                    Internet
                </text>

                {/* Firewall */}
                <line
                    x1={internetX}
                    y1={80}
                    x2={firewallX}
                    y2={120}
                    stroke="#475569"
                />

                <text
                    x={firewallX}
                    y={145}
                    textAnchor="middle"
                    fontSize="28"
                >
                    🔥
                </text>

                <text
                    x={firewallX}
                    y={170}
                    textAnchor="middle"
                    fill="#ef4444"
                    fontSize="11"
                >
                    Firewall
                </text>

                {/* Core */}
                <line
                    x1={firewallX}
                    y1={185}
                    x2={coreX}
                    y2={225}
                    stroke="#475569"
                />

                <text
                    x={coreX}
                    y={250}
                    textAnchor="middle"
                    fontSize="28"
                >
                    🔀
                </text>

                <text
                    x={coreX}
                    y={275}
                    textAnchor="middle"
                    fill="#00d9ff"
                    fontSize="11"
                >
                    Core Switch
                </text>

                {/* Switches */}
                {switches.map((sw, index) => {

                    const spacing =
                        W /
                        (switchCount + 1);

                    const x =
                        spacing *
                        (index + 1);

                    const y = 350;

                    return (
                        <g
                            key={index}
                        >

                            <line
                                x1={coreX}
                                y1={290}
                                x2={x}
                                y2={y - 25}
                                stroke="#334155"
                            />

                            <text
                                x={x}
                                y={y}
                                textAnchor="middle"
                                fontSize="24"
                            >
                                🔌
                            </text>

                            <text
                                x={x}
                                y={y + 20}
                                textAnchor="middle"
                                fill="#22c55e"
                                fontSize="10"
                            >
                                SW{sw.id}
                            </text>

                        </g>
                    );

                })}

                {/* Dispositivos */}
                {switches.map(
                    (
                        sw,
                        switchIndex
                    ) => {

                        const spacing =
                            W /
                            (switchCount + 1);

                        const switchX =
                            spacing *
                            (switchIndex + 1);

                        const start =
                            switchIndex *
                            devicesPerSwitch;

                        const end =
                            Math.min(
                                start +
                                    devicesPerSwitch,
                                devices.length
                            );

                        const group =
                            devices.slice(
                                start,
                                end
                            );

                        return group.map(
                            (
                                device,
                                deviceIndex
                            ) => {

                                const x =
                                    switchX;

                                const y =
                                    420 +
                                    deviceIndex *
                                        24;

                                return (
                                    <g
                                        key={`${switchIndex}-${deviceIndex}`}
                                    >

                                        <line
                                            x1={
                                                switchX
                                            }
                                            y1={
                                                365
                                            }
                                            x2={x}
                                            y2={
                                                y -
                                                12
                                            }
                                            stroke={
                                                device.color
                                            }
                                            strokeOpacity={
                                                0.35
                                            }
                                        />

                                        <text
                                            x={
                                                x -
                                                8
                                            }
                                            y={
                                                y +
                                                4
                                            }
                                            textAnchor="end"
                                            fontSize="12"
                                        >
                                            {
                                                device.icon
                                            }
                                        </text>

                                        <text
                                            x={
                                                x +
                                                6
                                            }
                                            y={
                                                y +
                                                4
                                            }
                                            fontSize="9"
                                            fill={
                                                device.color
                                            }
                                            fontFamily="Consolas, monospace"
                                        >
                                            {
                                                device.label
                                            }
                                        </text>

                                    </g>
                                );
                            }
                        );
                    }
                )}

            </svg>

        </div>

    );
}