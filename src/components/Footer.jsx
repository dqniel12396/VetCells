export default function Footer() {
  return (
    <footer className="bg-violet-100 text-green-800 py-6 mt-12 rounded-t-2xl shadow-inner text-center text-base">
      <div>
        <b>Laboratorio Vet Cells</b> - Comprometidos con el diagnóstico veterinario <br />
        Santa Rosa de Cabal - Risaralda<br />
        📍 Carrera 15 # 17 - 60 piso 4<br />
        📞 +57 3167608561 <br />
        <span className="text-xs text-gray-500">© {new Date().getFullYear()} Vet Cells</span>
      </div>
    </footer>
  );
}
