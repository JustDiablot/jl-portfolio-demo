// Contenu du portfolio : projets graphiques, explorations, carnets, tableaux.
// Les images sont dans images/p/<slug>/ (versions web .webp).
//   tete   = visuels affichés sur le fil de la page d'accueil
//   images = visuels de la page dédiée (projet.html?id=<slug>)

const IMG = (slug, names) => names.map((n) => "images/p/" + slug + "/" + n + ".webp");
// Une image avec options : I("lunatik", "1", { taille: "petit" })
const I = (slug, n, opts) => ({ src: "images/p/" + slug + "/" + n + ".webp", ...(opts || {}) });
// Plusieurs images côte à côte, à la même hauteur, avec une légende commune facultative :
// L("slug", ["a", "b"], { leg, taille })  taille "centre" = ligne moins large et centrée
const L = (slug, names, opts) => ({ ligne: IMG(slug, names), ...(opts || {}) });
// Composition : une grande image à gauche, les suivantes plus petites à droite (maquette Marmites)
const C = (slug, names, opts) => ({ compo: IMG(slug, names), ...(opts || {}) });

// Lenny et Julie : même procédé pour les deux livrets (demande Julie) :
// couverture seule, quatre doubles pages deux par deux, dernière page seule.
const LENNY_IMAGES = [
  I("lenny-et-julie", "img-8441", { taille: "seule" }),
  ...IMG("lenny-et-julie", ["img-8442", "img-8443", "img-8445", "img-8444"]),
  I("lenny-et-julie", "img-8446", { taille: "seule" }),
  I("lenny-et-julie", "img-8447", { taille: "seule" }),
  ...IMG("lenny-et-julie", ["img-8449", "img-8450", "img-8455", "img-8458"]),
  I("lenny-et-julie", "img-8460", { taille: "seule" })
];

const PROJETS = [
  {
    slug: "lunatik",
    titre: "Lunatik",
    logo: "images/p/lunatik/tete-logo-lunatik-tete-de-page.webp",
    // en-tête : double page + couverture posée par-dessus (maquette de Julie)
    tete: IMG("lunatik", ["tete-jkhgfy", "edition"]),
    teteChevauche: true,
    images: [
      I("lunatik", "1", { taille: "petit" }),
      ...IMG("lunatik", ["2", "3", "4", "5", "6", "7", "8", "couple", "ioutyredufgioh"])
    ],
    texte: [
      "LUNATIK est un projet d'édition présentant le portrait d’une personne occupant une place particulière dans ma vie : Luna. Le titre est un jeu de mot entre le prénom Luna et l'adjectif lunatique. Le projet cherche à retranscrire son univers, sa personnalité et différents aspects de son identité à travers une succession de visuels et détails.",
      "L'identité visuelle s’inspire du travail du studio Design Ranch pour The Women’s Foundation, We Work for Change, 25th Anniversary.",
      "L’édition a été entièrement conçue sur Photoshop, Illustrator et InDesign. La recherche et la composition des différents éléments graphiques m'ont permis de construire un univers visuel semblable à celui de Luna en variant les supports : QR codes, textes, photographies, illustrations vectorisées..",
      "Un projet riche qui m'a permis d'unifier authenticité, amour et design graphique."
    ]
  },
  {
    slug: "vivienne-westwood",
    titre: "Vivienne Westwood",
    logo: "images/p/vivienne-westwood/tete-logo-vivienne-tete-de-page.webp",
    tete: IMG("vivienne-westwood", ["tete-couverture", "tete-vue-de-droite", "tete-vue-du-haut"]),
    images: [
      I("vivienne-westwood", "1-rogne", { taille: "seule" }),
      I("vivienne-westwood", "2", { taille: "seule" }),
      ...IMG("vivienne-westwood", ["3", "4", "5", "6"]),
      I("vivienne-westwood", "7-rogne", { taille: "portrait" }),
      ...IMG("vivienne-westwood", ["8", "9"])
    ],
    texte: [
      "Lors d’un projet scolaire, j’ai imaginé un événement de défilé en hommage à Vivienne Westwood. J’ai tout d’abord réalisé différentes planches de recherches afin d’explorer son univers, ses références et les éléments caractéristiques de son identité.",
      "J’ai ensuite créé un flyer ainsi qu’un livret regroupant des dessins en perspective. J’ai choisi de mettre en avant Vivienne Westwood pour son approche audacieuse, engagée et anticonformiste, ainsi que pour sa capacité à mêler création et revendication.",
      "Ce projet complet m’a permis de mobiliser différentes compétences, notamment le dessin, la composition et le design graphique, tout en explorant la création de supports liés à la communication événementielle."
    ]
  },
  {
    slug: "o-marmites-du-monde",
    titre: "Ô Marmites du Monde",
    logo: "images/p/o-marmites-du-monde/tete-logo-carre.webp",
    logoFiche: "images/p/o-marmites-du-monde/logo-titre.webp",
    tete: IMG("o-marmites-du-monde", ["tete-1", "4", "repas-du-09.10.2026"]),
    images: [
      I("o-marmites-du-monde", "img-1327", { taille: "droite", leg: "Choix collaboratif en fonction des différentes propositions des élèves." }),
      I("o-marmites-du-monde", "voyage-en-cuisine", { taille: "droite", leg: "Mon inspiration principale, Voyage en cuisine." }),
      I("o-marmites-du-monde", "3-plan-de-travail-illustrator", { taille: "droite", leg: "Mon plan de travail sur Illustrator." }),
      I("o-marmites-du-monde", "2", { taille: "grand", leg: "Ma proposition." }),
      I("o-marmites-du-monde", "1", { taille: "seule" }),
      L("o-marmites-du-monde", ["repas-du-09.10.2026", "repas-du-09.10-2", "repas-du-09.10-3"], { leg: "Repas du 9 octobre 2026 à la maison de quartiers des Aunettes, Évry-Courcouronnes." }),
      C("o-marmites-du-monde", ["4", "5", "5.2", "6"], { leg: "Mockups réalisés à l'aide de l'IA." })
    ],
    texte: [
      "Dans le cadre d’un projet d’innovation sociale, j’ai développé une identité visuelle pour l’association Ô Marmites du Monde, basée à Évry-Courcouronnes. L’association réunit un groupe de femmes qui prépare des repas solidaires destinés à des personnes en situation de précarité.",
      "J’ai proposé un logo, des motifs graphiques en lien avec la cuisine du monde et différents éléments visuels destinés à habiller les lieux lors des repas. L’objectif était de créer une identité visuelle propre à l’association, tout en imaginant des solutions de décoration modulables et facilement déplaçables.",
      "J’ai opté pour une identité aux lignes fines et aux traits faits à la main, ainsi que pour des couleurs chaudes, afin de rappeler les valeurs humaine et conviviale de l'évènement.",
      "Je me suis inspirée de l’univers visuel de « Voyage en cuisine » d’ARTE, notamment pour ses illustrations simples, dessinées à la main et en aplats monochromes. J’ai repris cette approche pour créer des visuels épurés, lisibles et chaleureux, avec des lignes fines et des couleurs chaudes."
    ]
  },
  {
    slug: "lenny-et-julie",
    titre: "Lenny et Julie",
    logo: "images/p/lenny-et-julie/tete-logo-julie-lenny-tet-de-page.webp",
    tete: IMG("lenny-et-julie", ["tete-camscanner-08-10-2026-16.18-4", "tete-camscanner-08-10-2026-16.18-3"]),
    images: LENNY_IMAGES,
    texte: [
      "Cette collection de deux objets éditoriaux est composée de livrets de souvenirs personnels réunissant photographies, textes et compositions graphiques. L’objectif était de créer des supports permettant d’immortaliser des souvenirs et des moments importants à travers une identité visuelle propre à chacun des livrets.",
      "Entièrement réalisés avec la suite Adobe, notamment Photoshop, Illustrator et InDesign, ce projet m’a permis d’explorer différentes techniques de composition, de mise en page et de traitement de l’image.",
      "J’ai choisi de structurer les livrets autour des mois de l’année et des différents événements, afin de créer une progression chronologique et de permettre une immersion dans chaque souvenir."
    ]
  },
  {
    slug: "welcome-party",
    titre: "Welcome Party",
    logo: "images/p/welcome-party/tete-logo.webp",
    tete: IMG("welcome-party", ["2.1", "tete-capture-d-ecran-2026-02-28-170311", "7"]),
    images: [
      I("welcome-party", "1", { taille: "seule" }),
      // photo 5 seulement dans le trio du stand (évite le doublon)
      I("welcome-party", "4", { taille: "grand" }),
      L("welcome-party", ["2.3", "2.4"], { taille: "centre" }),
      I("welcome-party", "2.5", { taille: "grand" }),
      I("welcome-party", "3", { taille: "grand" }),
      I("welcome-party", "2.1", { taille: "seule" }),
      I("welcome-party", "2.2", { taille: "grand" }),
      I("welcome-party", "tete-logo", { taille: "petit" }),
      I("welcome-party", "5.2", { taille: "grand" }),
      I("welcome-party", "flyer", { taille: "grand" }),
      L("welcome-party", ["7", "6", "5"], { leg: "Stand des DN MADE lors de l'évènement de la Welcome Party, le 2 octobre 2025." })
    ],
    pdf: "docs/compte-rendu-welcome-party.pdf",
    texte: [
      "À l’occasion de la Welcome Party 2025, un événement destiné aux nouveaux étudiants d’Évry-Courcouronnes, notre classe de DN MADE a participé à un stand ludique pour leur faire découvrir la ville. Le projet s’articulait autour de quatre thématiques : l’architecture, l’art urbain, la musique et le sport.",
      "Après plusieurs recherches et une exploration de la ville, nous avons développé différents supports graphiques pour accompagner les parcours. Avec Anais Foenkinos, j’ai participé à la création de la charte graphique. J’ai notamment dessiné les pictogrammes au feutre avant de les vectoriser sur Illustrator.",
      "J’ai également participé à la conception du livret consacré à l’architecture et d’un flyer donnant accès aux parcours numériques. Ce projet m’a permis de renforcer ma maîtrise de la suite Adobe, tout en développant ma capacité à travailler au sein d’une équipe et à confronter mes réalisations au public."
    ]
  },
  {
    slug: "grand-gala",
    titre: "Le Grand Gala",
    logo: "images/p/grand-gala/tete-logo-orange.webp",
    tete: IMG("grand-gala", ["1", "charte-graphique", "menu"]),
    images: [
      L("grand-gala", ["1", "arche"]),
      I("grand-gala", "4", { taille: "grand" }),
      I("grand-gala", "6", { taille: "grand" }),
      I("grand-gala", "charte-graphique", { taille: "seule", leg: "Charte graphique du Grand Gala" }),
      I("grand-gala", "9", { taille: "grand" }),
      I("grand-gala", "menu", { taille: "seule" })
    ],
    pdf: "docs/compte-rendu-grand-gala.pdf",
    texte: [
      "Le Grand Gala « Vous déroule son tapis rouge » est un événement solidaire organisé chaque année depuis 15 ans à Évry-Courcouronnes, destiné aux habitants de la ville en situation de précarité. L’objectif est de leur offrir un moment de partage et de leur permettre de vivre une véritable soirée de gala, autour du thème du glamour.",
      "Kinza, coordinatrice culturelle des maisons de quartier des Épinettes et des Aunettes, a fait appel à notre classe pour imaginer l’aménagement et la décoration de la salle. Nous avons conçu une ambiance lumineuse, une scène, une arche d’entrée, un photobooth ainsi que différents éléments graphiques : menus, portes-noms et programme. L’univers s’inspirait notamment du cinéma, d’Hollywood, du Met Gala et des Oscars, avec une dominante rouge, des touches dorées et un mélange entre ancien et contemporain.",
      "Avec Anaïs Foenkinos, j’ai pris en charge la création de la charte graphique du projet à partir du moodboard réalisé collectivement. Nous avons travaillé sur les typographies, les couleurs et le logo. J’ai également participé à la création du menu, en veillant à reprendre les éléments de la charte graphique.",
      "Ce projet m’a permis de développer mes compétences en travail d’équipe et en gestion de projet, tout en renforçant ma maîtrise de la suite Adobe, de la mise en page et de l’impression. Enfin, la dimension solidaire du projet m’a permis de comprendre comment le graphisme et l’événementiel peuvent contribuer à créer une expérience valorisante pour un public."
    ]
  }
];

// Explorations présentées comme les projets (même fil, même page dédiée), sans logo.
const EXPLORATIONS = [
  {
    slug: "augmentation-plastique",
    titre: "Augmentation plastique d'une photo",
    tete: IMG("augmentation-plastique", ["photo-principale", "3"]),
    // études 1 à 4 (numéro écrit en bas à gauche de chaque page) : fichiers 3, 2, 1, 4
    images: [
      I("augmentation-plastique", "photo-principale", { taille: "seule-gauche" }),
      ...["3", "2", "1", "4"].map((n) => I("augmentation-plastique", n, { taille: "grand" })),
      I("augmentation-plastique", "5", { taille: "seule", leg: "Exploration des contrastes à la peinture acrylique." }),
      I("augmentation-plastique", "6", { taille: "seule", leg: "Première couche de peinture acrylique jaune, puis exploration des ombres à la craie grasse." })
    ],
    texte: [
      "À partir d’une photographie d’un espace intérieur, j’ai mené une recherche plastique par augmentation progressive de l’image. Chaque étape consiste à extraire, amplifier et transformer certains éléments visuels, comme les formes, les lignes, les volumes et les couleurs, afin d’en explorer les possibilités graphiques. Les expérimentations passent du dessin et de la simplification à la superposition, la déformation et l’intensification chromatique, faisant progressivement évoluer l’image tout en conservant certains de ses repères initiaux."
    ]
  },
  {
    slug: "paysage-onirique",
    titre: "Créer un paysage onirique",
    tete: IMG("paysage-onirique", ["paysag-e1", "camscanner-08-10-2026-19.29-4", "camscanner-08-10-2026-19.29-1"]),
    images: [
      I("paysage-onirique", "camscanner-06-03-2026-12.34-12", { taille: "demi" }),
      L("paysage-onirique", ["camscanner-08-10-2026-19.29-5", "camscanner-08-10-2026-19.29-6", "camscanner-08-10-2026-19.29-7"]),
      ...["2", "3", "1", "4"].map((n) => I("paysage-onirique", "camscanner-08-10-2026-19.29-" + n, { taille: "grand" })),
      L("paysage-onirique", ["paysag-e1", "paysag-e2", "paysag-e3"], { leg: "Paysages oniriques finaux." })
    ],
    texte: [
      "L’objectif de cette expérimentation était de se familiariser avec la technique de la linogravure à travers les thèmes du minéral et de la végétation. J’ai créé différentes matrices en explorant les formes, textures et motifs, puis je les ai combinées pour réaliser trois compositions. Cette recherche m’a permis d’expérimenter les possibilités de la technique, notamment la répétition, la superposition, le rythme et la variation des formes."
    ]
  }
];

// Carnets : couverture détourée + dessins affichés en grand (galerie.html?id=<slug>).
const CARNETS = [
  {
    slug: "carnet-observations",
    titre: "carnet d’observations",
    couverture: "images/p/carnets/observations.webp",
    texte: [
      "Ce carnet d’observations rassemble des dessins de personnes qui m’entourent. À travers ces représentations, je cherche à saisir un mouvement, un instant suspendu. Je m’intéresse particulièrement aux émotions et aux pensées, à ces moments où l’humain ressent sans nécessairement l’exprimer. Ce carnet est pour moi un moyen d’observer les attitudes et les expressions pour traduire, par le dessin, une présence et une sensibilité."
    ],
    // nouveau tri de Julie (envoi du 20/10), mêmes dessins que les versions redressées
    images: IMG("carnet-observations", ["1", "13", "2", "8", "3", "12", "5", "4", "7", "9", "10", "11"])
  },
  {
    slug: "carnet-analytique",
    titre: "carnet de dessins analytiques",
    couverture: "images/p/carnets/analytique.webp",
    texte: [
      "Ce carnet de dessins analytiques rassemble des observations de dispositifs scénographiques, de vitrines, de packagings et de présentations de produits. À travers des croquis, des schémas et des annotations, j’analyse les choix de conception, les matériaux utilisés et les techniques d’assemblage. Ce travail me permet de découvrir de nouveaux matériaux, de comprendre les procédés techniques mis en œuvre et de développer ma culture visuelle."
    ],
    images: IMG("carnet-analytique", ["vitrine-louis-vuitton-vandome", "vitrine-vacheron-constantin", "livre-dans-mon-petit-coeur", "salon-du-livre-superpositions-et-objets-editoriaux", "packaging", "plv-dispositif-westfield", "vitrine-lv-et-oeelin", "vitrine-chopard", "vitrine-bompard", "croquis-ameliore", "camscanner-07-01-2026-23.07-8"])
  },
  {
    slug: "carnet-recherches",
    titre: "carnet de recherches graphiques",
    couverture: "images/p/carnets/recherches.webp",
    texte: [
      "À travers ce carnet de recherches graphiques, j’aime découvrir à chaque page un nouvel univers que je ne cesse de développer. Tenir ce carnet me permet d’entretenir ma créativité, d’explorer différentes approches plastiques et de nourrir une démarche créative qui m’est utile aussi bien dans mes projets scolaires que personnels."
    ],
    images: IMG("carnet-recherches", ["1", "2", "3", "4", "5", "5.2", "6", "7", "8", "9", "10", "11", "12"])
  }
];

// Tableaux : 1 grande image + 2 vignettes sur l'accueil, toutes les images en grand au clic.
const TABLEAUX = [
  {
    slug: "amy-winehouse",
    titre: "Amy Winehouse",
    collerVignettes: true,
    images: IMG("amy-winehouse", ["1", "2-2", "3", "4"]),
    texte: [
      "À partir d’une photographie d’Amy Winehouse fuyant les paparazzis à la sortie de chez elle, j’ai souhaité proposer une interprétation personnelle de cette scène. Le rose fluorescent, par son intensité, traduit l’ambivalence de sa popularité, entre reconnaissance et souffrance. Les feuilles d’or viennent souligner le contraste entre son image publique de célébrité et son attachement à la musique, au-delà de la gloire et de l’argent.",
      "À travers ce tableau, je cherche à retranscrire, avec mon propre regard, ce qu’Amy Winehouse a pu ressentir à cet instant. Les couleurs et les matières amplifient cette émotion, jusqu’à bousculer, voire déranger le regard. Une manière d’interroger la violence de l’exposition médiatique et ce qu’elle peut faire ressentir à celle qui la subit."
    ]
  },
  {
    slug: "exploration",
    titre: "Exploration",
    images: IMG("exploration", ["1", "2", "3", "4", "5"]),
    texte: [
      "En associant différents types de peinture et de techniques, j’ai voulu laisser libre cours à ma créativité et à mon imagination. J’ai mélangé les styles, en travaillant les portraits de manière réaliste tout en laissant le fond plus libre, avec des dessins, des écritures et des couleurs qui se superposent. Cette peinture m’a permis d’expérimenter sans me limiter à une seule façon de faire."
    ]
  },
  {
    slug: "frida-ou-freedom",
    titre: "Frida, Freedom",
    images: IMG("frida-ou-freedom", ["1", "2", "3"]),
    texte: [
      "En associant la peinture à l’huile et la peinture acrylique, je joue sur la rencontre entre deux matières aux propriétés différentes. Leur contraste devient un moyen de représenter la confrontation entre l’univers singulier de Frida Kahlo et le monde qui l’entoure. Par une approche volontairement brute et contrastée, j’ai cherché à créer un dialogue visuel entre ces deux univers."
    ]
  },
  {
    slug: "la-scene-2026",
    titre: "2026",
    images: IMG("la-scene-2026", ["1", "2", "3", "4", "5"]),
    texte: [
      "À travers cette peinture, j’ai choisi de détourner La Cène de Léonard de Vinci pour questionner la place de dieu dans notre société actuelle et les changements que cette évolution implique. En transposant cette scène religieuse dans un contexte contemporain, j’ai voulu interroger l’évolution de nos croyances et de nos repères, dans un monde où les religions occupent une place de moins en moins centrale."
    ]
  },
  {
    slug: "new-way",
    titre: "New Way",
    collerVignettes: true,
    images: IMG("new-way", ["1", "2", "3", "4"]),
    texte: [
      "À travers cette peinture, j’interroge l’impact de la production de masse sur notre planète, en mettant l’accent sur la pollution des océans. Cette démarche soulève une question : comment trouver une issue à un problème dont nous sommes nous-mêmes à l’origine ?"
    ]
  },
  {
    slug: "rafe",
    titre: "Rafe",
    titreMasque: true,
    images: IMG("rafe", ["1", "2", "3", "4"]),
    texte: [
      "Cette peinture à l’huile est une étude du réalisme à partir d’une photographie. J’ai porté une attention particulière au traitement du visage, aux nuances de couleurs et aux détails qui composent l’expression. Le travail du regard occupe une place centrale dans cette réalisation, avec la volonté de retranscrire l’émotion présente dans l’image de référence. Ce projet m’a permis d’approfondir ma maîtrise technique de la peinture à l’huile et mon approche de la représentation réaliste."
    ]
  }
];

// Recherche d'une entrée par slug, toutes rubriques confondues.
function trouver(slug) {
  const fiches = [...PROJETS, ...EXPLORATIONS].map((e) => ({ ...e, type: "projet" }));
  const galeries = [...CARNETS.map((e) => ({ ...e, type: "carnet" })), ...TABLEAUX.map((e) => ({ ...e, type: "tableau" }))];
  return [...fiches, ...galeries].find((e) => e.slug === slug);
}
