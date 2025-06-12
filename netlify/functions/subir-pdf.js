const { google } = require('googleapis');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Cambia esto por el ID de tu carpeta en Drive
const DRIVE_FOLDER_ID = '1X79extmU3LYUa6XIX8QzazrjtC9m-Ea8';

// Carga credenciales de Google API
const credentialsPath = path.join(__dirname, 'credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método no permitido' };
  }

  // Recibe los datos del formulario
  const data = JSON.parse(event.body);

  // ---- 1. GENERAR EL PDF ----
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 750]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 700;
  const drawLine = () => {
    y -= 16;
    page.drawLine({
      start: { x: 40, y: y },
      end: { x: 560, y: y },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8)
    });
    y -= 10;
  };

  page.drawText('Acta de Sangrado', { x: 40, y: y, size: 28, font, color: rgb(0.4,0.2,0.8) });
  y -= 30;
  page.drawText('Laboratorio Vet Cells', { x: 40, y: y, size: 18, font, color: rgb(0.13,0.55,0.13) });

  drawLine();

  // --- DATOS DE LA MASCOTA ---
  page.drawText('Datos de la Mascota', { x: 40, y: y, size: 15, font, color: rgb(0.13,0.55,0.13) });
  y -= 25;
  page.drawText(`País de destino: ${data.paisDestino || ''}`, { x: 40, y: y, size: 12, font });
  y -= 20;
  page.drawText(`Nombre de la mascota: ${data.nombreMascota || ''}`, { x: 40, y: y, size: 12, font });
  y -= 20;
  page.drawText(`Especie: ${data.especie || ''}`, { x: 40, y: y, size: 12, font });
  y -= 20;
  page.drawText(`Fecha de nacimiento: ${data.fechaNacimiento || ''}`, { x: 40, y: y, size: 12, font });
  y -= 20;
  page.drawText(`Número de microchip: ${(data.microchip || []).join('')}`, { x: 40, y: y, size: 12, font });

  drawLine();

  // --- DATOS DEL PROPIETARIO ---
  page.drawText('Datos del Propietario', { x: 40, y: y, size: 15, font, color: rgb(0.13,0.55,0.13) });
  y -= 25;
  page.drawText(`Email propietario: ${data.emailPropietario || ''}`, { x: 40, y: y, size: 12, font });
  y -= 20;
  page.drawText(`Teléfono propietario: ${data.telefono || ''}`, { x: 40, y: y, size: 12, font });

  drawLine();

  // --- CONSENTIMIENTOS ---
  page.drawText('Consentimientos:', { x: 40, y: y, size: 15, font, color: rgb(0.4,0.2,0.8) });
  y -= 25;
  page.drawText(`Autoriza el uso de datos: ${data.consentimiento ? 'Sí' : 'No'}`, { x: 40, y: y, size: 12, font });
  y -= 20;
  page.drawText(`Confirma veracidad: ${data.datosVeridicos ? 'Sí' : 'No'}`, { x: 40, y: y, size: 12, font });

  // --- Puedes seguir con más campos si lo necesitas ---

  // Guarda el PDF
  const pdfBytes = await pdfDoc.save();

  // ---- 2. AUTENTICAR Y SUBIR PDF A GOOGLE DRIVE ----
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
  const drive = google.drive({ version: 'v3', auth });

  const filename = `Acta_${data.nombreMascota || 'Mascota'}_${Date.now()}.pdf`;
  const fileMetadata = {
    name: filename,
    parents: [DRIVE_FOLDER_ID],
  };
  const media = {
    mimeType: 'application/pdf',
    body: Buffer.from(pdfBytes)
  };

  const uploaded = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id, webViewLink',
  });
  const link = uploaded.data.webViewLink;

  // ---- 3. (Opcional) ENVIAR CORREO CON EL ENLACE AL PDF ----
  // Si quieres enviar un correo automático:
  let resultMail = '';
  try {
    let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // ← variable de entorno
    pass: process.env.EMAIL_PASS, // ← variable de entorno
  },
});

    await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_TO, // también variable de entorno (puedes poner varias separadas por coma)
  subject: 'Nueva Acta de Sangrado',
  text: `Se ha recibido una nueva acta.\nPuedes descargar el PDF aquí: ${link}`,
});
    resultMail = 'Correo enviado';
  } catch (err) {
    resultMail = 'No se pudo enviar el correo';
  }

  // ---- 4. RESPUESTA ----
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, link, mail: resultMail }),
  };
};
