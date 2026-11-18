/**
 * Script en línea que aplica tema y escala de lectura ANTES del primer pintado
 * (evita el destello de tema incorrecto). Lee localStorage; nunca datos del servidor.
 */
const SCRIPT = `(function(){try{var t=localStorage.getItem('alx-theme')||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');var s=parseFloat(localStorage.getItem('alx-reading-scale')||'1');if(s>=0.8&&s<=1.5)document.documentElement.style.setProperty('--reading-scale',String(s));}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
