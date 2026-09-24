import { ArrowRight } from "lucide-react";
import { features } from "../data/homeData";

function FeatureCards() {

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const colors = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-emerald-100 text-emerald-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
    cyan: "bg-cyan-100 text-cyan-600",
  };

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-12">

      <div className="grid grid-cols-1 gap-5 min-[500px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

        {features.map((feature) => {

          const Icon = feature.icon;

          return (
            <button
              key={feature.id}
              onClick={() => scrollToSection(feature.id)}
              className="group flex min-h-[205px] flex-col items-start rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full ${colors[feature.color]}`}
              >
                <Icon size={23} />
              </div>

              <h3 className="text-lg font-bold text-[#102C57]">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {feature.description}
              </p>

              <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-blue-600">

                Explore

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />

              </span>

            </button>
          );
        })}

      </div>
    </section>
  );
}

export default FeatureCards;