import { useState } from 'react'; // Paso 1: Importar useState
import logo from '../assets/logo.jpg';

const navItems = [
  { name: "Formulario", path: "/" },
  { name: "Resultados", path: "/resultados" },
  { name: "Servicios", path: "/servicios" }
];

export default function Navbar({ active, onNav }) {
  // Paso 1: Añadir estado para controlar el menú móvil
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Se añade 'flex-wrap' para envolver el menú móvil si es necesario
    <nav className="bg-white shadow flex items-center justify-between px-6 py-3 rounded-b-2xl flex-wrap">
      {/* Contenedor del Logo y Título */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="logo" className="w-10 h-10 rounded-full bg-white shadow" />
        <span className="font-bold text-2xl text-green-700">Vet Cells</span>
      </div>

      {/* Botón de Hamburguesa (visible solo en móvil) */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {/* Icono de hamburguesa o 'X' dependiendo del estado */}
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Menú de Escritorio (visible desde 'md' hacia arriba) */}
      <ul className="hidden md:flex gap-8 text-lg">
        {navItems.map((item) => (
          <li key={item.name}>
            <button
              className={
                active === item.path
                  ? "text-violet-600 font-semibold underline"
                  : "text-gray-400 hover:text-violet-700 transition"
              }
              onClick={() => onNav(item.path)}
              disabled={item.path !== "/"}>
              {item.name}
              {item.path !== "/" && <span className="ml-2 text-xs text-yellow-500">(En mantenimiento)</span>}
            </button>
          </li>
        ))}
      </ul>

      {/* Menú Móvil Desplegable (se muestra según el estado 'isOpen') */}
      {isOpen && (
        <div className="w-full md:hidden mt-4">
          <ul className="flex flex-col items-center gap-4 text-lg">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  className={
                    active === item.path
                      ? "text-violet-600 font-semibold underline"
                      : "text-gray-400 hover:text-violet-700 transition"
                  }
                  onClick={() => {
                    onNav(item.path);
                    setIsOpen(false); // Cierra el menú al hacer clic
                  }}
                  disabled={item.path !== "/"}>
                  {item.name}
                  {item.path !== "/" && <span className="ml-2 text-xs text-yellow-500">(En mantenimiento)</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}