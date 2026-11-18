/**
 * Fuentes bibliográficas de los artículos de demostración.
 *
 * IMPORTANTE (trazabilidad): estas referencias corresponden a obras, artículos e
 * instituciones reales, pero fueron recopiladas durante la redacción asistida por IA
 * en un entorno sin acceso a Internet. Por eso se cargan con `verification = "pending"`
 * y `accessedAt = null`: un editor debe comprobar cada una (Administración › Fuentes)
 * antes de marcarla como verificada. Nunca se debe fingir una fecha de consulta.
 */
export type SeedSource = {
  key: string;
  kind: "book" | "journal_article" | "website" | "dataset" | "api" | "archive" | "official_document" | "other";
  title: string;
  authors?: string;
  publisher?: string;
  year?: number;
  url?: string;
  doi?: string;
  provider?: string;
  reusePolicy: "external_link" | "api_query" | "open_data" | "reusable" | "commercial_license" | "copyrighted";
  license?: string;
};

export const SOURCES: SeedSource[] = [
  // ── Historia antigua ──
  { key: "shaw-egypt", kind: "book", title: "The Oxford History of Ancient Egypt", authors: "Ian Shaw (ed.)", publisher: "Oxford University Press", year: 2000, reusePolicy: "copyrighted" },
  { key: "lehner-pyramids", kind: "book", title: "The Complete Pyramids", authors: "Mark Lehner", publisher: "Thames & Hudson", year: 1997, reusePolicy: "copyrighted" },
  { key: "unesco-86", kind: "website", title: "Memphis and its Necropolis – the Pyramid Fields from Giza to Dahshur", provider: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/86", reusePolicy: "external_link" },
  { key: "pomeroy-greece", kind: "book", title: "Ancient Greece: A Political, Social, and Cultural History", authors: "Sarah B. Pomeroy, Stanley M. Burstein, Walter Donlan, Jennifer Tolbert Roberts", publisher: "Oxford University Press", year: 1999, reusePolicy: "copyrighted" },
  { key: "unesco-404", kind: "website", title: "Acropolis, Athens", provider: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/404", reusePolicy: "external_link" },
  { key: "beard-spqr", kind: "book", title: "SPQR: A History of Ancient Rome", authors: "Mary Beard", publisher: "Profile Books", year: 2015, reusePolicy: "copyrighted" },
  { key: "hopkins-colosseum", kind: "book", title: "The Colosseum", authors: "Keith Hopkins, Mary Beard", publisher: "Profile Books", year: 2005, reusePolicy: "copyrighted" },
  { key: "unesco-91", kind: "website", title: "Historic Centre of Rome, the Properties of the Holy See in that City Enjoying Extraterritorial Rights and San Paolo Fuori le Mura", provider: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/91", reusePolicy: "external_link" },
  { key: "vandemieroop-ane", kind: "book", title: "A History of the Ancient Near East, ca. 3000–323 BC", authors: "Marc Van De Mieroop", publisher: "Blackwell", year: 2004, reusePolicy: "copyrighted" },
  { key: "schmandt-writing", kind: "book", title: "How Writing Came About", authors: "Denise Schmandt-Besserat", publisher: "University of Texas Press", year: 1996, reusePolicy: "copyrighted" },
  { key: "bellwood-farmers", kind: "book", title: "First Farmers: The Origins of Agricultural Societies", authors: "Peter Bellwood", publisher: "Blackwell", year: 2005, reusePolicy: "copyrighted" },
  { key: "zeder-2011", kind: "journal_article", title: "The Origins of Agriculture in the Near East", authors: "Melinda A. Zeder", publisher: "Current Anthropology 52(S4): S221–S235", year: 2011, doi: "10.1086/659307", reusePolicy: "copyrighted" },

  // ── Universo ──
  { key: "planck-2018", kind: "journal_article", title: "Planck 2018 results. VI. Cosmological parameters", authors: "Planck Collaboration", publisher: "Astronomy & Astrophysics 641, A6", year: 2020, doi: "10.1051/0004-6361/201833910", reusePolicy: "copyrighted" },
  { key: "penzias-wilson-1965", kind: "journal_article", title: "A Measurement of Excess Antenna Temperature at 4080 Mc/s", authors: "Arno A. Penzias, Robert W. Wilson", publisher: "The Astrophysical Journal 142: 419–421", year: 1965, doi: "10.1086/148307", reusePolicy: "copyrighted" },
  { key: "weinberg-first-three", kind: "book", title: "The First Three Minutes: A Modern View of the Origin of the Universe", authors: "Steven Weinberg", publisher: "Basic Books", year: 1977, reusePolicy: "copyrighted" },
  { key: "nasa-solar-system", kind: "website", title: "Solar System Exploration", provider: "NASA Science", url: "https://science.nasa.gov/solar-system/", reusePolicy: "external_link", license: "Los contenidos de NASA suelen ser de dominio público; verificar cada recurso." },
  { key: "iau-2006-b5", kind: "official_document", title: "Resolution B5: Definition of a Planet in the Solar System", provider: "International Astronomical Union (XXVI General Assembly, Praga)", year: 2006, reusePolicy: "external_link" },
  { key: "eht-2019", kind: "journal_article", title: "First M87 Event Horizon Telescope Results. I. The Shadow of the Supermassive Black Hole", authors: "Event Horizon Telescope Collaboration", publisher: "The Astrophysical Journal Letters 875: L1", year: 2019, doi: "10.3847/2041-8213/ab0ec7", reusePolicy: "reusable", license: "CC BY 3.0" },
  { key: "ligo-2016", kind: "journal_article", title: "Observation of Gravitational Waves from a Binary Black Hole Merger", authors: "B. P. Abbott et al. (LIGO Scientific Collaboration and Virgo Collaboration)", publisher: "Physical Review Letters 116, 061102", year: 2016, doi: "10.1103/PhysRevLett.116.061102", reusePolicy: "reusable", license: "CC BY 3.0" },

  // ── Ciencias ──
  { key: "watson-crick-1953", kind: "journal_article", title: "Molecular Structure of Nucleic Acids: A Structure for Deoxyribose Nucleic Acid", authors: "J. D. Watson, F. H. C. Crick", publisher: "Nature 171: 737–738", year: 1953, doi: "10.1038/171737a0", reusePolicy: "copyrighted" },
  { key: "franklin-gosling-1953", kind: "journal_article", title: "Molecular Configuration in Sodium Thymonucleate", authors: "Rosalind E. Franklin, R. G. Gosling", publisher: "Nature 171: 740–741", year: 1953, doi: "10.1038/171740a0", reusePolicy: "copyrighted" },
  { key: "darwin-origin", kind: "book", title: "On the Origin of Species by Means of Natural Selection", authors: "Charles Darwin", publisher: "John Murray (edición digital en Project Gutenberg)", year: 1859, url: "https://www.gutenberg.org/ebooks/1228", provider: "Project Gutenberg", reusePolicy: "reusable", license: "Dominio público" },
  { key: "futuyma-evolution", kind: "book", title: "Evolution (4.ª ed.)", authors: "Douglas J. Futuyma, Mark Kirkpatrick", publisher: "Sinauer Associates / Oxford University Press", year: 2017, reusePolicy: "copyrighted" },

  // ── Personajes ──
  { key: "nobel-curie-1903", kind: "website", title: "Marie Curie – Facts – The Nobel Prize in Physics 1903", provider: "NobelPrize.org", url: "https://www.nobelprize.org/prizes/physics/1903/marie-curie/facts/", reusePolicy: "external_link" },
  { key: "nobel-curie-1911", kind: "website", title: "Marie Curie – Facts – The Nobel Prize in Chemistry 1911", provider: "NobelPrize.org", url: "https://www.nobelprize.org/prizes/chemistry/1911/marie-curie/facts/", reusePolicy: "external_link" },
  { key: "quinn-curie", kind: "book", title: "Marie Curie: A Life", authors: "Susan Quinn", publisher: "Simon & Schuster", year: 1995, reusePolicy: "copyrighted" },
  { key: "isaacson-leonardo", kind: "book", title: "Leonardo da Vinci", authors: "Walter Isaacson", publisher: "Simon & Schuster", year: 2017, reusePolicy: "copyrighted" },
  { key: "kemp-leonardo", kind: "book", title: "Leonardo da Vinci: The Marvellous Works of Nature and Man", authors: "Martin Kemp", publisher: "Harvard University Press", year: 1981, reusePolicy: "copyrighted" },
  { key: "turing-1936", kind: "journal_article", title: "On Computable Numbers, with an Application to the Entscheidungsproblem", authors: "Alan M. Turing", publisher: "Proceedings of the London Mathematical Society s2-42(1): 230–265", year: 1936, doi: "10.1112/plms/s2-42.1.230", reusePolicy: "copyrighted" },
  { key: "turing-1950", kind: "journal_article", title: "Computing Machinery and Intelligence", authors: "Alan M. Turing", publisher: "Mind 59(236): 433–460", year: 1950, doi: "10.1093/mind/LIX.236.433", reusePolicy: "copyrighted" },
  { key: "hodges-turing", kind: "book", title: "Alan Turing: The Enigma", authors: "Andrew Hodges", publisher: "Burnett Books / Simon & Schuster", year: 1983, reusePolicy: "copyrighted" },

  // ── Tecnología e IA ──
  { key: "cerf-kahn-1974", kind: "journal_article", title: "A Protocol for Packet Network Intercommunication", authors: "Vinton G. Cerf, Robert E. Kahn", publisher: "IEEE Transactions on Communications 22(5): 637–648", year: 1974, doi: "10.1109/TCOM.1974.1092259", reusePolicy: "copyrighted" },
  { key: "berners-lee-1989", kind: "archive", title: "Information Management: A Proposal", authors: "Tim Berners-Lee", provider: "CERN", year: 1989, reusePolicy: "external_link" },
  { key: "abbate-internet", kind: "book", title: "Inventing the Internet", authors: "Janet Abbate", publisher: "MIT Press", year: 1999, reusePolicy: "copyrighted" },
  { key: "dartmouth-1955", kind: "archive", title: "A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence", authors: "John McCarthy, Marvin Minsky, Nathaniel Rochester, Claude Shannon", year: 1955, reusePolicy: "external_link" },
  { key: "aima-4", kind: "book", title: "Artificial Intelligence: A Modern Approach (4.ª ed.)", authors: "Stuart Russell, Peter Norvig", publisher: "Pearson", year: 2020, reusePolicy: "copyrighted" },
  { key: "rumelhart-1986", kind: "journal_article", title: "Learning representations by back-propagating errors", authors: "David E. Rumelhart, Geoffrey E. Hinton, Ronald J. Williams", publisher: "Nature 323: 533–536", year: 1986, doi: "10.1038/323533a0", reusePolicy: "copyrighted" },
  { key: "vaswani-2017", kind: "journal_article", title: "Attention Is All You Need", authors: "Ashish Vaswani et al.", publisher: "Advances in Neural Information Processing Systems 30 (NeurIPS 2017); arXiv:1706.03762", year: 2017, url: "https://arxiv.org/abs/1706.03762", reusePolicy: "external_link" },

  // ── Paraguay y América Latina ──
  { key: "ine-py", kind: "dataset", title: "Censo Nacional de Población y Viviendas 2022 y estadísticas oficiales", provider: "Instituto Nacional de Estadística (INE) del Paraguay", url: "https://www.ine.gov.py/", reusePolicy: "open_data" },
  { key: "constitucion-py-1992", kind: "official_document", title: "Constitución de la República del Paraguay", provider: "Convención Nacional Constituyente", year: 1992, reusePolicy: "reusable", license: "Documento oficial" },
  { key: "ley-lenguas-py", kind: "official_document", title: "Ley N.º 4251/2010 de Lenguas", provider: "Congreso de la Nación Paraguaya", year: 2010, reusePolicy: "reusable", license: "Documento oficial" },
  { key: "whigham-war", kind: "book", title: "The Paraguayan War, Volume 1: Causes and Early Conduct", authors: "Thomas L. Whigham", publisher: "University of Nebraska Press", year: 2002, reusePolicy: "copyrighted" },
  { key: "unesco-648", kind: "website", title: "Jesuit Missions of La Santísima Trinidad de Paraná and Jesús de Tavarangue", provider: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/648", reusePolicy: "external_link" },
  { key: "unesco-274", kind: "website", title: "Historic Sanctuary of Machu Picchu", provider: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/list/274", reusePolicy: "external_link" },
  { key: "burger-machu-2004", kind: "book", title: "Machu Picchu: Unveiling the Mystery of the Incas", authors: "Richard L. Burger, Lucy C. Salazar (eds.)", publisher: "Yale University Press", year: 2004, reusePolicy: "copyrighted" },
  { key: "burger-2021", kind: "journal_article", title: "New AMS dates for Machu Picchu: results and implications", authors: "Richard L. Burger, Lucy C. Salazar, Jason Nesbitt, Eden Washburn, Lars Fehren-Schmitz", publisher: "Antiquity 95(383): 1265–1279", year: 2021, doi: "10.15184/aqy.2021.99", reusePolicy: "reusable", license: "CC BY 4.0" },

  // ── Medicina ──
  { key: "kandel-6", kind: "book", title: "Principles of Neural Science (6.ª ed.)", authors: "Eric R. Kandel, John D. Koester, Sarah H. Mack, Steven A. Siegelbaum (eds.)", publisher: "McGraw Hill", year: 2021, reusePolicy: "copyrighted" },
  { key: "azevedo-2009", kind: "journal_article", title: "Equal numbers of neuronal and nonneuronal cells make the human brain an isometrically scaled-up primate brain", authors: "Frederico A. C. Azevedo et al.", publisher: "Journal of Comparative Neurology 513(5): 532–541", year: 2009, doi: "10.1002/cne.21974", reusePolicy: "copyrighted" },

  // ── Religiones ──
  { key: "harvey-buddhism", kind: "book", title: "An Introduction to Buddhism: Teachings, History and Practices (2.ª ed.)", authors: "Peter Harvey", publisher: "Cambridge University Press", year: 2013, reusePolicy: "copyrighted" },
  { key: "gethin-buddhism", kind: "book", title: "The Foundations of Buddhism", authors: "Rupert Gethin", publisher: "Oxford University Press", year: 1998, reusePolicy: "copyrighted" },

  // ── Esoterismo ──
  { key: "principe-alchemy", kind: "book", title: "The Secrets of Alchemy", authors: "Lawrence M. Principe", publisher: "University of Chicago Press", year: 2013, reusePolicy: "copyrighted" },
  { key: "newman-principe-1998", kind: "journal_article", title: "Alchemy vs. Chemistry: The Etymological Origins of a Historiographic Mistake", authors: "William R. Newman, Lawrence M. Principe", publisher: "Early Science and Medicine 3(1): 32–65", year: 1998, reusePolicy: "copyrighted" },
];
