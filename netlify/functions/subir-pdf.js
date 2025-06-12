const { google } = require('googleapis');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { Resend } = require('resend'); // Importamos Resend
const { Readable } = require('stream');

// El ID de tu carpeta en Drive sigue aquí
const DRIVE_FOLDER_ID = '1X79extmU3LYUa6XIX8QzazrjtC9m-Ea8';

// Las credenciales se cargan desde una variable de entorno de Netlify
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');

// --- FUNCIÓN AUXILIAR PARA DIBUJAR TEXTO ---
const drawTextLine = (page, text, options) => {
  const { font, size = 12, color = rgb(0, 0, 0), x, y } = options;
  page.drawText(text, { x, y: y.current, size, font, color });
  y.current -= (size + 8); 
};


exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método no permitido' };
  }

  try {
    const data = JSON.parse(event.body);
    const resend = new Resend(process.env.RESEND_API_KEY); // Instanciamos Resend

    // ---- 1. GENERAR EL PDF ----
    // (El código para generar el PDF no cambia, se mantiene igual)
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 950]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    let y = { current: 900 };
    const x = 40;
    const drawLine = () => { y.current -= 8; page.drawLine({ start: { x: x, y: y.current }, end: { x: 560, y: y.current }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) }); y.current -= 20; };
    const drawSectionTitle = (title) => { drawTextLine(page, title, { font: fontBold, size: 15, color: rgb(0.13,0.55,0.13), x, y }); y.current += 5; };
    page.drawText('Acta de Sangrado', { x, y: y.current, size: 28, font: fontBold, color: rgb(0.4, 0.2, 0.8) }); y.current -= 30;
    page.drawText('Laboratorio Vet Cells', { x, y: y.current, size: 18, font, color: rgb(0.13,0.55,0.13) }); y.current -= 20;
    drawLine();
    drawSectionTitle('Datos de la Mascota');
    drawTextLine(page, `País de destino: ${data.paisDestino || ''}`, { font, x, y });
    drawTextLine(page, `Nombre: ${data.nombreMascota || ''}`, { font, x, y });
    drawTextLine(page, `Especie: ${data.especie || ''}`, { font, x, y });
    drawTextLine(page, `Raza: ${data.raza || ''}`, { font, x, y });
    drawTextLine(page, `Sexo: ${data.sexo || ''}`, { font, x, y });
    drawTextLine(page, `Color: ${data.color || ''}`, { font, x, y });
    drawTextLine(page, `Fecha de nacimiento: ${data.fechaNacimiento || ''}`, { font, x, y });
    drawTextLine(page, `Número de microchip: ${(data.microchip || []).join('')}`, { font, x, y });
    drawTextLine(page, `Estado Reproductivo: ${data.estado || ''}`, { font, x, y });
    y.current -= 5;
    drawLine();
    drawSectionTitle('Datos del Propietario');
    drawTextLine(page, `Nombre: ${data.propietario || ''}`, { font, x, y });
    drawTextLine(page, `Tipo Documento: ${data.tipoDocumento || ''}`, { font, x, y });
    drawTextLine(page, `No. Documento: ${data.documento || ''}`, { font, x, y });
    drawTextLine(page, `Email: ${data.emailPropietario || ''}`, { font, x, y });
    drawTextLine(page, `Teléfono: ${data.telefono || ''}`, { font, x, y });
    drawTextLine(page, `Dirección en Colombia: ${data.direccionColombia || ''}`, { font, x, y });
    drawTextLine(page, `Barrio: ${data.barrio || ''}`, { font, x, y });
    drawTextLine(page, `Dirección en País de Destino: ${data.direccionDestino || ''}`, { font, x, y });
    drawTextLine(page, `Teléfono en País de Destino: ${data.telefonoDestino || ''}`, { font, x, y });
    y.current -= 5;
    drawLine();
    drawSectionTitle('Datos de Vacunación Contra la Rabia');
    drawTextLine(page, `Fecha Toma de Muestra: ${data.tomaMuestra || ''}`, { font, x, y });
    drawTextLine(page, `Fecha Vacunación: ${data.vacunacion || ''}`, { font, x, y });
    drawTextLine(page, `Nombre Vacuna: ${data.nombreVacuna || ''}`, { font, x, y });
    drawTextLine(page, `Laboratorio Productor: ${data.laboratorio || ''}`, { font, x, y });
    drawTextLine(page, `Lote: ${data.numeroLote || ''}`, { font, x, y });
    y.current -= 5;
    drawLine();
    drawSectionTitle('Datos del Muestreo');
    drawTextLine(page, `Nombre Clínica: ${data.nombreClinica || ''}`, { font, x, y });
    drawTextLine(page, `Ciudad: ${data.ciudadMuestra || ''}`, { font, x, y });
    drawTextLine(page, `Profesional: ${data.profesionalMuestra || ''}`, { font, x, y });
    drawTextLine(page, `Tarjeta Profesional: ${data.tarjetaProfesional || ''}`, { font, x, y });
    drawTextLine(page, `Teléfono Profesional: ${data.telefonoProfesional || ''}`, { font, x, y });
    const pdfBytes = await pdfDoc.save();

    // ---- 2. SUBIR PDF A GOOGLE DRIVE ----
    const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/drive.file'] });
    const drive = google.drive({ version: 'v3', auth });
    const getCountryInitials = (country) => { if (!country) return 'XXX'; const words = country.split(' '); if (words.length > 1) { return (words[0][0] + words[1][0]).toUpperCase(); } return country.substring(0, 3).toUpperCase(); };
    const petName = (data.nombreMascota || 'Mascota').replace(/\s/g, '');
    const ownerName = (data.propietario || 'Propietario').replace(/\s/g, '');
    const countryInitials = getCountryInitials(data.paisDestino);
    const uniqueId = Date.now();
    const filename = `${petName}-${ownerName}-${countryInitials}-${uniqueId}.pdf`;
    const fileMetadata = { name: filename, parents: [DRIVE_FOLDER_ID] };
    const pdfBuffer = Buffer.from(pdfBytes);
    const media = { mimeType: 'application/pdf', body: Readable.from(pdfBuffer) };
    const uploaded = await drive.files.create({ resource: fileMetadata, media, fields: 'id, webViewLink' });
    const link = uploaded.data.webViewLink;

    // ---- 3. ENVIAR CORREOS CON RESEND ----
    let mailStatus = 'No se enviaron correos.';
    try {
        const fromEmail = 'onboarding@resend.dev'; // IMPORTANTE: Cambia esto a un email de tu dominio verificado, ej: 'noreply@vetcells.com'

        // --- Correo para el Propietario/Cliente ---
        if (data.emailPropietario) {
            await resend.emails.send({
                from: fromEmail,
                to: data.emailPropietario,
                subject: `Hemos recibido tu solicitud para ${data.nombreMascota}`,
                html: `<p>Hola ${data.propietario || 'cliente'},</p>
                       <p>Gracias por confiar en nosotros. Hemos recibido correctamente tu solicitud para la mascota <strong>${data.nombreMascota}</strong>.</p>
                       <p>En breve procesaremos la información.</p>
                       <p>Puedes ver una copia del acta generada aquí: <a href="${link}">Descargar PDF</a></p>
                       <br>
                       <p>Saludos,</p>
                       <p><strong>Equipo Vet Cells</strong></p>`,
            });
        }
        
        // --- Correo para el Laboratorio (interno) ---
        const emailInterno = process.env.EMAIL_TO;
        if (emailInterno) {
             await resend.emails.send({
                from: fromEmail,
                to: emailInterno,
                subject: `Nueva Acta de Sangrado - ${data.nombreMascota}`,
                html: `<p>Se ha recibido una nueva acta de sangrado para la mascota <strong>${data.nombreMascota}</strong>.</p>
                       <p>Propietario: ${data.propietario} (${data.emailPropietario})</p>
                       <p>Puedes descargar el PDF generado aquí: <a href="${link}">Descargar PDF</a></p>`,
            });
        }
        
        mailStatus = 'Correos de confirmación enviados.';

    } catch (err) {
        console.error("Error al enviar el correo con Resend:", err);
        mailStatus = 'El PDF se guardó, pero no se pudo enviar el correo de confirmación.';
    }

    // ---- 4. RESPUESTA ----
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, link, mail: mailStatus }),
    };

  } catch (error) {
    console.error("Error en la función:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, message: 'Ocurrió un error en el servidor.', error: error.message }),
    };
  }
};
