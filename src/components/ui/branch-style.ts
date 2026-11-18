/** Estilo visual por rama principal: icono y tono de la portada tipográfica. */
const BRANCH: Record<string, { icon: string; hue: number }> = {
  historia: { icon: "columns", hue: 35 },
  universo: { icon: "orbit", hue: 225 },
  ciencias: { icon: "atom", hue: 195 },
  geografia: { icon: "globe", hue: 160 },
  naturaleza: { icon: "leaf", hue: 120 },
  medicina: { icon: "pulse", hue: 350 },
  tecnologia: { icon: "chip", hue: 210 },
  "inteligencia-artificial": { icon: "spark", hue: 260 },
  religiones: { icon: "lamp", hue: 28 },
  filosofia: { icon: "scroll", hue: 45 },
  esoterismo: { icon: "eye", hue: 285 },
  cultura: { icon: "palette", hue: 15 },
  sociedad: { icon: "people", hue: 180 },
  deportes: { icon: "trophy", hue: 140 },
  economia: { icon: "coins", hue: 50 },
  ingenieria: { icon: "gear", hue: 200 },
  exploracion: { icon: "compass", hue: 170 },
};

export function branchOf(path: string) {
  return path.split("/")[0];
}

export function branchStyle(path: string) {
  return BRANCH[branchOf(path)] ?? { icon: "book", hue: 40 };
}
