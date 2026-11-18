import type { SeedArticle } from "./types";

export const SCIENCE_ARTICLES: SeedArticle[] = [
  {
    slug: "big-bang",
    title: "Big Bang",
    subtitle: "La teoría sobre la evolución temprana del universo",
    summary:
      "Modelo cosmológico según el cual el universo evolucionó a partir de un estado extremadamente caliente y denso hace unos 13 800 millones de años, y desde entonces se ha expandido y enfriado. Se apoya en la expansión observada, la radiación cósmica de fondo y la abundancia de elementos ligeros.",
    category: "universo/cosmologia/big-bang",
    alsoIn: ["historia/etapas/contexto-cosmico"],
    entityType: "theory",
    difficulty: "intermediate",
    keywords: ["cosmología", "expansión del universo", "radiación cósmica de fondo", "Lemaître", "Hubble", "nucleosíntesis", "edad del universo"],
    facts: [
      { label: "Edad del universo", value: "13 787 ± 20 millones de años (Planck, 2018)" },
      { label: "Propuesta inicial", value: "Georges Lemaître, 1927–1931" },
      { label: "Radiación de fondo", value: "Detectada por Penzias y Wilson en 1965" },
      { label: "Composición actual (aprox.)", value: "≈5 % materia ordinaria, ≈27 % materia oscura, ≈68 % energía oscura" },
    ],
    sources: ["planck-2018", "penzias-wilson-1965", "weinberg-first-three"],
    relations: [
      { to: "sistema-solar", type: "preceded" },
      { to: "agujeros-negros", type: "related" },
    ],
    content: `
## Qué dice la teoría

La teoría del Big Bang describe cómo el universo pasó de un estado muy caliente y denso a su forma actual, en continua expansión. Un error frecuente es imaginarlo como una explosión en un punto del espacio: no hubo un centro desde el que la materia saliera disparada, sino que **el propio espacio se expande** y las galaxias lejanas se alejan unas de otras.

La teoría explica la evolución del universo *desde* ese estado inicial. Qué ocurrió exactamente en el instante cero —o si tiene sentido hablar de un «antes»— es una pregunta abierta que requiere una teoría de la gravedad cuántica aún inexistente.

## Historia de la idea

- **1915–1922**: la relatividad general de Einstein permite modelos de universo dinámico; Alexander Friedmann encuentra soluciones en expansión.
- **1927–1931**: el sacerdote y físico belga **Georges Lemaître** propone un universo en expansión y, después, un origen a partir de un «átomo primitivo».
- **1929**: **Edwin Hubble** publica la relación entre la distancia de las galaxias y su velocidad de alejamiento.
- **1949**: el astrónomo Fred Hoyle, partidario de un modelo rival, usa la expresión *Big Bang* en un programa de radio; el nombre se populariza.
- **1965**: **Arno Penzias** y **Robert Wilson** detectan la radiación cósmica de fondo de microondas, predicha por el modelo.

## Las tres grandes pruebas

1. **La expansión del universo**: la luz de las galaxias lejanas está desplazada hacia el rojo en proporción a su distancia.
2. **La radiación cósmica de fondo**: un resplandor de microondas casi uniforme en todo el cielo, emitido unos 380 000 años después del inicio, cuando el universo se volvió transparente.
3. **La abundancia de elementos ligeros**: en los primeros minutos se formaron hidrógeno, helio y trazas de litio en proporciones que coinciden con las observadas (alrededor de un 75 % de hidrógeno y un 25 % de helio en masa).

## Lo que aún no sabemos

El modelo cosmológico estándar necesita **materia oscura** y **energía oscura**, cuya naturaleza se desconoce. La hipótesis de la **inflación cósmica**, una expansión rapidísima en la primera fracción de segundo, es ampliamente aceptada pero no está confirmada directamente. Además, distintos métodos para medir la tasa de expansión actual dan valores que no coinciden del todo, la llamada **tensión de Hubble**, que la comunidad científica investiga activamente.
`,
  },
  {
    slug: "sistema-solar",
    title: "Sistema solar",
    subtitle: "El Sol y todo lo que orbita a su alrededor",
    summary:
      "Sistema planetario formado por el Sol y los cuerpos ligados a él por la gravedad: ocho planetas, sus lunas, planetas enanos, asteroides, cometas y polvo. Se formó hace unos 4600 millones de años a partir de una nube de gas y polvo.",
    category: "universo/sistemas-planetarios/sistema-solar",
    entityType: "celestial_body",
    difficulty: "children",
    keywords: ["planetas", "Sol", "Plutón", "planetas enanos", "cinturón de asteroides", "cinturón de Kuiper", "nube de Oort", "Júpiter", "Marte"],
    facts: [
      { label: "Edad", value: "c. 4600 millones de años" },
      { label: "Planetas", value: "8 (Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano, Neptuno)" },
      { label: "Planetas enanos reconocidos por la UAI", value: "Ceres, Plutón, Eris, Haumea, Makemake" },
      { label: "Masa del Sol", value: "Más del 99,8 % de la masa total del sistema" },
      { label: "Unidad astronómica", value: "≈ 149,6 millones de km (distancia media Tierra-Sol)" },
    ],
    sources: ["nasa-solar-system", "iau-2006-b5"],
    relations: [{ to: "big-bang", type: "related" }],
    content: `
## Cómo se formó

Hace unos 4600 millones de años, una nube de gas y polvo colapsó por efecto de su propia gravedad. La mayor parte de la materia se concentró en el centro y formó el **Sol**; el resto se aplanó en un disco giratorio donde partículas cada vez mayores se unieron hasta formar los planetas.

## Los ocho planetas

| Grupo | Planetas | Características |
|---|---|---|
| Rocosos o terrestres | Mercurio, Venus, Tierra, Marte | Pequeños, densos, con superficie sólida |
| Gigantes gaseosos | Júpiter, Saturno | Enormes, compuestos sobre todo de hidrógeno y helio |
| Gigantes helados | Urano, Neptuno | Ricos en agua, amoníaco y metano en formas heladas |

**Júpiter** es el más grande: su masa supera en más de dos veces la de todos los demás planetas juntos. **Venus** es el más caliente por su densa atmósfera de dióxido de carbono, aunque Mercurio esté más cerca del Sol.

## ¿Por qué Plutón ya no es un planeta?

En 2006, la **Unión Astronómica Internacional** definió qué es un planeta: debe orbitar el Sol, tener masa suficiente para ser casi esférico y haber «limpiado» su órbita de otros cuerpos. Plutón cumple las dos primeras condiciones, pero comparte su región con muchos otros objetos del **cinturón de Kuiper**. Por eso pasó a la categoría de **planeta enano**, junto con Ceres, Eris, Haumea y Makemake.

## Más allá de los planetas

- **Cinturón de asteroides**, entre Marte y Júpiter.
- **Cinturón de Kuiper**, más allá de Neptuno, hogar de Plutón y de muchos cometas de período corto.
- **Nube de Oort**: una enorme envoltura esférica de cuerpos helados que explicaría el origen de los cometas de período largo. Es una **hipótesis** bien fundamentada, pero aún no se ha observado directamente.

## Una cuestión de escala

Las ilustraciones del sistema solar casi nunca están a escala, porque las distancias son inmensas en comparación con los tamaños. Si el Sol fuera una pelota de **1 metro** de diámetro, la Tierra sería una canica de unos **9 milímetros** situada a unos **107 metros** de distancia, y Neptuno estaría a más de 3 kilómetros. En ALEXANDRIA, cada representación indicará si usa **escala real** o **escala ilustrativa**.
`,
  },
  {
    slug: "agujeros-negros",
    title: "Agujeros negros",
    subtitle: "Regiones de las que ni la luz puede escapar",
    summary:
      "Un agujero negro es una región del espacio-tiempo donde la gravedad es tan intensa que nada, ni siquiera la luz, puede escapar una vez cruzado su horizonte de sucesos. Predichos por la relatividad general, hoy se estudian mediante ondas gravitacionales y observaciones del Event Horizon Telescope.",
    category: "universo/estrellas/agujeros-negros",
    alsoIn: ["ciencias/fisica/relatividad"],
    entityType: "celestial_body",
    difficulty: "advanced",
    keywords: ["horizonte de sucesos", "relatividad general", "Schwarzschild", "Sagitario A*", "M87", "ondas gravitacionales", "radiación de Hawking"],
    facts: [
      { label: "Predicción teórica", value: "Solución de Karl Schwarzschild (1916) a las ecuaciones de Einstein" },
      { label: "Primera detección de ondas gravitacionales", value: "Septiembre de 2015 (LIGO), publicada en 2016" },
      { label: "Primera imagen", value: "M87*, publicada en abril de 2019 (Event Horizon Telescope)" },
      { label: "Agujero negro de la Vía Láctea", value: "Sagitario A*, ≈ 4 millones de masas solares" },
    ],
    sources: ["eht-2019", "ligo-2016"],
    relations: [
      { to: "big-bang", type: "related" },
    ],
    content: `
## Qué es un agujero negro

Cuando una gran cantidad de masa se concentra en un volumen muy pequeño, la curvatura del espacio-tiempo se vuelve extrema. El límite a partir del cual nada puede escapar se llama **horizonte de sucesos**. No es una superficie material: es una frontera sin retorno.

## Cómo se forman

- **Agujeros negros estelares**: surgen cuando una estrella de gran masa agota su combustible y su núcleo colapsa, a menudo tras una supernova. Tienen desde unas pocas hasta decenas de veces la masa del Sol.
- **Agujeros negros supermasivos**: habitan el centro de la mayoría de las galaxias grandes y alcanzan millones o miles de millones de masas solares. Su origen exacto **todavía se investiga**.

## De la teoría a la observación

En 1916, Karl Schwarzschild encontró una solución a las ecuaciones de la relatividad general que describe un objeto así. Durante décadas se consideró una curiosidad matemática. El físico John Wheeler popularizó el término *agujero negro* a finales de la década de 1960.

Hoy existen pruebas observacionales sólidas:

- **Órbitas estelares**: el seguimiento durante décadas de las estrellas que giran alrededor de **Sagitario A\\***, en el centro de la Vía Láctea, revela un objeto compacto de unos 4 millones de masas solares. Este trabajo fue reconocido con el Premio Nobel de Física de 2020.
- **Ondas gravitacionales**: en 2015, los detectores **LIGO** registraron por primera vez ondulaciones del espacio-tiempo producidas por la fusión de dos agujeros negros.
- **Imágenes directas**: en 2019, la colaboración **Event Horizon Telescope** presentó la primera imagen de la «sombra» de un agujero negro, el de la galaxia M87; en 2022 publicó la de Sagitario A\\*.

## Preguntas abiertas

Stephen Hawking propuso en 1974 que los agujeros negros emiten una débil radiación de origen cuántico. La **radiación de Hawking** es una predicción teórica ampliamente estudiada, pero **no se ha observado** en agujeros negros reales. Tampoco está resuelto qué ocurre con la información que cae en ellos, ni qué sucede en su interior, donde la relatividad general deja de ser aplicable.
`,
  },
  {
    slug: "adn",
    title: "ADN",
    subtitle: "La molécula de la herencia",
    summary:
      "El ácido desoxirribonucleico (ADN) es la molécula que almacena la información genética de casi todos los seres vivos. Está formado por dos cadenas enrolladas en doble hélice cuya secuencia de cuatro bases —A, T, C y G— codifica las instrucciones para construir y mantener un organismo.",
    category: "ciencias/biologia/genetica",
    alsoIn: ["medicina/genetica-humana", "ciencias/quimica/bioquimica"],
    entityType: "concept",
    difficulty: "intermediate",
    keywords: ["doble hélice", "genes", "genoma", "Watson", "Crick", "Rosalind Franklin", "nucleótidos", "replicación", "genética"],
    facts: [
      { label: "Bases", value: "Adenina (A), timina (T), citosina (C), guanina (G)" },
      { label: "Estructura propuesta", value: "Watson y Crick, 1953, con datos de difracción de Franklin y Wilkins" },
      { label: "Genoma humano", value: "≈ 3100 millones de pares de bases (conjunto haploide)" },
      { label: "Genes codificantes humanos", value: "≈ 20 000" },
    ],
    sources: ["watson-crick-1953", "franklin-gosling-1953"],
    relations: [
      { to: "teoria-de-la-evolucion", type: "related", description: "La genética molecular explica el mecanismo de la herencia en el que actúa la selección natural." },
    ],
    content: `
## Una escalera retorcida

El ADN está formado por dos largas cadenas de **nucleótidos**. Cada nucleótido contiene un azúcar (desoxirribosa), un grupo fosfato y una de cuatro **bases nitrogenadas**: adenina, timina, citosina y guanina. Las dos cadenas se unen por sus bases como los peldaños de una escalera —**A siempre con T, y C siempre con G**— y se enrollan formando una **doble hélice**.

## Cómo guarda información

El orden de las bases funciona como un texto. Un **gen** es un tramo de ADN que contiene la información para fabricar una proteína o una molécula de ARN funcional. Cada célula humana contiene unos 3100 millones de pares de bases en cada juego de cromosomas, pero solo una pequeña parte —alrededor del 1–2 %— codifica proteínas; el resto incluye regiones reguladoras y secuencias cuya función se sigue investigando.

## Copiarse a sí mismo

Antes de dividirse, la célula **replica** su ADN: las dos cadenas se separan y cada una sirve de molde para una nueva. Por eso se dice que la replicación es *semiconservativa*, algo que demostraron Meselson y Stahl en 1958. Los errores de copia que no se reparan son una fuente de **mutaciones**, materia prima de la evolución.

## Historia del descubrimiento

- **1869**: Friedrich Miescher aísla una sustancia del núcleo celular a la que llama *nucleína*.
- **1944**: Oswald Avery, Colin MacLeod y Maclyn McCarty muestran que el ADN transmite caracteres hereditarios en bacterias.
- **1952–1953**: las imágenes de difracción de rayos X obtenidas por **Rosalind Franklin** y Raymond Gosling, y los trabajos de Maurice Wilkins, aportan datos clave.
- **1953**: **James Watson** y **Francis Crick** publican en *Nature* el modelo de la doble hélice, en el mismo número que los artículos de Franklin y Gosling y de Wilkins y colaboradores.
- **1962**: Watson, Crick y Wilkins reciben el Premio Nobel. Franklin había muerto en 1958, y el Nobel no se concede a título póstumo. El reconocimiento de su contribución es hoy un tema central en la historia de la ciencia.

## Hoy

La secuenciación del genoma humano, completada en lo esencial en 2003 y de forma íntegra en 2022, y técnicas como la edición génica han transformado la medicina, la biología evolutiva y la arqueología.
`,
  },
  {
    slug: "teoria-de-la-evolucion",
    title: "Teoría de la evolución",
    subtitle: "Cómo cambian las especies a lo largo del tiempo",
    summary:
      "La teoría de la evolución explica la diversidad de la vida como resultado de la descendencia común con modificación. Charles Darwin y Alfred Russel Wallace propusieron la selección natural como mecanismo principal; la genética moderna confirmó y amplió esa explicación.",
    category: "ciencias/biologia/evolucion",
    alsoIn: ["historia/etapas/evolucion-de-la-vida"],
    entityType: "theory",
    difficulty: "intermediate",
    keywords: ["Darwin", "Wallace", "selección natural", "especiación", "síntesis moderna", "fósiles", "ancestro común"],
    facts: [
      { label: "Presentación conjunta Darwin–Wallace", value: "1 de julio de 1858, Sociedad Linneana de Londres" },
      { label: "El origen de las especies", value: "Publicado el 24 de noviembre de 1859" },
      { label: "Síntesis moderna", value: "Décadas de 1930 y 1940" },
      { label: "Primeras evidencias de vida", value: "Hace al menos 3500 millones de años" },
    ],
    sources: ["darwin-origin", "futuyma-evolution"],
    relations: [{ to: "adn", type: "related" }],
    content: `
## La idea central

Todos los seres vivos están emparentados y descienden de ancestros comunes. A lo largo de muchas generaciones, las poblaciones cambian: algunas variantes hereditarias se vuelven más frecuentes y otras desaparecen. Con suficiente tiempo, esos cambios dan lugar a especies nuevas.

En ciencia, una **teoría** no es una conjetura: es una explicación amplia, puesta a prueba muchas veces y respaldada por múltiples líneas de evidencia. La evolución es la base de toda la biología moderna.

## La selección natural

Charles Darwin y Alfred Russel Wallace llegaron de manera independiente a la misma idea, presentada conjuntamente en 1858. El razonamiento es sencillo:

1. Los individuos de una población **varían**.
2. Parte de esa variación es **hereditaria**.
3. Nacen más individuos de los que pueden sobrevivir y reproducirse.
4. Los que tienen rasgos más favorables en su ambiente dejan, en promedio, **más descendencia**.

Al año siguiente, Darwin publicó *El origen de las especies*, que reunía una enorme cantidad de observaciones.

## Otros mecanismos

La selección natural no actúa sola. También influyen la **deriva genética** (cambios aleatorios de frecuencia, importantes en poblaciones pequeñas), las **mutaciones**, el **flujo génico** entre poblaciones y la **selección sexual**. La llamada *síntesis moderna* unió en las décadas de 1930 y 1940 la teoría de Darwin con la genética mendeliana.

## Las pruebas

- **Registro fósil**, con formas de transición como las que documentan el origen de las aves o de los cetáceos.
- **Anatomía comparada**: estructuras homólogas, como los huesos del brazo humano, del ala del murciélago y de la aleta de la ballena.
- **Genética**: las secuencias de ADN permiten reconstruir árboles de parentesco que coinciden con los obtenidos por otras vías.
- **Evolución observada**: la resistencia de bacterias a los antibióticos o de insectos a los pesticidas.

## Debates actuales

La comunidad científica no discute *si* la evolución ocurre, sino *cómo* interactúan sus mecanismos: el ritmo del cambio, el papel del desarrollo embrionario o de la herencia epigenética, entre otras cuestiones activas de investigación.
`,
  },
  {
    slug: "cerebro-humano",
    title: "Cerebro humano",
    subtitle: "El órgano central del sistema nervioso",
    summary:
      "El encéfalo humano coordina el movimiento, procesa la información de los sentidos y sostiene el pensamiento, la memoria, el lenguaje y las emociones. Contiene unos 86 000 millones de neuronas y consume alrededor de una quinta parte de la energía del cuerpo en reposo.",
    category: "medicina/sistemas/sistema-nervioso",
    alsoIn: ["medicina/anatomia/organos"],
    entityType: "concept",
    difficulty: "beginner",
    keywords: ["neuronas", "encéfalo", "corteza cerebral", "lóbulos", "cerebelo", "tronco encefálico", "plasticidad", "sistema nervioso"],
    facts: [
      { label: "Neuronas", value: "≈ 86 000 millones (Azevedo et al., 2009)" },
      { label: "Peso medio en adultos", value: "≈ 1,3 – 1,4 kg" },
      { label: "Consumo energético", value: "≈ 20 % del gasto en reposo con ≈ 2 % del peso corporal" },
    ],
    notices: ["medical"],
    sources: ["kandel-6", "azevedo-2009"],
    relations: [],
    content: `
## Partes principales

- **Cerebro** (telencéfalo): dividido en dos hemisferios unidos por el **cuerpo calloso**. Su capa externa, la **corteza cerebral**, está muy plegada, lo que aumenta su superficie.
- **Cerebelo**: situado en la parte posterior; participa en la coordinación del movimiento, el equilibrio y algunos aspectos del aprendizaje.
- **Tronco encefálico**: conecta el encéfalo con la médula espinal y regula funciones vitales como la respiración y el ritmo cardíaco.

## Los lóbulos de la corteza

| Lóbulo | Funciones asociadas |
|---|---|
| Frontal | Planificación, toma de decisiones, control del movimiento voluntario, parte del lenguaje |
| Parietal | Integración de sensaciones del cuerpo, orientación espacial |
| Temporal | Audición, memoria, comprensión del lenguaje |
| Occipital | Procesamiento visual |

Estas asociaciones son una simplificación útil: las funciones complejas dependen de **redes** que conectan muchas regiones.

## Neuronas y sinapsis

Las **neuronas** se comunican mediante impulsos eléctricos y sustancias químicas llamadas **neurotransmisores**, que atraviesan las **sinapsis**. Un estudio de 2009 estimó unas 86 000 millones de neuronas y un número similar de células no neuronales, como las **células gliales**, que sostienen, nutren y protegen a las neuronas. La cifra de «diez veces más glía que neuronas», muy repetida, no se sostiene con esos datos.

## Un órgano que cambia

El cerebro se modifica con la experiencia: la **neuroplasticidad** permite aprender, formar recuerdos y, en cierta medida, recuperarse tras algunas lesiones. Es especialmente intensa en la infancia, pero continúa durante toda la vida.

## Mitos frecuentes

- *«Solo usamos el 10 % del cerebro»*: es falso. Las técnicas de neuroimagen muestran actividad en prácticamente todo el encéfalo a lo largo del día.
- *«Hay personas de cerebro izquierdo y de cerebro derecho»*: aunque algunas funciones están lateralizadas, como gran parte del lenguaje, no hay pruebas de que la personalidad dependa de un hemisferio dominante.
`,
  },
];
