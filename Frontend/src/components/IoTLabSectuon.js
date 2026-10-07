import { Cpu } from "lucide-react";

function IotLabSection() {
  return (
    <section
      id="iot-lab"
      className="scroll-mt-24 border-t border-slate-200 bg-white px-5 py-16 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-5xl text-center">

        <Cpu
          size={32}
          className="mx-auto mb-4 text-blue-600"
        />

        <h2 className="text-3xl font-bold text-[#102C57]">
          IoT Lab
        </h2>

        <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
          Explore laboratory facilities, equipment resources and
          lab activities.
        </p>

      </div>
    </section>
  );
}

export default IotLabSection;