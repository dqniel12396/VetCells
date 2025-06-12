import React, { useState } from "react";

export default function FormularioMascota() {
  const [formData, setFormData] = useState({
    paisDestino: "",
    nombreMascota: "",
    especie: "",
    fechaNacimiento: "",
    microchip: Array(15).fill(""),
    emailPropietario: "",
    tomaMuestra: "",
    vacunacion: "",
    nombreVacuna: "",
    laboratorio: "",
    numeroLote: "",
    emailAdicional: "",
    historia: "",
    raza: "",
    sexo: "",
    color: "",
    estado: "",
    documento: "",
    tipoDocumento: "",
    direccionColombia: "",
    barrio: "",
    telefono: "",
    direccionDestino: "",
    telefonoDestino: "",
    nombreClinica: "",
    ciudadMuestra: "",
    profesionalMuestra: "",
    tarjetaProfesional: "",
    telefonoProfesional: "",
    sede: "",
    consentimiento: false,
    datosVeridicos: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("microchip")) {
      const idx = Number(name.split("-")[1]);
      const arr = [...formData.microchip];
      arr[idx] = value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
      setFormData({ ...formData, microchip: arr });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await fetch('/.netlify/functions/subir-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (response.ok) {
    alert('¡Formulario enviado, PDF guardado en Drive!');
  } else {
    alert('Error al enviar.');
  }
};



  return (
    <section className="w-full mx-auto rounded-2xl bg-white/90 shadow-lg border border-violet-200 p-6 md:p-10 mt-8">
      <h1 className="text-3xl md:text-4xl font-bold text-violet-700 mb-6 text-center">
        Solicitud de Acta de Sangrado <span className="block text-lg text-green-600">Laboratorio Vet Cells</span>
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- DATOS DE LA MASCOTA --- */}
        <div>
          <h2 className="text-xl font-semibold text-green-700 mb-2">Datos de la Mascota</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-violet-700 font-medium mb-1">País de destino</span>
              <input type="text" name="paisDestino" value={formData.paisDestino} onChange={handleChange}
                className="input-main" placeholder="Ej: Colombia" required />
            </label>
            <label className="flex flex-col">
              <span className="text-violet-700 font-medium mb-1">Nombre de la mascota</span>
              <input type="text" name="nombreMascota" value={formData.nombreMascota} onChange={handleChange}
                className="input-main" placeholder="Ej: Rocky" required />
            </label>
            <label className="flex flex-col">
              <span className="text-violet-700 font-medium mb-1">Especie</span>
              <input type="text" name="especie" value={formData.especie} onChange={handleChange}
                className="input-main" placeholder="Ej: Canino" required />
            </label>
            <label className="flex flex-col">
              <span className="text-violet-700 font-medium mb-1">Fecha de nacimiento</span>
              <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange}
                className="input-main" required />
            </label>
            {/* Microchip */}
            <label className="flex flex-col md:col-span-2">
              <span className="text-violet-700 font-medium mb-1">Número de Microchip</span>
              <div className="flex gap-1">
                {formData.microchip.map((chip, idx) => (
                  <input
                    key={idx}
                    name={`microchip-${idx}`}
                    type="text"
                    value={chip}
                    onChange={handleChange}
                    maxLength={1}
                    className="w-8 h-10 text-center border border-violet-300 rounded-lg focus:ring-violet-400"
                  />
                ))}
              </div>
            </label>
          </div>
        </div>

        {/* --- DATOS DEL PROPIETARIO --- */}
        <div>
          <h2 className="text-xl font-semibold text-green-700 mb-2 mt-4">Datos del Propietario</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-violet-700 font-medium mb-1">Email propietario</span>
              <input type="email" name="emailPropietario" value={formData.emailPropietario} onChange={handleChange}
                className="input-main" placeholder="ejemplo@mail.com" required />
            </label>
            <label className="flex flex-col">
              <span className="text-violet-700 font-medium mb-1">Teléfono propietario</span>
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange}
                className="input-main" placeholder="3001234567" required />
            </label>
            {/* Puedes seguir agregando campos aquí */}
          </div>
        </div>

        {/* --- CONSENTIMIENTO --- */}
        <div className="flex flex-col md:flex-row gap-4 mt-4 items-center">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="consentimiento" checked={formData.consentimiento} onChange={handleChange}
              className="w-5 h-5 text-green-700 rounded focus:ring-green-700" required />
            <span className="text-gray-700 text-sm">Autorizo el uso de mis datos.</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="datosVeridicos" checked={formData.datosVeridicos} onChange={handleChange}
              className="w-5 h-5 text-violet-700 rounded focus:ring-violet-700" required />
            <span className="text-gray-700 text-sm">Confirmo que los datos son verídicos.</span>
          </label>
        </div>

        {/* --- SUBMIT --- */}
        <div className="text-center mt-8">
          <button
            type="submit"
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-10 rounded-xl shadow-lg text-lg transition-all duration-150"
          >
            Enviar solicitud
          </button>
        </div>
      </form>

      {/* --- ESTILOS PERSONALIZADOS TAILWIND --- */}
      <style>
        {`
        .input-main {
          @apply border border-green-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white placeholder-gray-400 transition;
        }
        `}
      </style>
    </section>
  );
}
