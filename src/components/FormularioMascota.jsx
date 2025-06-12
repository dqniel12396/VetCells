import React, { useState } from "react";

export default function FormularioMascota() {
  const [formData, setFormData] = useState({
    paisDestino: "Unión europea",
    nombreMascota: "",
    especie: "Canina",
    fechaNacimiento: "",
    microchip: Array(15).fill(""),
    propietario: "",
    emailPropietario: "",
    tomaMuestra: "",
    vacunacion: "",
    nombreVacuna: "",
    laboratorio: "",
    numeroLote: "",
    emailAdicional: "",
    historico: "Muestra tomada por primera vez",
    raza: "",
    sexo: "Macho",
    color: "",
    estado: "Entero(a)",
    documento: "",
    tipoDocumento: "CC",
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

  const [status, setStatus] = useState('idle');
  const [responseMsg, setResponseMsg] = useState('');

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
    setStatus('submitting');
    setResponseMsg('');
    try {
      const response = await fetch('/.netlify/functions/subir-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (response.ok) {
        setStatus('success');
        setResponseMsg(`¡Formulario enviado! Puede ver el PDF aquí: ${result.link}`);
      } else {
        setStatus('error');
        setResponseMsg(`Error: ${result.message || 'No se pudo enviar el formulario.'}`);
      }
    } catch(err) {
        setStatus('error');
        setResponseMsg('Error de red. Por favor, intente de nuevo.');
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto rounded-2xl bg-slate-50 p-6 md:p-10 mt-8">
      <h1 className="text-3xl md:text-4xl font-bold text-violet-700 mb-6 text-center">
        Solicitud de Acta de Sangrado <span className="block text-lg text-green-600">Laboratorio Vet Cells</span>
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* --- DATOS PARA LA SOLICITUD --- */}
        <div className="form-section">
            <h2 className="form-section-title">Datos para la Solicitud</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                    <span className="input-label">Destino</span>
                     <select name="paisDestino" value={formData.paisDestino} onChange={handleChange} className="input-main">
                        <option>Unión europea</option>
                        <option>Estados Unidos</option>
                        <option>Otro</option>
                    </select>
                </label>
                <label className="flex flex-col">
                    <span className="input-label">Histórico</span>
                     <select name="historico" value={formData.historico} onChange={handleChange} className="input-main">
                        <option>Muestra tomada por primera vez</option>
                        <option>Repetición de Failed</option>
                        <option>Otro</option>
                    </select>
                </label>
            </div>
        </div>

        {/* --- DATOS DE LA MASCOTA --- */}
        <div className="form-section">
          <h2 className="form-section-title">Datos de la Mascota</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <label className="flex flex-col">
              <span className="input-label">Nombre de la mascota *</span>
              <input type="text" name="nombreMascota" value={formData.nombreMascota} onChange={handleChange} className="input-main" required />
            </label>
            <label className="flex flex-col">
              <span className="input-label">Especie *</span>
              <select name="especie" value={formData.especie} onChange={handleChange} className="input-main">
                <option>Canina</option>
                <option>Felina</option>
                <option>Otra</option>
              </select>
            </label>
             <label className="flex flex-col">
                <span className="input-label">Raza *</span>
                <input type="text" name="raza" value={formData.raza} onChange={handleChange} className="input-main" required/>
            </label>
            <label className="flex flex-col">
              <span className="input-label">Fecha de nacimiento *</span>
              <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} className="input-main" required />
            </label>
            <label className="flex flex-col">
                <span className="input-label">Sexo *</span>
                <select name="sexo" value={formData.sexo} onChange={handleChange} className="input-main">
                    <option>Macho</option>
                    <option>Hembra</option>
                </select>
            </label>
             <label className="flex flex-col">
                <span className="input-label">Color *</span>
                <input type="text" name="color" value={formData.color} onChange={handleChange} className="input-main" required/>
            </label>
             <label className="flex flex-col">
                <span className="input-label">Estado Reproducción *</span>
                <select name="estado" value={formData.estado} onChange={handleChange} className="input-main">
                    <option>Entero(a)</option>
                    <option>Castrado(a)</option>
                </select>
            </label>
            <label className="flex flex-col md:col-span-3">
              <span className="input-label">Número de Microchip (15 dígitos) *</span>
              <div className="flex gap-1 flex-wrap">
                {formData.microchip.map((chip, idx) => (
                  <input key={idx} name={`microchip-${idx}`} type="text" value={chip} onChange={handleChange} maxLength={1}
                    className="w-8 h-10 text-center input-main" required />
                ))}
              </div>
            </label>
          </div>
        </div>

        {/* --- DATOS DEL PROPIETARIO --- */}
        <div className="form-section">
            <h2 className="form-section-title">Datos del Propietario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <label className="flex flex-col">
                    <span className="input-label">Nombre del Propietario *</span>
                    <input type="text" name="propietario" value={formData.propietario} onChange={handleChange} className="input-main" required/>
                </label>
                <label className="flex flex-col">
                    <span className="input-label">Tipo de Documento *</span>
                    <select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange} className="input-main">
                        <option>CC</option>
                        <option>CE</option>
                        <option>Pasaporte</option>
                        <option>DNI</option>
                        <option>Registro civil</option>
                        <option>Otro</option>
                    </select>
                </label>
                 <label className="flex flex-col">
                    <span className="input-label">No. Documento *</span>
                    <input type="text" name="documento" value={formData.documento} onChange={handleChange} className="input-main" required/>
                </label>
                <label className="flex flex-col">
                    <span className="input-label">Email propietario *</span>
                    <input type="email" name="emailPropietario" value={formData.emailPropietario} onChange={handleChange} className="input-main" required/>
                </label>
                <label className="flex flex-col">
                    <span className="input-label">Dirección en Colombia *</span>
                    <input type="text" name="direccionColombia" value={formData.direccionColombia} onChange={handleChange} className="input-main" required/>
                </label>
                 <label className="flex flex-col">
                    <span className="input-label">Barrio o Sector *</span>
                    <input type="text" name="barrio" value={formData.barrio} onChange={handleChange} className="input-main" required/>
                </label>
                <label className="flex flex-col">
                    <span className="input-label">Teléfono propietario *</span>
                    <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="input-main" required/>
                </label>
                <label className="flex flex-col">
                    <span className="input-label">Dirección en País de Destino</span>
                    <input type="text" name="direccionDestino" value={formData.direccionDestino} onChange={handleChange} className="input-main"/>
                </label>
                <label className="flex flex-col">
                    <span className="input-label">Teléfono en País de Destino</span>
                    <input type="tel" name="telefonoDestino" value={formData.telefonoDestino} onChange={handleChange} className="input-main"/>
                </label>
            </div>
        </div>

        {/* --- DATOS DE VACUNACIÓN --- */}
        <div className="form-section">
            <h2 className="form-section-title">Datos de Vacunación Contra la Rabia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <label className="flex flex-col">
                    <span className="input-label">Fecha toma de muestra *</span>
                    <input type="date" name="tomaMuestra" value={formData.tomaMuestra} onChange={handleChange} className="input-main" required/>
                </label>
                 <label className="flex flex-col">
                    <span className="input-label">Fecha de vacunación *</span>
                    <input type="date" name="vacunacion" value={formData.vacunacion} onChange={handleChange} className="input-main" required/>
                </label>
                 <label className="flex flex-col">
                    <span className="input-label">Nombre de la vacuna *</span>
                    <input type="text" name="nombreVacuna" value={formData.nombreVacuna} onChange={handleChange} className="input-main" required/>
                </label>
                 <label className="flex flex-col">
                    <span className="input-label">Laboratorio Productor *</span>
                    <input type="text" name="laboratorio" value={formData.laboratorio} onChange={handleChange} className="input-main" required/>
                </label>
                 <label className="flex flex-col md:col-span-2">
                    <span className="input-label">Número de lote *</span>
                    <input type="text" name="numeroLote" value={formData.numeroLote} onChange={handleChange} className="input-main" required/>
                </label>
            </div>
        </div>
        
        {/* --- DATOS DEL MUESTREO --- */}
        <div className="form-section">
            <h2 className="form-section-title">Datos del Muestreo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <label className="flex flex-col">
                    <span className="input-label">Nombre Clínica Veterinaria *</span>
                    <input type="text" name="nombreClinica" value={formData.nombreClinica} onChange={handleChange} className="input-main" required/>
                </label>
                <label className="flex flex-col">
                    <span className="input-label">Ciudad donde se toma la muestra *</span>
                    <input type="text" name="ciudadMuestra" value={formData.ciudadMuestra} onChange={handleChange} className="input-main" required/>
                </label>
                <label className="flex flex-col">
                    <span className="input-label">Profesional que toma la muestra *</span>
                    <input type="text" name="profesionalMuestra" value={formData.profesionalMuestra} onChange={handleChange} className="input-main" required/>
                </label>
                <label className="flex flex-col">
                    <span className="input-label">Tarjeta Profesional *</span>
                    <input type="text" name="tarjetaProfesional" value={formData.tarjetaProfesional} onChange={handleChange} className="input-main" required/>
                </label>
                <label className="flex flex-col md:col-span-2">
                    <span className="input-label">Teléfono profesional *</span>
                    <input type="tel" name="telefonoProfesional" value={formData.telefonoProfesional} onChange={handleChange} className="input-main" required/>
                </label>
            </div>
        </div>

        {/* --- CONSENTIMIENTO --- */}
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="consentimiento" checked={formData.consentimiento} onChange={handleChange} className="w-5 h-5 text-green-700 rounded focus:ring-green-700" required />
            <span className="text-gray-700 text-sm">Autorizo el uso de mis datos.</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="datosVeridicos" checked={formData.datosVeridicos} onChange={handleChange} className="w-5 h-5 text-violet-700 rounded focus:ring-violet-700" required />
            <span className="text-gray-700 text-sm">Confirmo que los datos son verídicos.</span>
          </label>
        </div>

        {/* --- SUBMIT --- */}
        <div className="text-center pt-4">
          <button type="submit" disabled={status === 'submitting'}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-10 rounded-xl shadow-lg text-lg transition-all duration-150 disabled:bg-gray-400">
            {status === 'submitting' ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </div>
      </form>
      
      {/* --- MENSAJE DE RESPUESTA --- */}
      {status === 'success' && <div className="mt-4 text-center p-3 rounded-lg bg-green-100 text-green-800">{responseMsg}</div>}
      {status === 'error' && <div className="mt-4 text-center p-3 rounded-lg bg-red-100 text-red-800">{responseMsg}</div>}

      <style>
        {`
        .form-section {
          @apply p-6 bg-white border-2 border-solid border-gray-300 rounded-xl shadow;
        }
        .form-section-title {
            @apply text-xl font-semibold text-green-700 mb-4;
        }
        .input-main {
          @apply w-full border-2 border-solid border-gray-400 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 bg-white placeholder-gray-400 transition;
        }
        .input-label {
          @apply text-violet-700 font-medium mb-1 text-sm;
        }
        `}
      </style>
    </section>
  );
}
