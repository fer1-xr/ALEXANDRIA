import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Privacidad" };

export default function PrivacyPage() {
  return (
    <Container className="py-14">
      <article className="prose-alx mx-auto max-w-3xl">
        <h1 className="font-display text-5xl font-semibold">Privacidad</h1>
        <p><em>Borrador técnico pendiente de revisión legal antes del lanzamiento público.</em> Describe con exactitud lo que hace hoy la aplicación.</p>
        <h2>Qué datos guardamos</h2>
        <ul>
          <li><strong>Cuenta</strong>: nombre visible, correo electrónico y un hash de la contraseña (Argon2id). Nunca guardamos la contraseña en claro.</li>
          <li><strong>Sesión</strong>: una cookie técnica <code>httpOnly</code> con un token aleatorio. En la base de datos solo se guarda su hash, la fecha de caducidad y el agente de usuario del navegador.</li>
          <li><strong>Biblioteca personal</strong>: favoritos, colecciones, notas privadas, marcadores, historial y progreso de lectura. Solo tú puedes verlos.</li>
          <li><strong>Preferencias</strong>: tema, tamaño de letra, nivel de lectura y configuración de privacidad.</li>
        </ul>
        <h2>Qué no hacemos</h2>
        <ul>
          <li>No usamos cookies publicitarias ni de terceros, ni scripts de analítica externos.</li>
          <li>No vendemos ni cedemos datos personales.</li>
          <li>La analítica está desactivada por defecto y solo se activaría con tu consentimiento explícito en el perfil.</li>
        </ul>
        <h2>Tu control</h2>
        <ul>
          <li>Puedes desactivar el registro del historial de lectura y borrarlo en cualquier momento.</li>
          <li>Puedes eliminar tu cuenta desde el perfil: se borran también todos tus datos personales asociados.</li>
          <li>El tema y el tamaño de letra también se guardan en tu navegador (<code>localStorage</code>) para aplicarlos sin parpadeos.</li>
        </ul>
      </article>
    </Container>
  );
}
