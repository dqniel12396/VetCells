import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FormularioMascota from "./components/FormularioMascota";
import Maintenance from "./components/Maintenance";

export default function App() {
  // Sección activa: "/", "/resultados", "/servicios"
  const [section, setSection] = useState("/");

  let content;
  if (section === "/") {
    content = <FormularioMascota />;
  } else if (section === "/resultados") {
    content = <Maintenance section="Resultados" />;
  } else if (section === "/servicios") {
    content = <Maintenance section="Servicios" />;
  }

  return (
    <div className="bg-gradient-to-br from-green-100 via-white to-violet-100 min-h-screen flex flex-col">
      <Navbar active={section} onNav={setSection} />
      <main className="flex-grow flex justify-center items-start pt-10">
        <div className="w-full max-w-4xl">{content}</div>
      </main>
      <Footer />
    </div>
  );
}
