import logo from '../assets/logo.jpg';

const navItems = [
  { name: "Formulario", path: "/" },
  { name: "Resultados", path: "/resultados" },
  { name: "Servicios", path: "/servicios" }
];

export default function Navbar({ active, onNav }) {
  return (
    <nav className="bg-white shadow flex items-center justify-between px-6 py-3 rounded-b-2xl">
      <div className="flex items-center gap-2">
        <img src={logo} alt="logo" className="w-10 h-10 rounded-full bg-white shadow" />
        <span className="font-bold text-2xl text-green-700">Vet Cells</span>
      </div>
      <ul className="flex gap-8 text-lg">
        {navItems.map((item, idx) => (
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
    </nav>
  );
}
