import type { SeedArticle } from "./types";

export const WORLD_ARTICLES: SeedArticle[] = [
  {
    slug: "marie-curie",
    title: "Marie Curie",
    subtitle: "Pionera de la radiactividad (1867–1934)",
    summary:
      "Física y química nacida en Varsovia y nacionalizada francesa. Investigó la radiactividad, descubrió el polonio y el radio junto a Pierre Curie, y fue la primera persona en recibir dos premios Nobel en dos ciencias distintas: Física (1903) y Química (1911).",
    category: "historia/personajes",
    alsoIn: ["ciencias/fisica/fisica-nuclear", "ciencias/quimica"],
    entityType: "person",
    difficulty: "beginner",
    keywords: ["radiactividad", "polonio", "radio", "Premio Nobel", "Pierre Curie", "Sorbona", "Maria Skłodowska"],
    facts: [
      { label: "Nacimiento", value: "7 de noviembre de 1867, Varsovia" },
      { label: "Fallecimiento", value: "4 de julio de 1934, Passy (Alta Saboya, Francia)" },
      { label: "Nobel de Física", value: "1903, compartido con Pierre Curie y Henri Becquerel" },
      { label: "Nobel de Química", value: "1911, por el descubrimiento del polonio y el radio" },
    ],
    sources: ["nobel-curie-1903", "nobel-curie-1911", "quinn-curie"],
    relations: [],
    content: `
## Primeros años

**Maria Skłodowska** nació en Varsovia, entonces bajo dominio ruso, donde las universidades no admitían mujeres. Estudió en la llamada «universidad volante», una red clandestina de enseñanza, y en 1891 se trasladó a París para estudiar física y matemáticas en la Sorbona.

## La investigación de la radiactividad

En 1896, Henri Becquerel había observado que las sales de uranio emitían una radiación desconocida. Marie Curie eligió ese fenómeno para su tesis doctoral y demostró que la radiación dependía del propio átomo, no de reacciones químicas. Acuñó el término **radiactividad**.

Junto a su esposo, **Pierre Curie**, analizó toneladas de pechblenda, un mineral de uranio, y en 1898 anunció dos elementos nuevos: el **polonio**, llamado así en honor a Polonia, y el **radio**.

## Dos premios Nobel

- **1903, Física**: compartido con Pierre Curie y Henri Becquerel por sus investigaciones sobre la radiación. Fue la primera mujer galardonada con un Nobel.
- **1911, Química**: en solitario, por el descubrimiento del polonio y el radio y el aislamiento del radio.

Sigue siendo la única persona que ha recibido premios Nobel en **dos ciencias distintas**.

## Tras la muerte de Pierre

Pierre Curie murió atropellado en 1906. Marie ocupó su cátedra y se convirtió en la primera mujer profesora de la Sorbona. Durante la Primera Guerra Mundial organizó unidades móviles de radiología para atender a soldados heridos.

## Legado y riesgos

Su trabajo abrió el camino a la física nuclear y a aplicaciones médicas de la radiación. En su época se desconocían los peligros de la exposición prolongada: murió de una anemia aplásica atribuida a esa exposición. Sus cuadernos de laboratorio todavía son radiactivos y se conservan con medidas de protección. En 1995 sus restos fueron trasladados al Panteón de París.
`,
  },
  {
    slug: "leonardo-da-vinci",
    title: "Leonardo da Vinci",
    subtitle: "Artista, ingeniero y observador de la naturaleza (1452–1519)",
    summary:
      "Pintor, dibujante, ingeniero e investigador del Renacimiento italiano, autor de La última cena y La Gioconda. Sus cuadernos reúnen miles de páginas de estudios de anatomía, óptica, hidráulica y máquinas.",
    category: "cultura/historia-del-arte/grandes-artistas",
    alsoIn: ["historia/personajes/inventores", "historia/etapas/edad-moderna"],
    entityType: "person",
    difficulty: "beginner",
    keywords: ["Renacimiento", "Gioconda", "Mona Lisa", "Última Cena", "Hombre de Vitruvio", "Verrocchio", "cuadernos", "Florencia", "Milán"],
    facts: [
      { label: "Nacimiento", value: "15 de abril de 1452, Vinci (Toscana)" },
      { label: "Fallecimiento", value: "2 de mayo de 1519, Amboise (Francia)" },
      { label: "Formación", value: "Taller de Andrea del Verrocchio, Florencia" },
      { label: "Obras célebres", value: "La última cena (c. 1495–1498), La Gioconda (iniciada c. 1503)" },
    ],
    sources: ["kemp-leonardo", "isaacson-leonardo"],
    relations: [{ to: "imperio-romano", type: "related", description: "Su Hombre de Vitruvio ilustra las proporciones descritas por el arquitecto romano Vitruvio." }],
    content: `
## Formación en Florencia

Leonardo nació en Vinci, cerca de Florencia, hijo ilegítimo de un notario. Hacia los catorce años entró en el taller de **Andrea del Verrocchio**, donde aprendió pintura, escultura, dibujo y técnicas de ingeniería. Según la tradición, el ángel que pintó en el *Bautismo de Cristo* de su maestro ya mostraba un talento excepcional.

## Milán, Florencia, Roma y Francia

En 1482 se trasladó a Milán al servicio de Ludovico Sforza, donde pintó **La última cena** en el refectorio de Santa Maria delle Grazie. Experimentó con una técnica sobre muro seco que no resistió bien el paso del tiempo, por lo que la obra ha requerido numerosas restauraciones.

Hacia 1503 comenzó en Florencia el retrato conocido como **La Gioconda** o *Mona Lisa*, en el que siguió trabajando durante años. Pasó sus últimos años en Francia, invitado por el rey Francisco I, y murió en Amboise en 1519.

## Los cuadernos

Se conservan miles de páginas de sus cuadernos, escritas a menudo **de derecha a izquierda**, en escritura especular. Incluyen:

- Estudios de **anatomía** basados en disecciones, de notable precisión para su época.
- Observaciones sobre **óptica**, el vuelo de las aves y el movimiento del agua.
- Diseños de máquinas, armas, puentes y aparatos voladores.
- El célebre **Hombre de Vitruvio**, un estudio de proporciones inspirado en el arquitecto romano Vitruvio.

## Entre el mito y la realidad

Leonardo suele presentarse como «inventor» del helicóptero, el tanque o el paracaídas. Es más exacto decir que **imaginó y dibujó** ideas de ese tipo: la mayoría no se construyeron en su tiempo y varias no habrían funcionado con los materiales disponibles. Su verdadera originalidad estuvo en unir la observación minuciosa de la naturaleza con el arte y la técnica.
`,
  },
  {
    slug: "alan-turing",
    title: "Alan Turing",
    subtitle: "Matemático y pionero de la informática (1912–1954)",
    summary:
      "Matemático británico que formuló el concepto de máquina de Turing, base teórica de la computación, contribuyó a descifrar las comunicaciones alemanas cifradas con Enigma durante la Segunda Guerra Mundial y planteó en 1950 la pregunta de si las máquinas pueden pensar.",
    category: "tecnologia/historia-computacion",
    alsoIn: ["inteligencia-artificial/historia", "ciencias/matematicas", "historia/personajes"],
    entityType: "person",
    difficulty: "intermediate",
    keywords: ["máquina de Turing", "Enigma", "Bletchley Park", "test de Turing", "computabilidad", "juego de imitación"],
    facts: [
      { label: "Nacimiento", value: "23 de junio de 1912, Londres" },
      { label: "Fallecimiento", value: "7 de junio de 1954, Wilmslow (Inglaterra)" },
      { label: "Trabajo clave", value: "«On Computable Numbers» (1936)" },
      { label: "Indulto póstumo", value: "2013" },
    ],
    notices: ["contested"],
    sources: ["turing-1936", "turing-1950", "hodges-turing"],
    relations: [
      { to: "historia-de-la-inteligencia-artificial", type: "influenced" },
    ],
    content: `
## La máquina universal

En 1936, con 24 años, Turing publicó *On Computable Numbers*, donde describía una máquina abstracta capaz de leer y escribir símbolos en una cinta siguiendo reglas simples. Con ella respondió a un problema planteado por David Hilbert: demostró que **no existe un procedimiento general** capaz de decidir si cualquier enunciado matemático es demostrable. Además, describió una **máquina universal** que puede imitar a cualquier otra si recibe su descripción: la idea teórica del ordenador programable.

## Bletchley Park

Durante la Segunda Guerra Mundial trabajó en **Bletchley Park**, el centro británico de descifrado. Contribuyó de forma decisiva al diseño de la **bombe**, un dispositivo electromecánico que ayudaba a encontrar las claves diarias de la máquina **Enigma**, usada por las fuerzas alemanas. El trabajo, realizado por miles de personas, se mantuvo en secreto durante décadas.

## ¿Pueden pensar las máquinas?

En 1950 publicó *Computing Machinery and Intelligence*, donde propuso sustituir esa pregunta por un experimento: el **juego de imitación**, hoy llamado **test de Turing**. Si un interrogador no puede distinguir por escrito entre una persona y una máquina, ¿qué razones tendríamos para negar que la máquina piensa? El artículo anticipó muchas objeciones que aún se discuten.

También diseñó uno de los primeros ordenadores con programa almacenado, el ACE, y en sus últimos años estudió la **morfogénesis**, la formación de patrones en los seres vivos.

## Persecución y reconocimiento

En 1952 fue condenado por mantener relaciones homosexuales, entonces delito en el Reino Unido, y sometido a un tratamiento hormonal como alternativa a la prisión. Murió en 1954 por envenenamiento con cianuro; la investigación oficial concluyó que fue un suicidio, aunque **algunos biógrafos e investigadores han cuestionado esa conclusión**.

En 2009 el Gobierno británico pidió disculpas públicamente y en 2013 recibió un indulto real póstumo. El premio más prestigioso de la informática, el **Premio Turing**, lleva su nombre.
`,
  },
  {
    slug: "historia-de-internet",
    title: "Historia de Internet",
    subtitle: "De ARPANET a la red global",
    summary:
      "Internet es una red de redes que se comunican mediante los protocolos TCP/IP. Surgió de la investigación en conmutación de paquetes de los años sesenta, con ARPANET como precursora, y se convirtió en una infraestructura global tras la creación de la World Wide Web.",
    category: "tecnologia/internet",
    alsoIn: ["tecnologia/historia-computacion"],
    entityType: "invention",
    difficulty: "intermediate",
    keywords: ["ARPANET", "TCP/IP", "World Wide Web", "Tim Berners-Lee", "CERN", "Vint Cerf", "Bob Kahn", "conmutación de paquetes", "DNS"],
    facts: [
      { label: "Primer mensaje de ARPANET", value: "29 de octubre de 1969 (UCLA – Instituto de Investigación de Stanford)" },
      { label: "Protocolo TCP", value: "Descrito por Cerf y Kahn en 1974" },
      { label: "ARPANET adopta TCP/IP", value: "1 de enero de 1983" },
      { label: "Propuesta de la Web", value: "Marzo de 1989, Tim Berners-Lee (CERN)" },
    ],
    notices: ["evolving"],
    sources: ["cerf-kahn-1974", "berners-lee-1989", "abbate-internet"],
    relations: [
      { to: "alan-turing", type: "related" },
      { to: "historia-de-la-inteligencia-artificial", type: "related" },
    ],
    content: `
## Conmutación de paquetes

A comienzos de los años sesenta, investigadores como **Paul Baran**, en Estados Unidos, y **Donald Davies**, en el Reino Unido, propusieron dividir los mensajes en pequeños bloques —**paquetes**— que viajan de forma independiente y se reensamblan en el destino. Este método hacía las redes más eficientes y resistentes a fallos.

## ARPANET

La agencia estadounidense de proyectos de investigación avanzada (ARPA) financió **ARPANET** para conectar centros de investigación. El 29 de octubre de 1969 se envió el primer mensaje entre la Universidad de California en Los Ángeles y el Instituto de Investigación de Stanford: el sistema se bloqueó tras transmitir las dos primeras letras de «LOGIN».

## Una red de redes

Pronto surgieron otras redes con tecnologías distintas. En 1974, **Vint Cerf** y **Bob Kahn** describieron un protocolo para interconectarlas: el origen de **TCP/IP**. El 1 de enero de 1983, ARPANET adoptó TCP/IP, una fecha que a menudo se considera el nacimiento de Internet tal como la conocemos. Ese mismo período vio nacer el **sistema de nombres de dominio (DNS)**, que traduce nombres legibles a direcciones numéricas.

## La World Wide Web

Internet y la Web no son lo mismo. En 1989, **Tim Berners-Lee** propuso en el CERN un sistema de documentos enlazados por **hipertexto**. Desarrolló el lenguaje HTML, el protocolo HTTP y el primer navegador. En 1993 el CERN liberó la tecnología para uso público, y navegadores gráficos como Mosaic facilitaron su expansión.

## Expansión global

Durante los años noventa, Internet pasó de ser una red académica a una infraestructura comercial y social. Los teléfonos inteligentes, a partir de la segunda mitad de los años 2000, extendieron el acceso móvil. Hoy más de la mitad de la humanidad está conectada, aunque persisten grandes **brechas digitales** entre regiones y grupos sociales; las cifras de usuarios cambian cada año y deben consultarse en las estadísticas actualizadas de organismos como la Unión Internacional de Telecomunicaciones.
`,
  },
  {
    slug: "historia-de-la-inteligencia-artificial",
    title: "Historia de la inteligencia artificial",
    subtitle: "De Dartmouth a los grandes modelos de lenguaje",
    summary:
      "La inteligencia artificial (IA) es el campo que busca construir sistemas capaces de realizar tareas que asociamos con la inteligencia. Nació formalmente en 1956, atravesó etapas de entusiasmo y desencanto, y vivió un gran impulso desde 2012 con el aprendizaje profundo.",
    category: "inteligencia-artificial/historia",
    alsoIn: ["tecnologia/historia-computacion"],
    entityType: "discipline",
    difficulty: "intermediate",
    keywords: ["Dartmouth", "perceptrón", "inviernos de la IA", "sistemas expertos", "aprendizaje profundo", "transformer", "modelos de lenguaje", "Deep Blue", "AlphaGo"],
    facts: [
      { label: "Término acuñado", value: "Propuesta de Dartmouth, 1955 (taller en 1956)" },
      { label: "Retropropagación popularizada", value: "Rumelhart, Hinton y Williams, 1986" },
      { label: "Arquitectura transformer", value: "Vaswani et al., 2017" },
    ],
    notices: ["evolving"],
    sources: ["dartmouth-1955", "aima-4", "rumelhart-1986", "vaswani-2017", "turing-1950"],
    relations: [
      { to: "alan-turing", type: "studied_by" },
    ],
    content: `
## Los orígenes

En 1950, Alan Turing planteó si las máquinas podían pensar. En 1955, **John McCarthy**, **Marvin Minsky**, **Nathaniel Rochester** y **Claude Shannon** redactaron la propuesta de un taller de verano en el Dartmouth College, celebrado en 1956, en la que aparece la expresión *inteligencia artificial*. Los pioneros confiaban en que muchos aspectos del aprendizaje y la inteligencia podían describirse con tanta precisión que una máquina podría simularlos.

## Primeras etapas

- **IA simbólica**: programas que manipulaban símbolos y reglas lógicas para demostrar teoremas o jugar a las damas y al ajedrez.
- **Perceptrón** (1958): Frank Rosenblatt presentó una red neuronal artificial sencilla capaz de aprender a clasificar patrones.

## Los «inviernos» de la IA

Las expectativas superaron a los resultados. En los años setenta y de nuevo a finales de los ochenta, la financiación y el interés cayeron. Entre ambos períodos florecieron los **sistemas expertos**, que codificaban el conocimiento de especialistas en reglas, útiles pero difíciles de mantener.

## El regreso de las redes neuronales

En 1986, **Rumelhart, Hinton y Williams** difundieron el algoritmo de **retropropagación**, que permite entrenar redes de varias capas. El aumento de los datos disponibles y de la capacidad de cálculo, sobre todo con procesadores gráficos (GPU), hizo posible el **aprendizaje profundo**: en 2012 una red neuronal convolucional redujo drásticamente los errores en la competición de reconocimiento de imágenes ImageNet.

## Hitos públicos

- **1997**: el ordenador Deep Blue de IBM vence al campeón mundial de ajedrez Garri Kaspárov.
- **2016**: AlphaGo, de DeepMind, derrota a Lee Sedol, uno de los mejores jugadores de go.
- **2017**: la arquitectura **transformer** se convierte en la base de los modelos de lenguaje modernos.
- **Desde 2020**: los **grandes modelos de lenguaje** y la **IA generativa** llegan al público general.

## Preguntas abiertas

El campo debate cuestiones técnicas —fiabilidad, interpretabilidad, tendencia de los modelos a generar afirmaciones falsas— y sociales: impacto en el empleo, sesgos, privacidad, derechos de autor y seguridad. Por eso ALEXANDRIA AI está diseñada para **citar sus fuentes** y reconocer cuándo no tiene información suficiente.
`,
  },
  {
    slug: "paraguay",
    title: "Paraguay",
    subtitle: "República del Paraguay — Tetã Paraguái",
    summary:
      "País sin litoral marítimo del centro de América del Sur, limítrofe con Argentina, Brasil y Bolivia. Su capital es Asunción. Es uno de los pocos países americanos donde una lengua indígena, el guaraní, es oficial y hablada por la mayoría de la población junto al castellano.",
    category: "geografia/america-latina/paraguay",
    alsoIn: ["geografia/continentes/america-del-sur"],
    entityType: "country",
    difficulty: "beginner",
    keywords: ["Asunción", "guaraní", "Chaco", "río Paraguay", "Itaipú", "Guerra de la Triple Alianza", "Guerra del Chaco", "Mercosur", "tereré"],
    facts: [
      { label: "Capital", value: "Asunción (fundada el 15 de agosto de 1537)" },
      { label: "Independencia", value: "14 y 15 de mayo de 1811" },
      { label: "Lenguas oficiales", value: "Castellano y guaraní (Constitución de 1992, art. 140)" },
      { label: "Población", value: "≈ 6,1 millones (Censo Nacional 2022, INE)" },
      { label: "Superficie", value: "406 752 km²" },
      { label: "Moneda", value: "Guaraní (PYG)" },
      { label: "Forma de gobierno", value: "República presidencialista" },
    ],
    notices: ["evolving", "contested"],
    sources: ["ine-py", "constitucion-py-1992", "ley-lenguas-py", "whigham-war"],
    relations: [
      { to: "misiones-jesuiticas-de-trinidad-y-jesus", type: "related" },
      { to: "machu-picchu", type: "related", description: "Patrimonio sudamericano" },
    ],
    content: `
## Geografía

El **río Paraguay** divide el país en dos regiones muy distintas:

- **Región Oriental**: más húmeda y fértil, concentra la mayor parte de la población, las principales ciudades —Asunción, Ciudad del Este, Encarnación— y la actividad agrícola.
- **Región Occidental o Chaco**: ocupa más de la mitad del territorio, con clima semiárido, bosques secos y una población escasa que incluye comunidades indígenas y colonias menonitas.

El río **Paraná** marca buena parte de las fronteras con Brasil y Argentina. Sobre él se encuentran las centrales hidroeléctricas binacionales de **Itaipú**, con Brasil, y **Yacyretá**, con Argentina, que convierten a Paraguay en un gran exportador de electricidad.

## Historia

Antes de la llegada de los europeos, el territorio estaba habitado por pueblos guaraníes y por otros pueblos indígenas, especialmente en el Chaco. Los españoles fundaron **Asunción** en 1537, que fue durante un tiempo el centro de la colonización del Río de la Plata. Entre los siglos XVII y XVIII, las **misiones jesuíticas** reunieron a miles de guaraníes en pueblos organizados.

Paraguay proclamó su independencia en **mayo de 1811**. El siglo XIX estuvo marcado por los gobiernos de José Gaspar Rodríguez de Francia y de los López, y por la **Guerra de la Triple Alianza** (1864–1870) contra Argentina, Brasil y Uruguay, que tuvo consecuencias devastadoras para la población. La magnitud exacta de las pérdidas humanas **sigue siendo objeto de debate** entre historiadores por la escasez de censos fiables.

En el siglo XX, el país enfrentó a Bolivia en la **Guerra del Chaco** (1932–1935). Tras la larga dictadura de **Alfredo Stroessner** (1954–1989), se inició la transición democrática y se aprobó la **Constitución de 1992**.

## Lenguas y cultura

La Constitución reconoce al Paraguay como **país pluricultural y bilingüe**, y la **Ley de Lenguas** de 2010 regula el uso oficial del castellano y el guaraní. El guaraní no es solo una lengua de comunidades indígenas: lo habla una gran parte de la población en la vida cotidiana, a menudo alternándolo con el castellano.

Entre sus expresiones culturales destacan el encaje **ñandutí**, el **arpa paraguaya**, la **polca** y la **guarania** —género creado por José Asunción Flores en la década de 1920—, y una gastronomía con platos como la **sopa paraguaya** y la **chipa**. El **tereré**, una infusión fría de yerba mate, fue inscrito por la UNESCO en 2020 en la Lista del Patrimonio Cultural Inmaterial. El escritor **Augusto Roa Bastos**, autor de *Yo el Supremo*, recibió el Premio Cervantes en 1989.

## Economía

La economía se basa en la agricultura de exportación —soja, maíz, trigo—, la ganadería, la energía hidroeléctrica y el comercio. Paraguay es miembro fundador del **Mercosur** (1991). Los indicadores económicos y demográficos se actualizan periódicamente; para datos recientes conviene consultar el Instituto Nacional de Estadística.
`,
  },
  {
    slug: "misiones-jesuiticas-de-trinidad-y-jesus",
    title: "Misiones jesuíticas de Trinidad y Jesús",
    subtitle: "La Santísima Trinidad de Paraná y Jesús de Tavarangue",
    summary:
      "Ruinas de dos pueblos fundados por la Compañía de Jesús con población guaraní en el actual departamento de Itapúa, Paraguay. Son testimonio de las reducciones jesuíticas de los siglos XVII y XVIII y fueron inscritas en la Lista del Patrimonio Mundial de la UNESCO en 1993.",
    category: "geografia/america-latina/paraguay/historia-paraguay",
    alsoIn: ["cultura/patrimonio-cultural", "cultura/arquitectura", "religiones/cristianismo/catolicismo"],
    entityType: "monument",
    difficulty: "beginner",
    keywords: ["reducciones", "jesuitas", "guaraníes", "Itapúa", "Encarnación", "barroco", "Trinidad", "Tavarangue"],
    facts: [
      { label: "Ubicación", value: "Departamento de Itapúa, Paraguay" },
      { label: "Trinidad", value: "Fundada en 1706" },
      { label: "Patrimonio Mundial", value: "UNESCO, 1993" },
      { label: "Expulsión de los jesuitas", value: "Decretada por Carlos III en 1767" },
    ],
    notices: ["contested"],
    sources: ["unesco-648"],
    relations: [{ to: "paraguay", type: "located_in" }],
    content: `
## Las reducciones

A partir de comienzos del siglo XVII, los misioneros de la **Compañía de Jesús** organizaron en la región del Paraná y el Uruguay decenas de pueblos, llamados **reducciones**, donde vivían miles de guaraníes. Cada pueblo tenía una plaza central, una gran iglesia, la residencia de los padres, talleres, escuelas y viviendas colectivas para las familias indígenas.

Las reducciones protegían a los guaraníes de la esclavitud practicada por bandeirantes y encomenderos, pero también implicaban una profunda transformación de su religión, su organización social y sus formas de vida. **Su valoración histórica es compleja y sigue debatiéndose**: hay quienes destacan la preservación de la lengua guaraní y la producción artística, y quienes subrayan el carácter paternalista y aculturador del sistema.

## La Santísima Trinidad de Paraná

Fundada en 1706, fue uno de los últimos pueblos jesuíticos de la región. Su iglesia principal, de piedra arenisca, conserva relieves de ángeles músicos y otros elementos decorativos que muestran la fusión del **barroco europeo** con el trabajo de artesanos guaraníes.

## Jesús de Tavarangue

A pocos kilómetros de Trinidad se encuentran las ruinas de Jesús de Tavarangue. Su gran iglesia, con arcos de influencia morisca, **quedó inconclusa**: las obras se interrumpieron con la expulsión de los jesuitas.

## La expulsión

En 1767, el rey **Carlos III** ordenó la expulsión de la Compañía de Jesús de todos los dominios españoles. Sin la organización misional, los pueblos se despoblaron progresivamente y sus edificios cayeron en ruinas.

## Patrimonio y visita

Desde 1993, ambas misiones forman parte de la Lista del Patrimonio Mundial. Están en el departamento de Itapúa, cerca de la ciudad de Encarnación. La sección *Explora el mundo en 3D* las incluye entre sus experiencias planificadas.
`,
  },
  {
    slug: "machu-picchu",
    title: "Machu Picchu",
    subtitle: "Ciudadela inca en los Andes",
    summary:
      "Conjunto arquitectónico inca construido en el siglo XV sobre una cresta montañosa de la región de Cusco, en Perú. Asociado al gobernante Pachacútec, es uno de los sitios arqueológicos más conocidos de América y Patrimonio Mundial desde 1983.",
    category: "historia/civilizaciones/inca",
    alsoIn: ["cultura/patrimonio-cultural", "geografia/america-latina/historia-america-latina"],
    entityType: "monument",
    difficulty: "beginner",
    keywords: ["incas", "Pachacútec", "Cusco", "Andes", "Hiram Bingham", "Intihuatana", "Perú"],
    facts: [
      { label: "Ubicación", value: "Región de Cusco, Perú; c. 2400 m de altitud" },
      { label: "Ocupación", value: "Desde c. 1420 según dataciones por radiocarbono (Burger et al., 2021)" },
      { label: "Patrimonio Mundial", value: "UNESCO, 1983 (bien mixto: cultural y natural)" },
    ],
    sources: ["unesco-274", "burger-machu-2004", "burger-2021"],
    relations: [{ to: "paraguay", type: "related" }],
    content: `
## Una ciudadela entre montañas

Machu Picchu se levanta sobre una cresta entre las montañas Machu Picchu y Huayna Picchu, sobre el valle del río Urubamba. Sus constructores adaptaron el trazado al relieve con **terrazas agrícolas**, escaleras, canales de agua y edificios de piedra finamente labrada, unidos sin argamasa en las construcciones más importantes.

## ¿Cuándo se construyó?

Durante mucho tiempo, la cronología se basó en documentos coloniales que situaban el ascenso del gobernante **Pachacútec** hacia 1438 y la construcción del sitio poco después. Un estudio de 2021 con dataciones por radiocarbono de restos humanos indica que el lugar ya estaba ocupado **hacia 1420**, algo antes de lo que sugerían esas fuentes. Es un ejemplo de cómo las fechas históricas se revisan con nuevas técnicas.

La interpretación más extendida es que Machu Picchu fue una **residencia real** o hacienda de la élite inca, con funciones ceremoniales, más que una ciudad en sentido estricto.

## Principales sectores

- **Templo del Sol**, con un muro curvo de sillería.
- **Intihuatana**, una roca tallada asociada a observaciones astronómicas o rituales.
- **Plaza principal**, que separa el sector urbano del agrícola.
- Barrios de viviendas, depósitos y la llamada **Casa del Inca**.

## Redescubrimiento

El explorador estadounidense **Hiram Bingham** dio a conocer internacionalmente el sitio en 1911. Sin embargo, los campesinos de la zona lo conocían, y algunos vivían allí. Las piezas que Bingham llevó a la Universidad de Yale fueron objeto de una larga disputa con Perú, que concluyó con su devolución a partir de 2011.

## Conservación

El número de visitantes y la fragilidad del entorno obligan a regular el acceso mediante cupos y circuitos. Machu Picchu forma parte de las experiencias planificadas en *Explora el mundo en 3D*.
`,
  },
  {
    slug: "budismo",
    title: "Budismo",
    subtitle: "La tradición iniciada por Siddhartha Gautama",
    summary:
      "Tradición religiosa y filosófica originada en el norte de la India a partir de las enseñanzas de Siddhartha Gautama, el Buda. Se centra en comprender el sufrimiento y el camino para liberarse de él, y se ha diversificado en grandes corrientes como el Theravāda, el Mahāyāna y el Vajrayāna.",
    category: "religiones/budismo",
    alsoIn: ["filosofia/antigua"],
    entityType: "religion",
    difficulty: "beginner",
    keywords: ["Buda", "Siddhartha Gautama", "cuatro nobles verdades", "noble óctuple sendero", "nirvana", "Theravāda", "Mahāyāna", "Vajrayāna", "karma"],
    facts: [
      { label: "Origen", value: "Norte de la India, c. siglos VI–V a. C. (fechas debatidas)" },
      { label: "Fundador", value: "Siddhartha Gautama, el Buda («el despierto»)" },
      { label: "Grandes corrientes", value: "Theravāda, Mahāyāna, Vajrayāna" },
    ],
    notices: ["religious"],
    sources: ["harvey-buddhism", "gethin-buddhism"],
    relations: [{ to: "antigua-grecia", type: "contemporary_of", description: "El Buda vivió en una época cercana a la de los primeros filósofos griegos." }],
    content: `
## La vida del Buda

Según las tradiciones budistas, **Siddhartha Gautama** nació en Lumbini, en el actual Nepal, en el seno de una familia noble. Tras conocer la vejez, la enfermedad y la muerte, renunció a su vida de privilegios para buscar una salida al sufrimiento. Después de años de prácticas ascéticas, alcanzó el **despertar** (*bodhi*) meditando bajo un árbol en Bodh Gaya, en la India. Desde entonces fue llamado el **Buda**, «el que ha despertado».

Las fechas de su vida son inciertas. Los especialistas han propuesto cronologías que van del siglo VI al siglo V a. C.; muchos estudios recientes se inclinan por fechas más tardías dentro de ese margen.

## Enseñanzas fundamentales

Las **cuatro nobles verdades** resumen el núcleo de su enseñanza tal como la transmiten las tradiciones:

1. La existencia está marcada por el sufrimiento o la insatisfacción (*duḥkha*).
2. El sufrimiento tiene un origen: el deseo y el apego.
3. Es posible ponerle fin: el **nirvana**.
4. Existe un camino para lograrlo: el **noble óctuple sendero**, que abarca la comprensión, la conducta ética y la práctica meditativa.

Otros conceptos centrales son el **karma**, la **impermanencia** de todas las cosas y la doctrina del **no-yo** (*anātman*).

## Grandes corrientes

- **Theravāda**: predominante en Sri Lanka y el Sudeste Asiático; conserva el canon pali.
- **Mahāyāna**: extendido en China, Corea, Japón y Vietnam; destaca el ideal del *bodhisattva*. Incluye escuelas como el zen y la Tierra Pura.
- **Vajrayāna**: asociado sobre todo al Tíbet, Bután y Mongolia, con prácticas rituales y meditativas específicas.

## Expansión

Desde la India, el budismo se difundió por Asia a lo largo de rutas comerciales como la Ruta de la Seda. El emperador indio **Aśoka** (siglo III a. C.) fue un importante promotor. En los siglos XIX y XX llegó también a Europa y América.

## Una nota de método

Este artículo describe el budismo desde una perspectiva histórica y comparada, presentando las creencias tal como las entienden sus propias tradiciones. Las comunidades budistas son diversas y no todas interpretan del mismo modo estas enseñanzas.
`,
  },
  {
    slug: "alquimia",
    title: "Alquimia",
    subtitle: "Entre la filosofía natural, el laboratorio y el simbolismo",
    summary:
      "Conjunto de prácticas y teorías sobre la transformación de la materia desarrolladas en el Egipto grecorromano, el mundo islámico y Europa. Buscaba, entre otros fines, transmutar metales en oro y preparar remedios. Fue a la vez una práctica de laboratorio y una tradición simbólica.",
    category: "esoterismo/alquimia",
    alsoIn: ["ciencias/quimica", "esoterismo/hermetismo"],
    entityType: "discipline",
    difficulty: "intermediate",
    keywords: ["piedra filosofal", "transmutación", "crisopeya", "Zósimo de Panópolis", "Jabir ibn Hayyan", "Paracelso", "Newton", "química"],
    facts: [
      { label: "Orígenes documentados", value: "Egipto grecorromano, primeros siglos de la era común" },
      { label: "Autor temprano", value: "Zósimo de Panópolis (c. 300 d. C.)" },
      { label: "Separación de la química", value: "Gradual, sobre todo a lo largo del siglo XVIII" },
    ],
    notices: ["esoteric"],
    sources: ["principe-alchemy", "newman-principe-1998"],
    relations: [{ to: "antiguo-egipto", type: "related", description: "Los primeros textos alquímicos proceden del Egipto grecorromano." }],
    content: `
## Hechos, creencias e interpretaciones

Este artículo distingue entre tres planos:

- **Hechos históricos documentados**: quiénes practicaron la alquimia, qué textos escribieron y qué técnicas usaron.
- **Creencias de los alquimistas**: por ejemplo, que los metales podían transformarse en oro mediante una sustancia llamada piedra filosofal.
- **Interpretaciones posteriores**: lecturas simbólicas, espirituales o psicológicas elaboradas siglos después.

La transmutación de metales en oro por medios químicos **nunca se ha logrado**. La física nuclear moderna puede transformar unos elementos en otros, pero mediante procesos que nada tienen que ver con los métodos alquímicos.

## Orígenes grecoegipcios

Los textos alquímicos más antiguos conservados proceden del Egipto de época romana, en los primeros siglos de nuestra era. **Zósimo de Panópolis**, hacia el año 300, describió aparatos de destilación y procedimientos para teñir y transformar metales, mezclados con ideas religiosas y filosóficas.

## El mundo islámico

Entre los siglos VIII y X, autores en lengua árabe desarrollaron la alquimia de forma sistemática. El corpus atribuido a **Jābir ibn Ḥayyān** propuso que los metales estaban compuestos de azufre y mercurio en distintas proporciones. **Al-Rāzī** clasificó sustancias y describió operaciones de laboratorio. La palabra *alquimia* procede del árabe *al-kīmiyāʾ*.

## Europa medieval y moderna

A partir del siglo XII, las traducciones del árabe al latín introdujeron la alquimia en Europa. En el siglo XVI, **Paracelso** orientó parte de la práctica hacia la preparación de medicamentos. Incluso **Isaac Newton** dedicó años a experimentos y escritos alquímicos.

## ¿Alquimia o química?

Los historiadores William Newman y Lawrence Principe mostraron que, hasta finales del siglo XVII, los términos *alchymia* y *chymia* se usaban casi como sinónimos. La separación nítida entre una alquimia «oculta» y una química «científica» se consolidó sobre todo en el siglo XVIII. Por eso hoy se reconoce que muchos alquimistas contribuyeron al desarrollo de técnicas de laboratorio como la destilación y la sublimación.

## Simbolismo

Los textos alquímicos emplean un rico lenguaje de imágenes —dragones, bodas químicas, el uróboro— para describir procesos materiales y, en algunos autores, transformaciones espirituales. En el siglo XX, el psiquiatra Carl Gustav Jung propuso una lectura psicológica de ese simbolismo; se trata de una **interpretación moderna**, no de la intención documentada de la mayoría de los alquimistas.
`,
  },
];
