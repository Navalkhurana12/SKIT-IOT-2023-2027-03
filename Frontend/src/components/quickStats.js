import { stats } from "../data/homeData";

function QuickStats() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#102C57]">
          Quick Stats
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-5">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="border-b border-slate-100 pb-4"
            >

              <Icon
                size={22}
                className="mb-3 text-blue-600"
              />

              <p className="text-2xl font-bold text-[#102C57]">
                {stat.value}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {stat.title}
              </p>

            </div>
          );
        })}

      </div>
    </div>
  );
}

export default QuickStats;