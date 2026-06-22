import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";

const periods = [
    { key: "day", label: "Hoy" },
    { key: "week", label: "Esta semana" },
    { key: "month", label: "30 días" },
];

const ProductivityChart = ({ data = [], period, onPeriodChange }) => {
    return (
        <div className="card bg-base-100 shadow-md border border-base-200">
            <div className="card-body p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-semibold">
                            Productividad
                        </h2>
                    </div>

                    <div className="flex gap-1 bg-base-200 rounded-lg p-1">
                        {periods.map((p) => (
                            <button
                                key={p.key}
                                onClick={() => onPeriodChange(p.key)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                                    period === p.key
                                        ? "bg-primary text-primary-content shadow-sm"
                                        : "text-base-content/60 hover:text-base-content"
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={data}>
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 10 }}
                                tickFormatter={(v) => v.slice(5)}
                            />
                            <YAxis allowDecimals={false} width={30} />
                            <Tooltip
                                labelFormatter={(v) => `Fecha: ${v}`}
                                formatter={(value) => [value, "Tareas"]}
                            />
                            <Bar
                                dataKey="count"
                                fill="#3b82f6"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-base-content/40">
                        <BarChart3 className="w-12 h-12 mb-3" />
                        <p className="text-lg font-medium">Sin datos</p>
                        <p className="text-sm">
                            Completa tareas para ver tu productividad
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductivityChart;
