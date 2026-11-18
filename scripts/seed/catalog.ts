/**
 * Catálogo de experiencias, rutas de aprendizaje y sinónimos de búsqueda.
 *
 * Experiencias: ninguna tiene todavía un modelo 3D, panorama o fotografías con licencia
 * verificada, así que todas se cargan como «planned». `experienceType` indica el tipo
 * PREVISTO; la interfaz nunca la presenta como disponible hasta que availability = "available".
 * Coordenadas: centro aproximado del sitio.
 */
export const EXPERIENCES = [
  { slug: "piramides-de-giza", title: "Pirámides de Giza y la Gran Esfinge", summary: "Recorrido por la meseta de Giza: las pirámides de Keops, Kefrén y Micerinos y la Gran Esfinge.", experienceType: "model_3d", country: "Egipto", latitude: 29.9792, longitude: 31.1342, unescoId: "86", article: "piramides-de-giza" },
  { slug: "acropolis-de-atenas", title: "Acrópolis de Atenas y el Partenón", summary: "El Partenón, el Erecteion y los Propileos, con comparación entre el estado actual y una reconstrucción del siglo V a. C.", experienceType: "artistic_reconstruction", country: "Grecia", latitude: 37.9715, longitude: 23.7257, unescoId: "404", article: "acropolis-de-atenas" },
  { slug: "coliseo", title: "Coliseo romano", summary: "La arena, las gradas y el hipogeo del Anfiteatro Flavio.", experienceType: "model_3d", country: "Italia", latitude: 41.8902, longitude: 12.4922, unescoId: "91", article: "coliseo" },
  { slug: "pompeya", title: "Pompeya", summary: "Calles, casas y foro de la ciudad sepultada por el Vesubio en el año 79 d. C.", experienceType: "photo_tour", country: "Italia", latitude: 40.7489, longitude: 14.4848, unescoId: "829", article: null },
  { slug: "machu-picchu", title: "Machu Picchu", summary: "La ciudadela inca, sus terrazas y el Templo del Sol.", experienceType: "panorama_360", country: "Perú", latitude: -13.1631, longitude: -72.545, unescoId: "274", article: "machu-picchu" },
  { slug: "chichen-itza", title: "Chichén Itzá", summary: "La pirámide de Kukulkán, el juego de pelota y el cenote sagrado.", experienceType: "model_3d", country: "México", latitude: 20.6843, longitude: -88.5678, unescoId: "483", article: null },
  { slug: "petra", title: "Petra", summary: "La ciudad nabatea excavada en roca arenisca, con el Tesoro y el Monasterio.", experienceType: "panorama_360", country: "Jordania", latitude: 30.3285, longitude: 35.4444, unescoId: "326", article: null },
  { slug: "gran-muralla", title: "Gran Muralla China", summary: "Tramos de la muralla y su evolución a lo largo de las dinastías.", experienceType: "photo_tour", country: "China", latitude: 40.4319, longitude: 116.5704, unescoId: "438", article: null },
  { slug: "taj-mahal", title: "Taj Mahal", summary: "El mausoleo mogol de Agra y sus jardines.", experienceType: "model_3d", country: "India", latitude: 27.1751, longitude: 78.0421, unescoId: "252", article: null },
  { slug: "angkor", title: "Angkor Wat", summary: "El gran templo jemer y el complejo arqueológico de Angkor.", experienceType: "panorama_360", country: "Camboya", latitude: 13.4125, longitude: 103.867, unescoId: "668", article: null },
  { slug: "stonehenge", title: "Stonehenge", summary: "El monumento megalítico y su alineación con los solsticios.", experienceType: "simplified_model", country: "Reino Unido", latitude: 51.1789, longitude: -1.8262, unescoId: "373", article: null },
  { slug: "misiones-jesuiticas-paraguay", title: "Misiones jesuíticas de Trinidad y Jesús", summary: "Las ruinas de las reducciones de la Santísima Trinidad de Paraná y Jesús de Tavarangue, en Itapúa.", experienceType: "photo_tour", country: "Paraguay", latitude: -27.1306, longitude: -55.7039, unescoId: "648", article: "misiones-jesuiticas-de-trinidad-y-jesus" },
] as const;

export const LEARNING_PATHS = [
  {
    slug: "historia-universal-desde-cero",
    title: "Aprender historia universal desde cero",
    description: "Un recorrido en siete niveles desde la evolución humana hasta el mundo contemporáneo. Los niveles sin artículo publicado se muestran como «en preparación».",
    difficulty: "beginner" as const,
    steps: [
      { title: "Nivel 1 · Evolución humana", description: "De los primeros homininos a Homo sapiens.", article: null },
      { title: "Nivel 2 · Prehistoria", description: "La revolución neolítica y el nacimiento de la agricultura.", article: "revolucion-neolitica" },
      { title: "Nivel 3 · Primeras civilizaciones", description: "Mesopotamia: ciudades, escritura y leyes.", article: "mesopotamia" },
      { title: "Nivel 3 · Primeras civilizaciones (II)", description: "El antiguo Egipto y el valle del Nilo.", article: "antiguo-egipto" },
      { title: "Nivel 4 · Antigüedad clásica", description: "La antigua Grecia: polis, democracia y filosofía.", article: "antigua-grecia" },
      { title: "Nivel 4 · Antigüedad clásica (II)", description: "Roma: de la república al imperio.", article: "imperio-romano" },
      { title: "Nivel 5 · Edad Media", description: "Europa, el mundo islámico, Asia y América entre los siglos V y XV.", article: null },
      { title: "Nivel 6 · Edad Moderna", description: "Renacimiento, encuentro entre continentes y revolución científica.", article: "leonardo-da-vinci" },
      { title: "Nivel 7 · Edad Contemporánea", description: "Revoluciones, guerras mundiales y la era digital.", article: "historia-de-internet" },
    ],
  },
  {
    slug: "del-big-bang-a-la-vida",
    title: "Del Big Bang a la vida",
    description: "El origen del universo, la formación del sistema solar y la evolución de la vida en la Tierra.",
    difficulty: "intermediate" as const,
    steps: [
      { title: "El origen del universo", description: "Qué dice la teoría del Big Bang y cuáles son sus pruebas.", article: "big-bang" },
      { title: "Nuestro sistema solar", description: "Planetas, planetas enanos y escalas.", article: "sistema-solar" },
      { title: "Los objetos más extremos", description: "Agujeros negros y ondas gravitacionales.", article: "agujeros-negros" },
      { title: "La molécula de la vida", description: "Estructura y función del ADN.", article: "adn" },
      { title: "La evolución", description: "Selección natural y descendencia común.", article: "teoria-de-la-evolucion" },
    ],
  },
] as const;

export const SYNONYMS: { term: string; synonyms: string[] }[] = [
  { term: "faraón", synonyms: ["rey de Egipto", "faraones"] },
  { term: "Keops", synonyms: ["Jufu", "Khufu", "Gran Pirámide"] },
  { term: "Gioconda", synonyms: ["Mona Lisa"] },
  { term: "IA", synonyms: ["inteligencia artificial", "AI"] },
  { term: "internet", synonyms: ["la red", "ARPANET", "web"] },
  { term: "ADN", synonyms: ["DNA", "ácido desoxirribonucleico"] },
  { term: "evolución", synonyms: ["selección natural", "Darwin"] },
  { term: "Big Bang", synonyms: ["origen del universo", "gran explosión"] },
  { term: "agujero negro", synonyms: ["agujeros negros", "horizonte de sucesos"] },
  { term: "planetas", synonyms: ["sistema solar"] },
  { term: "Coliseo", synonyms: ["Anfiteatro Flavio", "Colosseum"] },
  { term: "Partenón", synonyms: ["Acrópolis"] },
  { term: "incas", synonyms: ["imperio inca", "Tahuantinsuyo", "Machu Picchu"] },
  { term: "jesuitas", synonyms: ["reducciones", "misiones jesuíticas"] },
  { term: "cerebro", synonyms: ["encéfalo", "neuronas"] },
  { term: "Buda", synonyms: ["budismo", "Siddhartha Gautama"] },
  { term: "Turing", synonyms: ["Enigma", "máquina de Turing"] },
];
