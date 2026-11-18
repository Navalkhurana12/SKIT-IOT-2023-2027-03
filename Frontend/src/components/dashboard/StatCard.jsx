
export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  description,
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    cyan: "bg-cyan-50 text-cyan-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold text-[#102C57]">
            {value ?? 0}
          </h3>

          {description && (
            <p className="mt-2 text-xs text-slate-400">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              colors[color] || colors.blue
            }`}
          >
            <Icon size={25} />
          </div>
        )}
      </div>
    </div>
  );
}
