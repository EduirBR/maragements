const StatCard = ({ label, value, icon: Icon, color }) => {
    return (
        <div className="card bg-base-100 shadow-md border border-base-200 hover:shadow-lg transition-shadow">
            <div className="card-body flex-row items-center gap-4 p-6">
                <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}
                >
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-base-content/60 text-sm font-medium">
                        {label}
                    </p>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
