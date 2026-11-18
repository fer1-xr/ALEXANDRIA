import type { SeedArticle } from "./types";

export const HISTORY_ARTICLES: SeedArticle[] = [
  {
    slug: "revolucion-neolitica",
    title: "Revolución neolítica",
    subtitle: "El paso de la caza y la recolección a la agricultura",
    summary:
      "Proceso por el que diversos grupos humanos domesticaron plantas y animales y adoptaron una vida sedentaria. Comenzó hace unos 11 500 años en el Creciente Fértil y surgió de forma independiente en otras regiones del mundo.",
    category: "historia/etapas/prehistoria/neolitico",
    alsoIn: ["historia/etapas/primeras-sociedades-agricolas"],
    entityType: "period",
    difficulty: "beginner",
    keywords: ["agricultura", "domesticación", "sedentarismo", "Creciente Fértil", "Göbekli Tepe", "Çatalhöyük"],
    facts: [
      { label: "Inicio", value: "c. 9500 a. C. en el Creciente Fértil (fechas variables según la región)" },
      { label: "Focos independientes", value: "Creciente Fértil, China, Mesoamérica, Andes, Nueva Guinea, entre otros" },
      { label: "Término acuñado por", value: "V. Gordon Childe (década de 1930)" },
    ],
    sources: ["bellwood-farmers", "zeder-2011"],
    relations: [
      { to: "mesopotamia", type: "preceded", description: "Las aldeas agrícolas del Creciente Fértil precedieron a las primeras ciudades mesopotámicas." },
    ],
    content: `
## Qué fue

Durante la mayor parte de su historia, los seres humanos vivieron de la caza, la pesca y la recolección. A partir de hace unos 11 500 años, al final de la última glaciación, algunos grupos comenzaron a cultivar plantas y a criar animales de forma sistemática. Este cambio, que el arqueólogo V. Gordon Childe llamó «revolución neolítica», no fue un acontecimiento súbito: fue un proceso de miles de años, con avances, retrocesos y situaciones intermedias.

## Dónde y cuándo

La evidencia más antigua procede del **Creciente Fértil**, el arco de tierras que va del Levante mediterráneo al sureste de Anatolia y los montes Zagros. Allí se domesticaron el trigo, la cebada, las lentejas y los guisantes, y animales como la cabra, la oveja, el cerdo y el bovino.

La agricultura surgió también **de forma independiente** en otros lugares:

- **China**: arroz en el valle del Yangtsé y mijo en el del río Amarillo.
- **Mesoamérica**: maíz, a partir del teosinte silvestre, además de calabaza y frijol.
- **Andes**: papa, quinua y la domesticación de camélidos como la llama.
- **Nueva Guinea**, el **Sahel africano** y el **este de Norteamérica**, entre otros focos.

Las fechas varían según la región y siguen revisándose a medida que la arqueología obtiene nuevas dataciones; por eso conviene leerlas como aproximaciones.

## Sitios emblemáticos

- **Göbekli Tepe** (Turquía): recinto monumental de pilares de piedra tallados, construido hacia el X milenio a. C. por comunidades que todavía no dependían plenamente de la agricultura. Su existencia sugiere que la vida ceremonial y la cooperación a gran escala pudieron preceder al cultivo.
- **Çatalhöyük** (Turquía): gran asentamiento neolítico habitado aproximadamente entre el 7100 y el 5700 a. C., con casas adosadas a las que se accedía por el techo.

## Consecuencias

La agricultura permitió producir excedentes y sostener poblaciones más grandes y sedentarias. Con el tiempo aparecieron la propiedad de la tierra, la especialización del trabajo, las desigualdades sociales y, más tarde, las primeras ciudades y estados.

El cambio también tuvo costes: muchos estudios de restos óseos muestran dietas menos variadas, más enfermedades infecciosas transmitidas por la convivencia con animales y la densidad de población, y jornadas de trabajo exigentes. El balance entre beneficios y perjuicios sigue siendo objeto de debate entre especialistas.
`,
  },
  {
    slug: "mesopotamia",
    title: "Mesopotamia",
    subtitle: "La tierra entre dos ríos",
    summary:
      "Región histórica situada entre los ríos Tigris y Éufrates, en el actual Irak y zonas vecinas. Allí surgieron algunas de las primeras ciudades y la escritura cuneiforme, y se sucedieron Sumer, Acad, Babilonia y Asiria.",
    category: "historia/civilizaciones/mesopotamia",
    alsoIn: ["historia/etapas/primeras-ciudades", "historia/etapas/antiguedad"],
    entityType: "civilization",
    difficulty: "beginner",
    keywords: ["Sumer", "Babilonia", "Asiria", "Acad", "cuneiforme", "Uruk", "Hammurabi", "zigurat", "Gilgamesh"],
    facts: [
      { label: "Ubicación", value: "Entre el Tigris y el Éufrates (actual Irak, noreste de Siria y sureste de Turquía)" },
      { label: "Escritura", value: "Cuneiforme, desde c. 3200 a. C. (Uruk)" },
      { label: "Culturas principales", value: "Sumer, Acad, Babilonia, Asiria" },
      { label: "Fin de la independencia", value: "539 a. C., conquista persa de Babilonia por Ciro II" },
    ],
    sources: ["vandemieroop-ane", "schmandt-writing"],
    relations: [
      { to: "antiguo-egipto", type: "contemporary_of", description: "Ambas civilizaciones se desarrollaron en paralelo y mantuvieron contactos comerciales y diplomáticos." },
    ],
    content: `
## Una civilización fluvial

El nombre *Mesopotamia* procede del griego y significa «entre ríos». Las crecidas del Tigris y el Éufrates eran irregulares y a veces destructivas, por lo que sus habitantes desarrollaron canales y sistemas de riego que exigían organización colectiva. Esa necesidad de coordinación se relaciona con el surgimiento de las primeras autoridades centralizadas.

## Las primeras ciudades

Hacia el IV milenio a. C., **Uruk**, en el sur, se convirtió en una de las mayores aglomeraciones urbanas del mundo. Las ciudades sumerias —Ur, Lagash, Nippur, Eridu, entre otras— eran centros políticos y religiosos organizados en torno a templos y, más tarde, a palacios. El **zigurat**, una gran plataforma escalonada coronada por un templo, es su construcción más característica.

## La invención de la escritura

Hacia el 3200 a. C. aparecen en Uruk tablillas de arcilla con signos que registraban cantidades de cereal, ganado y raciones. Esa **protoescritura** administrativa evolucionó hasta la escritura **cuneiforme**, llamada así por sus trazos en forma de cuña. Con ella se escribieron contratos, cartas, leyes, himnos y obras literarias como la **Epopeya de Gilgamesh**. El cuneiforme se usó durante unos tres mil años y sirvió para lenguas muy distintas, como el sumerio y el acadio.

## Imperios sucesivos

- **Acad**: Sargón de Acad (siglo XXIV a. C.) creó uno de los primeros estados que dominó varias ciudades-estado.
- **Babilonia**: bajo **Hammurabi** (siglo XVIII a. C.) se promulgó el conocido código de leyes grabado en una estela de basalto, que hoy se conserva en el Museo del Louvre.
- **Asiria**: potencia militar del norte que alcanzó su máxima extensión entre los siglos IX y VII a. C.
- **Imperio neobabilónico**: con Nabucodonosor II, Babilonia vivió un nuevo esplendor, hasta su conquista por el persa Ciro II en el 539 a. C.

## Legado

Mesopotamia aportó la escritura, algunas de las primeras leyes escritas, avances en astronomía y matemáticas —el sistema sexagesimal que aún usamos para medir el tiempo y los ángulos— y modelos de organización urbana que influyeron en todo el Próximo Oriente antiguo.
`,
  },
  {
    slug: "antiguo-egipto",
    title: "Antiguo Egipto",
    subtitle: "Tres milenios de civilización a orillas del Nilo",
    summary:
      "Civilización que se desarrolló en el valle y el delta del Nilo desde la unificación del país, hacia el 3100 a. C., hasta la conquista romana en el 30 a. C. Es célebre por sus faraones, sus pirámides, su escritura jeroglífica y su compleja religión.",
    category: "historia/civilizaciones/egipto",
    alsoIn: ["historia/etapas/antiguedad"],
    entityType: "civilization",
    difficulty: "beginner",
    keywords: ["faraones", "Nilo", "jeroglíficos", "Tutankamón", "Ramsés II", "Hatshepsut", "Menfis", "Tebas", "Piedra de Rosetta"],
    facts: [
      { label: "Período", value: "c. 3100 a. C. – 30 a. C." },
      { label: "Capitales", value: "Menfis, Tebas, Alejandría (entre otras, según la época)" },
      { label: "Escrituras", value: "Jeroglífica, hierática y demótica" },
      { label: "Fin", value: "Conquista romana tras la muerte de Cleopatra VII (30 a. C.)" },
    ],
    sources: ["shaw-egypt"],
    relations: [
      { to: "antigua-grecia", type: "influenced", description: "Viajeros griegos como Heródoto describieron Egipto, y la dinastía ptolemaica fue de origen macedonio." },
    ],
    content: `
## El don del Nilo

El historiador griego Heródoto describió Egipto como «un don del Nilo». Cada año, la crecida del río depositaba limo fértil a lo largo de una estrecha franja de tierra en medio del desierto. El calendario agrícola egipcio se organizaba en tres estaciones ligadas al río: la inundación, la siembra y la cosecha.

## Grandes etapas

Los egiptólogos dividen la historia egipcia en períodos. Las fechas son aproximadas, sobre todo para las épocas más antiguas, y varían ligeramente según la cronología que se adopte.

| Período | Fechas aproximadas | Rasgos principales |
|---|---|---|
| Período Dinástico Temprano | c. 3100 – 2686 a. C. | Unificación del Alto y el Bajo Egipto |
| Reino Antiguo | c. 2686 – 2181 a. C. | Época de las grandes pirámides |
| Reino Medio | c. 2055 – 1650 a. C. | Reunificación, florecimiento literario |
| Reino Nuevo | c. 1550 – 1069 a. C. | Expansión imperial; Hatshepsut, Akenatón, Tutankamón, Ramsés II |
| Período Tardío | c. 664 – 332 a. C. | Dominios extranjeros alternados con dinastías locales |
| Período ptolemaico | 332 – 30 a. C. | Dinastía de origen macedonio fundada tras Alejandro Magno |

Entre estas etapas hubo **períodos intermedios** de fragmentación política.

## El faraón y la religión

El faraón era considerado intermediario entre los dioses y los seres humanos y garante de la **maat**, el orden cósmico y social. La religión era politeísta e incluía divinidades como Ra, Osiris, Isis, Horus, Amón y Anubis. Durante el reinado de **Akenatón** (siglo XIV a. C.) se promovió el culto casi exclusivo al disco solar Atón, una reforma que fue abandonada tras su muerte.

La creencia en la vida después de la muerte explica la momificación y la riqueza de las tumbas, como la de **Tutankamón**, descubierta casi intacta por Howard Carter en 1922 en el Valle de los Reyes.

## La escritura

Los egipcios usaron la escritura **jeroglífica** para inscripciones monumentales y la **hierática**, más cursiva, para documentos cotidianos; más tarde apareció la **demótica**. El desciframiento moderno fue posible gracias a la **Piedra de Rosetta**, que contiene un mismo decreto en jeroglífico, demótico y griego. Jean-François Champollion presentó la clave del sistema en 1822.

## Legado

El antiguo Egipto dejó avances en arquitectura, medicina, matemáticas aplicadas y administración, además de un patrimonio monumental que sigue estudiándose. La egiptología moderna combina arqueología, filología y ciencias como el análisis de ADN antiguo para revisar continuamente lo que sabemos.
`,
  },
  {
    slug: "piramides-de-giza",
    title: "Pirámides de Giza",
    subtitle: "Las tumbas monumentales de Keops, Kefrén y Micerinos",
    summary:
      "Conjunto funerario de la IV dinastía egipcia, construido hacia el siglo XXVI a. C. en la meseta de Giza, junto a la actual El Cairo. La Gran Pirámide de Keops es la única de las siete maravillas del mundo antiguo que se conserva.",
    category: "historia/civilizaciones/egipto",
    alsoIn: ["cultura/arquitectura", "cultura/patrimonio-cultural"],
    entityType: "monument",
    difficulty: "beginner",
    keywords: ["Keops", "Kefrén", "Micerinos", "Gran Pirámide", "Esfinge", "Reino Antiguo", "maravillas del mundo antiguo"],
    facts: [
      { label: "Construcción", value: "IV dinastía, c. 2600 – 2500 a. C." },
      { label: "Gran Pirámide", value: "Altura original c. 146 m; actual c. 138 m; lado de la base c. 230 m" },
      { label: "Patrimonio Mundial", value: "UNESCO, 1979 (Menfis y su necrópolis)" },
      { label: "Ubicación", value: "Meseta de Giza, Egipto" },
    ],
    sources: ["lehner-pyramids", "unesco-86", "shaw-egypt"],
    relations: [
      { to: "antiguo-egipto", type: "part_of" },
    ],
    content: `
## Tres pirámides y una esfinge

En la meseta de Giza se levantan las pirámides de tres faraones de la IV dinastía: **Keops** (Jufu), su hijo **Kefrén** (Jafra) y **Micerinos** (Menkaura). Cada pirámide formaba parte de un complejo con templos, calzadas procesionales y pirámides menores para reinas. La **Gran Esfinge**, con cuerpo de león y cabeza humana, suele asociarse al complejo de Kefrén.

## La Gran Pirámide

La pirámide de Keops medía originalmente unos 146 metros de altura; hoy alcanza unos 138 metros porque perdió su revestimiento exterior de piedra caliza blanca y su vértice. Fue la construcción humana más alta durante milenios. Su base, casi un cuadrado perfecto de unos 230 metros de lado, está orientada con notable precisión hacia los puntos cardinales.

En su interior hay varias cámaras y corredores, entre ellos la llamada **Gran Galería** y la **Cámara del Rey**, de granito.

## ¿Quiénes las construyeron?

Una idea popular sostiene que las pirámides fueron levantadas por esclavos. La arqueología apunta a otra realidad: las excavaciones de un **poblado de trabajadores** al sur de la meseta revelaron panaderías, viviendas y restos de una dieta con abundante carne, lo que indica una fuerza laboral organizada y abastecida por el Estado. Además, los papiros hallados en Wadi el-Jarf, conocidos como el **diario de Merer**, describen el transporte de bloques de caliza desde las canteras de Tura en tiempos de Keops.

## Cómo se construyeron: lo que se sabe y lo que se debate

Se sabe que se emplearon herramientas de cobre y piedra, trineos y una gran capacidad de planificación. El método exacto para elevar los bloques —rampas rectas, en espiral, internas o combinaciones— **sigue siendo objeto de debate** entre especialistas. Las teorías que atribuyen las pirámides a civilizaciones perdidas o a intervenciones extraterrestres no cuentan con respaldo arqueológico.

## Experiencia 3D

ALEXANDRIA prevé una visita a Giza en la sección *Explora el mundo en 3D*. Mientras no se incorpore un modelo con licencia verificada, la ficha de la experiencia indica su estado real («planificada») en lugar de simularla.
`,
  },
  {
    slug: "antigua-grecia",
    title: "Antigua Grecia",
    subtitle: "Polis, democracia, filosofía y teatro",
    summary:
      "Civilización desarrollada en el Egeo y el Mediterráneo oriental entre el II milenio a. C. y la conquista romana. Organizada en ciudades-estado como Atenas y Esparta, legó la filosofía, el teatro, la democracia ateniense y modelos artísticos que influyeron en toda la cultura occidental.",
    category: "historia/civilizaciones/grecia",
    alsoIn: ["historia/etapas/antiguedad", "filosofia/antigua"],
    entityType: "civilization",
    difficulty: "beginner",
    keywords: ["polis", "Atenas", "Esparta", "democracia", "Pericles", "Sócrates", "Platón", "Aristóteles", "Alejandro Magno", "helenismo"],
    facts: [
      { label: "Período clásico", value: "c. 480 – 323 a. C." },
      { label: "Reformas de Clístenes", value: "508/507 a. C. (base de la democracia ateniense)" },
      { label: "Período helenístico", value: "323 – 31 a. C." },
      { label: "Conquista romana", value: "Gradual; hito simbólico: destrucción de Corinto en el 146 a. C." },
    ],
    sources: ["pomeroy-greece"],
    relations: [
      { to: "imperio-romano", type: "influenced", description: "Roma asimiló buena parte del arte, la literatura y la filosofía griegas." },
    ],
    content: `
## Un mundo de ciudades-estado

La Grecia antigua no fue un Estado unificado, sino un mosaico de **poleis** (ciudades-estado) independientes que compartían lengua, religión y grandes celebraciones como los **Juegos Olímpicos**, cuya fecha tradicional de inicio es el 776 a. C. Cada polis tenía sus propias leyes y formas de gobierno: monarquías, oligarquías, tiranías y, en Atenas, una democracia directa.

## Etapas principales

- **Edad del Bronce egea** (II milenio a. C.): civilizaciones minoica, en Creta, y micénica, en el continente.
- **«Edad Oscura»** (c. 1100 – 800 a. C.): declive de los palacios y pérdida de la escritura lineal B.
- **Época arcaica** (c. 800 – 480 a. C.): adopción del alfabeto, colonización mediterránea y nacimiento de la polis.
- **Época clásica** (c. 480 – 323 a. C.): guerras médicas contra Persia, apogeo de Atenas y guerra del Peloponeso.
- **Época helenística** (323 – 31 a. C.): tras las conquistas de Alejandro Magno, la cultura griega se extiende hasta Egipto y Asia central.

## La democracia ateniense

Las reformas de **Clístenes** (508/507 a. C.) sentaron las bases de un sistema en el que los ciudadanos varones adultos participaban directamente en la Asamblea, y muchos cargos se asignaban por sorteo. Era una democracia limitada: excluía a las mujeres, a los esclavos y a los extranjeros residentes (metecos).

## Filosofía, ciencia y artes

Grecia fue cuna de una reflexión sistemática sobre la naturaleza, el conocimiento y la ética: los presocráticos, **Sócrates**, **Platón** y **Aristóteles**. También desarrolló la historiografía (Heródoto, Tucídides), la tragedia y la comedia (Esquilo, Sófocles, Eurípides, Aristófanes), la geometría deductiva y la medicina hipocrática.

## Legado

A través de Roma, de Bizancio y de los traductores del mundo islámico, el pensamiento griego llegó a la Europa medieval y renacentista. Muchos conceptos políticos y científicos actuales —y palabras como *democracia*, *filosofía* o *teatro*— tienen raíces griegas.
`,
  },
  {
    slug: "acropolis-de-atenas",
    title: "Acrópolis de Atenas",
    subtitle: "El Partenón y los monumentos de la colina sagrada",
    summary:
      "Colina rocosa que domina Atenas y alberga algunos de los monumentos más influyentes de la arquitectura clásica, como el Partenón, el Erecteion, los Propileos y el templo de Atenea Niké, levantados en su mayoría en el siglo V a. C.",
    category: "historia/civilizaciones/grecia",
    alsoIn: ["cultura/arquitectura", "cultura/patrimonio-cultural"],
    entityType: "monument",
    difficulty: "beginner",
    keywords: ["Partenón", "Pericles", "Fidias", "Ictino", "Calícrates", "Erecteion", "Propileos", "Atenea"],
    facts: [
      { label: "Partenón", value: "Construido entre 447 y 432 a. C." },
      { label: "Arquitectos", value: "Ictino y Calícrates; supervisión escultórica de Fidias" },
      { label: "Dedicado a", value: "Atenea Pártenos" },
      { label: "Patrimonio Mundial", value: "UNESCO, 1987" },
    ],
    notices: ["contested"],
    sources: ["unesco-404", "pomeroy-greece"],
    relations: [{ to: "antigua-grecia", type: "part_of" }],
    content: `
## La colina sagrada

*Acrópolis* significa «ciudad alta». La de Atenas fue fortaleza, santuario y símbolo cívico. Tras la destrucción causada por los persas en el 480 a. C., el político **Pericles** impulsó a mediados del siglo V a. C. un ambicioso programa de reconstrucción financiado en parte con los recursos de la Liga de Delos.

## El Partenón

El **Partenón**, dedicado a Atenea Pártenos, se construyó entre el 447 y el 432 a. C. Los arquitectos **Ictino** y **Calícrates** dirigieron la obra, y el escultor **Fidias** supervisó la decoración, que incluía frontones, metopas y un friso continuo. En su interior se alzaba una colosal estatua de Atenea en oro y marfil, hoy perdida.

Su aparente perfección geométrica esconde **refinamientos ópticos**: las columnas se ensanchan ligeramente en el centro (*éntasis*) y la plataforma se curva hacia arriba, correcciones que compensan ilusiones visuales.

## Otros monumentos

- **Propileos**: la entrada monumental.
- **Templo de Atenea Niké**: pequeño templo jónico.
- **Erecteion**: templo con el célebre pórtico de las **cariátides**.

## Una historia accidentada

El Partenón fue templo, iglesia, mezquita y polvorín. En 1687, durante un asedio veneciano, una explosión de la pólvora almacenada por la guarnición otomana destruyó gran parte del edificio. A comienzos del siglo XIX, agentes de lord Elgin retiraron numerosas esculturas que hoy se conservan en el Museo Británico. Grecia reclama su devolución; el Museo Británico sostiene la legalidad de su adquisición. **La cuestión sigue siendo objeto de debate** político, jurídico y académico.

## Experiencia 3D

La Acrópolis figura entre las experiencias previstas de *Explora el mundo en 3D*. Su ficha indica el tipo de experiencia y su estado real hasta que se incorpore un modelo con permisos de uso verificados.
`,
  },
  {
    slug: "imperio-romano",
    title: "Imperio romano",
    subtitle: "De Augusto a la caída de Occidente",
    summary:
      "Etapa de la historia de Roma iniciada cuando Augusto asumió el poder en el 27 a. C. En su máxima extensión, bajo Trajano, abarcaba todo el Mediterráneo. La parte occidental desapareció en el 476 d. C.; la oriental, conocida como Imperio bizantino, perduró hasta 1453.",
    category: "historia/civilizaciones/roma",
    alsoIn: ["historia/etapas/antiguedad", "historia/temas/imperios"],
    entityType: "civilization",
    difficulty: "intermediate",
    keywords: ["Augusto", "Trajano", "Constantino", "república romana", "derecho romano", "latín", "Bizancio", "Julio César"],
    facts: [
      { label: "Fundación de Roma (tradicional)", value: "753 a. C." },
      { label: "Inicio del Imperio", value: "27 a. C. (Augusto)" },
      { label: "Máxima extensión", value: "117 d. C., bajo Trajano" },
      { label: "Fin en Occidente", value: "476 d. C. (deposición de Rómulo Augústulo)" },
      { label: "Fin en Oriente", value: "1453 (caída de Constantinopla)" },
    ],
    sources: ["beard-spqr"],
    relations: [
      { to: "antigua-grecia", type: "related", description: "Roma heredó y difundió la cultura griega." },
    ],
    content: `
## De la monarquía a la república

Según la tradición, Roma fue fundada en el 753 a. C. Tras una etapa monárquica, hacia el 509 a. C. se instauró la **república**, con magistrados elegidos —como los cónsules— y un Senado influyente. Durante siglos, Roma extendió su dominio por Italia y, después de las guerras púnicas contra Cartago, por el Mediterráneo.

Las guerras civiles del siglo I a. C., con figuras como **Julio César**, debilitaron las instituciones republicanas. César fue asesinado en el 44 a. C.

## Augusto y el principado

En el 27 a. C., Octavio recibió el título de **Augusto**. Aunque mantuvo formalmente las instituciones republicanas, concentró el poder real. Comenzó así el Imperio, y con él la llamada *Pax Romana*, un largo período de relativa estabilidad interna.

## Un imperio mediterráneo

Bajo **Trajano** (98–117 d. C.) el Imperio alcanzó su máxima extensión, desde Britania hasta Mesopotamia. Lo sostenían un ejército profesional, una red de calzadas, ciudades con acueductos, termas y anfiteatros, y una administración que usaba el latín en Occidente y el griego en Oriente.

## Crisis, cristianismo y división

El siglo III trajo crisis políticas, militares y económicas. **Constantino** legalizó el cristianismo (Edicto de Milán, 313) y fundó Constantinopla. A la muerte de **Teodosio** (395), el Imperio quedó dividido de forma definitiva entre Oriente y Occidente.

## La caída de Occidente

En el 476, el jefe germánico Odoacro depuso a **Rómulo Augústulo**, el último emperador de Occidente. Los historiadores debaten si se trató de una «caída» abrupta o de una **transformación** gradual hacia los reinos germánicos. El Imperio de Oriente —llamado *bizantino* por los historiadores modernos— sobrevivió hasta la conquista otomana de Constantinopla en 1453.

## Legado

El derecho romano, las lenguas romances (español, portugués, italiano, francés, rumano…), la arquitectura con arcos y hormigón, y la organización de la Iglesia latina son algunas de las huellas más duraderas de Roma.
`,
  },
  {
    slug: "coliseo",
    title: "Coliseo",
    subtitle: "El Anfiteatro Flavio de Roma",
    summary:
      "Gran anfiteatro elíptico construido en Roma bajo la dinastía Flavia e inaugurado por el emperador Tito en el año 80 d. C. Acogía combates de gladiadores, cacerías de animales y otros espectáculos públicos.",
    category: "historia/civilizaciones/roma",
    alsoIn: ["cultura/arquitectura", "cultura/patrimonio-cultural"],
    entityType: "monument",
    difficulty: "beginner",
    keywords: ["Anfiteatro Flavio", "gladiadores", "Vespasiano", "Tito", "hipogeo", "Roma"],
    facts: [
      { label: "Inauguración", value: "80 d. C., bajo Tito" },
      { label: "Dimensiones", value: "c. 189 × 156 m; altura c. 48 m" },
      { label: "Aforo estimado", value: "Entre 50 000 y 80 000 espectadores (estimaciones debatidas)" },
      { label: "Patrimonio Mundial", value: "UNESCO, 1980 (Centro histórico de Roma)" },
    ],
    sources: ["hopkins-colosseum", "unesco-91"],
    relations: [{ to: "imperio-romano", type: "part_of" }],
    content: `
## Un anfiteatro para el pueblo de Roma

El emperador **Vespasiano** inició la construcción hacia el año 70–72 d. C. en el terreno que había ocupado el lago artificial del palacio de Nerón, la *Domus Aurea*. Su hijo **Tito** lo inauguró en el año 80 con juegos que, según las fuentes antiguas, duraron cien días, y **Domiciano** completó la obra. Su nombre antiguo era **Anfiteatro Flavio**; el de *Coliseo* probablemente procede de una estatua colosal de Nerón que se alzaba cerca.

## Arquitectura

El edificio tiene planta elíptica de unos 189 por 156 metros y una fachada de cuatro niveles con columnas de órdenes superpuestos. Se construyó con travertino, toba, ladrillo y hormigón romano. Un sistema de **80 entradas** numeradas y escaleras permitía llenar y vaciar las gradas con rapidez. Un toldo, el *velarium*, protegía del sol al público.

Bajo la arena se encuentra el **hipogeo**, una red de pasillos y montacargas desde los que se hacían aparecer animales y decorados.

## Los espectáculos

Se celebraban **combates de gladiadores**, **cacerías de animales** (*venationes*) y ejecuciones públicas. Los combates de gladiadores dejaron de celebrarse a comienzos del siglo V; las cacerías continuaron algo más. La idea de que se celebraban grandes batallas navales dentro del Coliseo aparece en fuentes antiguas para sus primeros años, pero su viabilidad técnica **se discute**.

## Después de Roma

Terremotos —como el de 1349— y siglos de expolio de piedra para otras construcciones dañaron el edificio. Hoy es uno de los monumentos más visitados del mundo y forma parte del Centro histórico de Roma, inscrito en la Lista del Patrimonio Mundial.
`,
  },
];
