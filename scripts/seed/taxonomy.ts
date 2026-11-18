/**
 * Taxonomía inicial del conocimiento.
 *
 * Formato: una rama por línea, con dos espacios de sangría por nivel.
 *   Nombre visible | slug opcional | icono opcional
 * La taxonomía también se amplía desde el CMS (Administración › Categorías) sin tocar código.
 */
export const TAXONOMY = `
Historia de la humanidad | historia | columns
  Etapas de la historia | etapas
    Origen del universo y formación de la Tierra | contexto-cosmico
    Evolución de la vida
    Evolución humana
    Prehistoria
      Paleolítico
      Mesolítico
      Neolítico
      Edad de los Metales
    Primeras sociedades agrícolas
    Primeras ciudades
    Antigüedad
    Edad Media
    Edad Moderna
    Edad Contemporánea
    Historia del siglo XXI | siglo-xxi
  Civilizaciones y culturas | civilizaciones
    Mesopotamia
    Egipto
    Grecia
    Roma
    Persia
    Fenicia
    China
    India
    Japón
    Civilización maya | maya
    Civilización azteca | azteca
    Civilización inca | inca
    Civilizaciones africanas | africanas
    Pueblos indígenas de América | pueblos-indigenas-america
    Civilizaciones europeas | europeas
    Imperios y reinos de Asia | imperios-asia
    Civilizaciones de Oceanía | oceania
  Temas históricos | temas
    Imperios
    Dinastías
    Monarquías
    Guerras
    Revoluciones
    Tratados
    Conquistas
    Migraciones
    Religiones en la historia | religiones-historia
    Descubrimientos
    Civilizaciones desaparecidas
    Arqueología
    Documentos históricos
  Personajes históricos | personajes
    Gobernantes
    Filósofos
    Inventores
    Exploradores
Universo y astronomía | universo | orbit
  Cosmología
    Origen del universo y Big Bang | big-bang
    Materia oscura
    Energía oscura
    Física del universo
  Galaxias
    Vía Láctea
  Estrellas
    Nebulosas
    Supernovas
    Agujeros negros
  Sistemas planetarios | sistemas-planetarios
    Sistema solar
    Planetas
    Planetas enanos
    Satélites naturales y lunas | lunas
    Asteroides
    Cometas
    Meteoritos
    Exoplanetas
  Constelaciones
  Exploración espacial
    Agencias espaciales
    Misiones espaciales
    Telescopios
    Astronautas
  Vida extraterrestre y astrobiología | astrobiologia
Ciencias naturales y exactas | ciencias | atom
  Biología
    Células
    Genética y ADN | genetica
    Evolución
    Microbiología
    Botánica
    Zoología
    Ecología
    Biotecnología
    Anatomía
    Fisiología
  Física
    Mecánica
    Termodinámica
    Electromagnetismo
    Óptica
    Física cuántica
    Relatividad
    Física nuclear
    Acústica
  Química
    Química orgánica
    Química inorgánica
    Tabla periódica
    Reacciones químicas
    Bioquímica
    Materiales
    Química industrial
  Geología
    Formación terrestre
    Tectónica de placas
    Minerales
    Rocas
    Volcanes
    Terremotos
    Fósiles
    Paleontología
  Matemáticas
    Aritmética
    Álgebra
    Geometría
    Trigonometría
    Cálculo
    Estadística
    Probabilidad
    Matemática aplicada
Planeta Tierra y geografía | geografia | globe
  Continentes y países | continentes
    África
    América del Norte
    América Central y el Caribe | america-central-caribe
    América del Sur
    Asia
    Europa
    Oceanía
    Antártida
  América Latina | america-latina
    Paraguay
      Historia del Paraguay | historia-paraguay
      Geografía del Paraguay | geografia-paraguay
      Cultura paraguaya | cultura-paraguaya
      Economía del Paraguay | economia-paraguay
      Lenguas del Paraguay | lenguas-paraguay
    Historia de América Latina | historia-america-latina
    Culturas latinoamericanas
    Economía latinoamericana
  Relieve y accidentes geográficos | relieve
    Montañas
    Ríos
    Lagos
    Mares y océanos | mares-oceanos
    Desiertos
    Selvas y bosques | selvas-bosques
    Glaciares
    Islas
  Clima y ecosistemas | clima
    Climas
    Ecosistemas
  Geografía humana | geografia-humana
    Población y demografía | poblacion
    Ciudades y capitales | ciudades
    Fronteras
    Recursos naturales
    Geografía económica
    Geopolítica
  Cartografía y mapas históricos | cartografia
Animales, naturaleza y biodiversidad | naturaleza | leaf
  Animales
    Mamíferos
    Aves
    Reptiles
    Anfibios
    Peces
    Insectos
    Arácnidos
    Moluscos
    Crustáceos
  Vida prehistórica | prehistorica
    Dinosaurios
    Animales prehistóricos
  Plantas
    Árboles
    Flores
  Hongos
  Microorganismos
  Conservación de la naturaleza | conservacion
Medicina y cuerpo humano | medicina | pulse
  Anatomía humana | anatomia
    Órganos
  Sistemas corporales | sistemas
    Sistema nervioso
    Sistema circulatorio
    Sistema respiratorio
    Sistema digestivo
    Sistema muscular
    Sistema óseo
  Genética humana
  Nutrición
  Fisiología humana | fisiologia
  Microbiología médica | microbiologia
  Historia de la medicina | historia
  Descubrimientos médicos | descubrimientos
  Salud pública
  Farmacología
  Glosario médico | glosario
Tecnología e informática | tecnologia | chip
  Historia de la computación | historia-computacion
  Hardware
  Software
  Sistemas operativos
  Internet y redes | internet
    Redes
    Telecomunicaciones
  Programación
  Bases de datos
  Ciberseguridad
  Robótica y automatización | robotica
  Computación cuántica
  Blockchain
  Realidad virtual y aumentada | realidad-extendida
  Impresión 3D
  Ciencia de datos
  Cloud computing
Inteligencia artificial | inteligencia-artificial | spark
  Historia de la inteligencia artificial | historia
  Fundamentos y algoritmos | fundamentos
  Machine learning
    Deep learning
    Redes neuronales
  Modelos de lenguaje (LLM) | llm
  IA generativa
  Agentes de IA
  Visión artificial
  Procesamiento del lenguaje natural | pln
  Robótica inteligente
  Ética y seguridad de la IA | etica-seguridad
  Aplicaciones de la IA | aplicaciones
    IA en la empresa | empresa
    IA en educación | educacion
    IA en medicina | medicina
    IA en las ciencias | ciencias
  Futuro de la IA | futuro
Religiones y espiritualidad | religiones | lamp
  Cristianismo
    Catolicismo
    Protestantismo
    Iglesia ortodoxa
  Judaísmo
  Islam
  Hinduismo
  Budismo
  Sijismo
  Taoísmo
  Confucianismo
  Sintoísmo
  Religiones tradicionales africanas | africanas
  Religiones indígenas | indigenas
  Religiones precolombinas | precolombinas
  Religiones del mundo antiguo | mundo-antiguo
  Mitologías antiguas | mitologias
  Nuevos movimientos religiosos | nuevos-movimientos
  Historia de las instituciones religiosas | instituciones
Filosofía | filosofia | scroll
  Filosofía antigua | antigua
  Filosofía medieval | medieval
  Filosofía moderna | moderna
  Filosofía contemporánea | contemporanea
  Ética
  Metafísica
  Epistemología
  Lógica
  Filosofía política | politica
  Filosofía de la ciencia | ciencia
  Escuelas filosóficas | escuelas
  Grandes pensadores | pensadores
Esoterismo y tradiciones místicas | esoterismo | eye
  Alquimia
  Astrología
  Hermetismo y tradiciones herméticas | hermetismo
  Cábala
  Gnosticismo
  Tarot
  Simbolismo
  Numerología
  Masonería
  Rosacrucismo
  Esoterismo occidental
  Brujería histórica
  Folclore sobrenatural
  Grimorios históricos
  Sociedades secretas
  Historia de la magia
  Tradiciones místicas
Cultura y artes | cultura | palette
  Historia del arte | historia-del-arte
    Movimientos artísticos
    Grandes obras
    Grandes artistas
  Pintura
  Escultura
  Arquitectura
  Música
  Literatura
    Poesía
  Teatro
  Cine
  Fotografía
  Danza
  Diseño y moda | diseno-moda
  Gastronomía
  Artes tradicionales
  Patrimonio cultural
  Museos y exposiciones virtuales | museos
Sociedad y humanidades | sociedad | people
  Psicología
  Sociología
  Antropología
  Política
  Derecho
  Economía política | economia-politica
  Educación
  Lingüística
  Comunicación
  Relaciones internacionales
  Demografía
  Administración pública | administracion
  Historia de las instituciones | instituciones
  Estudios culturales
  Ética social
Deportes | deportes | trophy
  Fútbol
  Baloncesto
  Tenis
  Voleibol
  Atletismo
  Natación
  Ciclismo
  Automovilismo
  Motociclismo
  Boxeo
  Artes marciales
  Rugby
  Béisbol
  Golf
  Gimnasia
  Deportes olímpicos | olimpicos
  Deportes tradicionales | tradicionales
Economía, finanzas y empresas | economia | coins
  Historia económica
  Microeconomía
  Macroeconomía
  Finanzas personales
  Finanzas corporativas
  Contabilidad y auditoría | contabilidad
  Tributación
  Bancos
  Mercados financieros | mercados
    Bolsa y acciones | bolsa
    Bonos
    Fondos de inversión
  Criptomonedas
  Comercio internacional
  Emprendimiento
  Administración de empresas | administracion
    Marketing
    Recursos humanos
    Gestión empresarial
Ingeniería y grandes inventos | ingenieria | gear
  Ingeniería civil
  Ingeniería mecánica
  Ingeniería eléctrica
  Ingeniería electrónica
  Ingeniería industrial
  Ingeniería química
  Ingeniería aeroespacial
  Ingeniería informática
  Arquitectura e infraestructuras | arquitectura
  Energías renovables
  Transporte
  Grandes inventos
  Grandes inventores
  Historia de las máquinas
Exploración y descubrimiento | exploracion | compass
  Grandes exploradores
  Expediciones
  Descubrimientos geográficos
  Exploración polar
  Exploración oceánica
  Montañismo
  Cuevas y espeleología | cuevas
  Arqueología submarina
  Exploración espacial | espacial
  Expediciones científicas
  Lugares inexplorados
`;

export const TOP_LEVEL_DESCRIPTIONS: Record<string, string> = {
  historia: "Desde los primeros homínidos hasta el siglo XXI: etapas, civilizaciones, imperios, revoluciones y los personajes que las protagonizaron.",
  universo: "El cosmos desde el Big Bang: galaxias, estrellas, planetas, agujeros negros y la exploración espacial.",
  ciencias: "Biología, física, química, geología y matemáticas: cómo funciona la naturaleza y cómo la describimos.",
  geografia: "Un atlas del planeta: continentes, países, relieve, climas, población y geopolítica, con un módulo especial sobre Paraguay y América Latina.",
  naturaleza: "La vida en la Tierra: animales, plantas, hongos, microorganismos y las especies que ya desaparecieron.",
  medicina: "El cuerpo humano, sus sistemas y la historia de la medicina. Contenido educativo, nunca consejo médico personalizado.",
  tecnologia: "De las primeras calculadoras a la nube: hardware, software, Internet, redes, robótica y computación cuántica.",
  "inteligencia-artificial": "Historia, fundamentos, aplicaciones, ética y futuro de la inteligencia artificial.",
  religiones: "Las religiones del mundo desde una perspectiva histórica, cultural y comparativa, con respeto por cada tradición.",
  filosofia: "Las grandes preguntas del pensamiento humano: escuelas, conceptos, textos y pensadores.",
  esoterismo: "Estudio histórico y antropológico de las tradiciones místicas y esotéricas, distinguiendo hechos, creencias e interpretaciones.",
  cultura: "Arte, música, literatura, cine, arquitectura, gastronomía y patrimonio cultural de la humanidad.",
  sociedad: "Psicología, sociología, antropología, derecho, política, lingüística y las ciencias que estudian la vida en común.",
  deportes: "Historia, reglas, técnicas, grandes atletas y competiciones de los deportes del mundo.",
  economia: "Cómo producimos, intercambiamos y administramos los recursos: de la historia del dinero a los mercados financieros.",
  ingenieria: "Las disciplinas que transforman ideas en máquinas, puentes y redes, y los inventos que cambiaron la humanidad.",
  exploracion: "Expediciones, exploradores y descubrimientos: de los polos a las fosas oceánicas y el espacio.",
};

export type TaxonomyNode = { name: string; slug: string; icon: string | null; children: TaxonomyNode[] };

export function parseTaxonomy(outline: string, slugify: (s: string) => string): TaxonomyNode[] {
  const roots: TaxonomyNode[] = [];
  const stack: { depth: number; node: TaxonomyNode }[] = [];
  for (const raw of outline.split("\n")) {
    if (!raw.trim()) continue;
    const indent = raw.length - raw.trimStart().length;
    if (indent % 2 !== 0) throw new Error(`Sangría impar en la taxonomía: «${raw}»`);
    const depth = indent / 2;
    const [name, slug, icon] = raw.trim().split("|").map((s) => s.trim());
    const node: TaxonomyNode = { name, slug: slug || slugify(name), icon: icon || null, children: [] };
    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
    if (depth === 0) roots.push(node);
    else {
      const parent = stack[stack.length - 1];
      if (!parent || parent.depth !== depth - 1) throw new Error(`Jerarquía inválida en «${raw}»`);
      parent.node.children.push(node);
    }
    stack.push({ depth, node });
  }
  return roots;
}
