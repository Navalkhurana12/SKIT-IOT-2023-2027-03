import Navbar from "./components/navbar";
import Hero from "./components/Hero";
import FeatureCards from "./components/FeatureCards";
import QuickStats from "./components/quickStats";
import UpcomingEvents from "./components/UpcomingEvents";
import FeaturedProjects from "./components/FeaturedProjects";
import AboutSection from "./components/AboutSection";
import InventorySection from "./components/InventorySection";
import IotLabSection from "./components/IotLabSection";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      <Navbar />

      <main>
        <Hero />

        <FeatureCards />

        {/* Dashboard Overview */}

        <section className="mx-auto max-w-[1600px] px-5 pb-12 sm:px-8 lg:px-12">

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.2fr_1.2fr]">

            <QuickStats />

            <UpcomingEvents />

            <FeaturedProjects />

          </div>

        </section>

        {/* Other Sections */}

        <AboutSection />

        <InventorySection />

        <IotLabSection />

      </main>

      <Footer />

      <section
        id="inventory"
        className="scroll-mt-24 border-t border-slate-200 bg-slate-50 px-5 py-16 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-5xl text-center">
          <Package className="mx-auto mb-4 text-blue-600" size={32} />
          <h2 className="text-3xl font-bold text-[#102C57]">Inventory</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Manage IoT components, track stock availability and monitor
            equipment issued to student projects.
          </p>
          <button
            onClick={() => alert("Inventory management coming soon!")}
            className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Open Inventory
          </button>
        </div>
      </section>

      <section
        id="iot-lab"
        className="scroll-mt-24 border-t border-slate-200 bg-white px-5 py-16 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-5xl text-center">
          <Cpu className="mx-auto mb-4 text-blue-600" size={32} />
          <h2 className="text-3xl font-bold text-[#102C57]">IoT Lab</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Explore laboratory facilities, equipment resources and
            lab activities.
          </p>
        </div>
      </section>

      {/* ================= FOOTER =================

      <footer className="bg-[#102C57] px-5 py-8 text-white sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 text-center text-xs text-blue-100 sm:flex-row sm:text-left">
          <p>
            © 2026 SKIT IoT Lab. All rights reserved.
          </p>

          <p>
            Swami Keshvanand Institute of Technology, Jaipur
          </p>

          <p className="italic text-blue-200">
            Innovating for a Smarter Tomorrow
          </p>
        </div>
      </footer> */}

    </div>
  );
}

export default App;