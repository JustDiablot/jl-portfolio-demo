// Pages dédiées : projet.html?id=<slug> (projets et explorations)
// et galerie.html?id=<slug> (carnets et tableaux, images en grand sans texte).

function introuvable(main) {
  main.innerHTML = '<p>Cette page n\'existe pas. <a href="index.html">Retour à l\'accueil</a></p>';
}

// Une entrée d'image peut être un simple chemin ("images/.../x.webp"),
// un objet { src, leg, taille, alt } ou une ligne { ligne: [chemins], leg, taille }.
//   leg    : légende affichée sous l'image (ou sous la ligne)
//   taille : "grand" (toute la largeur), "seule" (seule sur une ligne, centrée),
//            "petit" (seule, petite et centrée), "demi-centre" (seule, moitié de la largeur),
//            "seule-gauche" (seule, calée à gauche), "droite" (colonne de droite),
//            "demi" (colonne de gauche, moitié de sa largeur) ;
//            pour une ligne : "centre" (ligne moins large, centrée).
//   gauche : true pour caler à gauche une image seule sur sa ligne ; cote : "droit" pour la caler à droite.
//   Par défaut : grille deux colonnes ; les visuels très larges passent en pleine largeur.
//   Une ligne prend toute la largeur ; ses images ont la même hauteur.
const TAILLES = ["grand", "seule", "petit", "demi-centre", "portrait", "seule-gauche", "droite", "demi", "centre"];

function avecLegende(el, leg) {
  if (!leg) return el;
  const fig = document.createElement("figure");
  const cap = document.createElement("figcaption");
  cap.textContent = leg;
  fig.append(el, cap);
  return fig;
}

function elementImage(entry) {
  const o = typeof entry === "string" ? { src: entry } : entry;
  let el;
  let taille = o.taille;
  if (o.compo) {
    const compo = document.createElement("div");
    compo.className = "compo";
    o.compo.forEach((src, k) => {
      const img = image(src, "");
      if (k === 0) img.className = "compo-principale";
      compo.append(img);
    });
    el = avecLegende(compo, o.leg);
    el.classList.add("rang");
  } else if (o.ligne) {
    const ligne = document.createElement("div");
    ligne.className = "ligne";
    o.ligne.forEach((src) => {
      const img = image(src, "");
      img.style.flex = ratio(src) + " 1 0";
      ligne.append(img);
    });
    el = avecLegende(ligne, o.leg);
    el.classList.add("rang");
  } else {
    el = avecLegende(image(o.src, o.alt || ""), o.leg);
    taille = taille || (ratio(o.src) >= 1.55 ? "grand" : "");
  }
  if (taille === "grand") el.classList.add("large");
  else if (TAILLES.includes(taille)) el.classList.add(taille);
  if (o.gauche) el.classList.add("a-gauche");
  if (o.cote === "droit") el.classList.add("a-droite");
  return el;
}

// Lien précédent / suivant (FLECHE_SVG est dans commun.js).
function lienSuite(href, titre, sens) {
  const a = document.createElement("a");
  a.href = href;
  a.className = "suite-" + sens;
  const fleche = document.createElement("span");
  fleche.className = "suite-fleche";
  fleche.innerHTML = FLECHE_SVG;
  const nom = document.createElement("span");
  nom.className = "suite-nom";
  nom.textContent = titre;
  if (sens === "prec") a.append(fleche, nom);
  else a.append(nom, fleche);
  return a;
}

// Colonne de texte à droite : si le texte de Julie ne tient pas en hauteur dans l'écran,
// on élargit la colonne petit à petit (le texte n'est jamais coupé ni modifié).
function ajusterColonne(corps, aside) {
  if (window.matchMedia("(max-width: 700px)").matches) {
    corps.style.gridTemplateColumns = "";
    return;
  }
  const contenu = () => [...aside.children].reduce((h, el) => h + el.offsetHeight, 0) + 40;
  const largeurMax = Math.min(640, corps.clientWidth * 0.48);
  corps.style.gridTemplateColumns = "";
  aside.classList.remove("fiche-aside--long");
  let l = aside.clientWidth;
  while (contenu() > aside.clientHeight && l < largeurMax) {
    l += 20;
    corps.style.gridTemplateColumns = "minmax(0, 1fr) " + l + "px";
  }
  // écran trop bas même avec la colonne élargie : le texte défile avec la page
  if (contenu() > aside.clientHeight) aside.classList.add("fiche-aside--long");
}

function colonneTexte(corps, aside) {
  const maj = () => ajusterColonne(corps, aside);
  maj();
  window.addEventListener("resize", maj);
  if (document.fonts) document.fonts.ready.then(maj);
  window.addEventListener("load", maj, { once: true });
}

function pageProjet() {
  const main = document.querySelector("main");
  const liste = [...PROJETS, ...EXPLORATIONS];
  const i = liste.findIndex((e) => e.slug === parametre("id"));
  if (i < 0) return introuvable(main);
  const e = liste[i];
  document.title = e.titre + " | Julie Lagos";

  // Colonne de droite : titre + texte, qui restent en place pendant que
  // les images défilent à gauche (demande Julie).
  const aside = document.createElement("aside");
  aside.className = "fiche-aside";
  const h1 = document.createElement("h1");
  h1.className = "fiche-titre";
  // logoFiche : logo propre à la page du projet (sinon celui de l'accueil)
  if (e.logoFiche || e.logo) h1.append(image(e.logoFiche || e.logo, e.titre));
  else h1.textContent = e.titre;
  const texte = document.createElement("div");
  texte.className = "fiche-texte";
  e.texte.forEach((t) => {
    const p = document.createElement("p");
    p.textContent = t;
    texte.append(p);
  });
  if (e.pdf) {
    const a = document.createElement("a");
    a.className = "fiche-lien";
    a.href = e.pdf;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "en savoir plus";
    texte.append(a);
  }
  aside.append(h1, texte);

  // Images : deux colonnes ; certains visuels prennent toute la largeur,
  // sont seuls sur une ligne ou côte à côte (lignes), avec une légende éventuelle.
  const imgs = document.createElement("div");
  imgs.className = "fiche-images";
  e.images.forEach((entry) => imgs.append(elementImage(entry)));

  // Projet précédent / suivant
  const suite = document.createElement("nav");
  suite.className = "suite";
  const prec = liste[i - 1];
  const suiv = liste[i + 1];
  suite.append(
    lienSuite(prec ? "projet.html?id=" + prec.slug : "index.html#" + e.slug, prec ? prec.titre : "accueil", "prec"),
    lienSuite(suiv ? "projet.html?id=" + suiv.slug : "index.html#" + e.slug, suiv ? suiv.titre : "accueil", "suiv")
  );

  const corps = document.createElement("div");
  corps.className = "fiche-corps";
  corps.append(imgs, aside);
  main.append(corps, suite);
  main.classList.add("fiche--cotes");
  suite.classList.add("suite--cotes");
  colonneTexte(corps, aside);
  visionneuse(imgs.querySelectorAll("img"));
}

function pageGalerie() {
  const main = document.querySelector("main");
  const e = trouver(parametre("id"));
  if (!e || (e.type !== "carnet" && e.type !== "tableau")) return introuvable(main);
  document.title = e.titre + " | Julie Lagos";

  // Carnet (maquette 4 de Julie) : petite couverture + nom en haut, dessins deux par ligne.
  // Tableau : les images en grand, précédées du nom de l'œuvre.
  // Dans les deux cas, un texte de présentation est affiché comme sur les projets.
  const haut = document.createElement("div");
  haut.className = "fiche-haut";
  const h1 = document.createElement("h1");
  if (e.type === "carnet") {
    h1.className = "carnet-entete";
    const nom = document.createElement("span");
    nom.textContent = e.titre;
    h1.append(image(e.couverture, ""), nom);
  } else {
    // titreMasque : œuvre volontairement sans nom (le titre reste pour les lecteurs d'écran).
    h1.className = "fiche-titre" + (e.titreMasque ? " invisible" : "");
    h1.textContent = e.titre;
  }
  haut.append(h1);
  if (e.texte && e.texte.length) {
    const texte = document.createElement("div");
    texte.className = "fiche-texte";
    e.texte.forEach((t) => {
      const p = document.createElement("p");
      p.textContent = t;
      texte.append(p);
    });
    haut.append(texte);
  }
  const imgs = document.createElement("div");
  imgs.className = "galerie-images" + (e.type === "carnet" ? " galerie-images--carnet" : "");
  if (e.type === "carnet") {
    // Deux dessins par ligne, à la même hauteur : chacun prend une largeur
    // proportionnelle à son format, donc pas de trou sous le plus petit.
    for (let j = 0; j < e.images.length; j += 2) {
      const rangee = document.createElement("div");
      rangee.className = "rangee";
      e.images.slice(j, j + 2).forEach((src, k) => {
        const img = image(src, j + k === 0 ? e.titre : "");
        img.style.flex = ratio(src) + " 1 0";
        rangee.append(img);
      });
      imgs.append(rangee);
    }
  } else {
    e.images.forEach((src, j) => imgs.append(image(src, j === 0 ? e.titre : "")));
  }

  const liste = e.type === "carnet" ? CARNETS : TABLEAUX;
  const i = liste.indexOf(liste.find((x) => x.slug === e.slug));
  // Les carnets tournent en rond comme sur l'accueil (le dernier mène au premier) ;
  // les tableaux, rangés en grille, ont un début et une fin.
  const n = liste.length;
  const enRond = e.type === "carnet";
  const prec = enRond ? liste[(i - 1 + n) % n] : liste[i - 1];
  const suiv = enRond ? liste[(i + 1) % n] : liste[i + 1];
  const suite = document.createElement("nav");
  suite.className = "suite";
  suite.append(
    lienSuite(prec ? "galerie.html?id=" + prec.slug : "index.html", prec ? prec.titre : "accueil", "prec"),
    lienSuite(suiv ? "galerie.html?id=" + suiv.slug : "index.html", suiv ? suiv.titre : "accueil", "suiv")
  );

  // Carnets et peintures : texte à droite qui suit le défilement, comme sur les pages projet
  haut.className = "fiche-aside";
  const corps = document.createElement("div");
  corps.className = "fiche-corps";
  corps.append(imgs, haut);
  main.append(corps, suite);
  colonneTexte(corps, haut);
  main.classList.add("fiche--cotes");
  suite.classList.add("suite--cotes");
  visionneuse(imgs.querySelectorAll("img"));
}

/* ---------- Visionneuse : clic sur une image (projets, carnets, peintures) pour l'agrandir ----------
   Fond blanc plein écran, flèches (ou clavier, ou glissement du doigt) pour
   passer d'une image à l'autre, Échap / clic à côté / "fermer" pour sortir. */
function visionneuse(images) {
  const liste = [...images];
  if (!liste.length) return;

  const fond = document.createElement("div");
  fond.className = "visionneuse";
  fond.hidden = true;
  fond.innerHTML =
    '<button type="button" class="visionneuse-fermer">fermer</button>' +
    '<button type="button" class="visionneuse-fleche visionneuse-prec" aria-label="image précédente">' + FLECHE_SVG + "</button>" +
    '<img alt="">' +
    '<button type="button" class="visionneuse-fleche visionneuse-suiv" aria-label="image suivante">' + FLECHE_SVG + "</button>";
  document.body.append(fond);
  const grande = fond.querySelector("img");
  let courante = 0;

  function montrer(i) {
    courante = (i + liste.length) % liste.length;
    grande.src = liste[courante].src;
  }

  function ouvrir(i) {
    montrer(i);
    fond.hidden = false;
    document.body.style.overflow = "hidden";
    fond.querySelector(".visionneuse-fermer").focus();
  }

  function fermer() {
    fond.hidden = true;
    document.body.style.overflow = "";
    liste[courante].focus();
  }

  liste.forEach((img, i) => {
    img.tabIndex = 0;
    img.classList.add("agrandissable");
    img.addEventListener("click", () => ouvrir(i));
    img.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") ouvrir(i);
    });
  });

  fond.querySelector(".visionneuse-fermer").addEventListener("click", fermer);
  fond.querySelector(".visionneuse-prec").addEventListener("click", () => montrer(courante - 1));
  fond.querySelector(".visionneuse-suiv").addEventListener("click", () => montrer(courante + 1));
  // clic sur le fond (pas sur l'image ni les boutons) : on ferme
  let glisse = false;
  fond.addEventListener("click", (ev) => {
    if (ev.target === fond && !glisse) fermer();
    glisse = false;
  });
  if (liste.length < 2) fond.querySelectorAll(".visionneuse-fleche").forEach((b) => b.remove());

  document.addEventListener("keydown", (ev) => {
    if (fond.hidden) return;
    if (ev.key === "Escape") fermer();
    if (ev.key === "ArrowLeft") montrer(courante - 1);
    if (ev.key === "ArrowRight") montrer(courante + 1);
  });

  let x0 = null;
  fond.addEventListener("pointerdown", (ev) => { x0 = ev.clientX; });
  fond.addEventListener("pointerup", (ev) => {
    if (x0 !== null && Math.abs(ev.clientX - x0) > 50) {
      montrer(courante + (ev.clientX < x0 ? 1 : -1));
      glisse = true;
    }
    x0 = null;
  });
}
