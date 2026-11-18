import "server-only";
import nodemailer from "nodemailer";

export type Mail = { to: string; subject: string; text: string };

/**
 * Envía correo por SMTP si está configurado. Sin SMTP_HOST:
 *  - en desarrollo, escribe el mensaje en la consola del servidor (claramente marcado);
 *  - en producción, NO finge el envío: registra un error y devuelve false.
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  if (!host) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`\n[correo de desarrollo — NO enviado]\nPara: ${mail.to}\nAsunto: ${mail.subject}\n\n${mail.text}\n`);
      return true;
    }
    console.error("[mailer] SMTP_HOST no configurado: el correo no se envió.", { subject: mail.subject });
    return false;
  }
  const transport = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
  });
  try {
    await transport.sendMail({ from: process.env.MAIL_FROM ?? "ALEXANDRIA <no-reply@localhost>", ...mail });
    return true;
  } catch (err) {
    console.error("[mailer] Error al enviar:", err);
    return false;
  }
}
