import { Info } from "lucide-react";

function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-24 border-t border-slate-200 bg-white px-5 py-16 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-5xl text-center">

        <Info
          size={32}
          className="mx-auto mb-4 text-blue-600"
        />

        <h2 className="text-3xl font-bold text-[#102C57]">
          About Us
        </h2>

        <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
          The SKIT IoT Lab supports hands-on learning, experimentation
          and innovation in Internet of Things technologies.
        </p>

      </div>
    </section>
  );
}

export default AboutSection;