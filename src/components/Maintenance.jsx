export default function Maintenance({ section }) {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <h2 className="text-3xl text-violet-600 font-bold mb-4">¡En mantenimiento!</h2>
      <p className="text-lg text-gray-500">La sección <b>{section}</b> estará disponible próximamente.</p>
    </div>
  );
}
