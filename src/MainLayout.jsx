import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main
        className="
          flex-grow
          mx-auto
          w-full
          px-4 sm:px-6 lg:px-8
          pt-8 lg:pt-24
          pb-16 lg:pb-20
          max-w-7xl
        "
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
