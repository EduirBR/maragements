import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart as PieIcon } from "lucide-react";

const COLORS = ["#f59e0b", "#3b82f6", "#22c55e"];

const TasksByStatusChart = ({ data = [] }) => {
    const hasData = data.some((d) => d.value > 0);

    return (
        <div className="card bg-base-100 shadow-md border border-base-200">
            <div className="card-body p-6">
                <div className="flex items-center gap-2 mb-4">
                    <PieIcon className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">
                        Tareas por estado
                    </h2>
                </div>

                {hasData ? (
                    <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    innerRadius={50}
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {data.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={COLORS[i % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-base-content/40">
                        <PieIcon className="w-12 h-12 mb-3" />
                        <p className="text-lg font-medium">Sin datos</p>
                        <p className="text-sm">
                            Crea tareas para ver la distribución
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TasksByStatusChart;
