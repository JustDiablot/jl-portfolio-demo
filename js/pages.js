// Pages dédiées : projet.html?id=<slug> (projets et explorations)
// et galerie.html?id=<slug> (carnets et tableaux, images en grand sans texte).

function introuvable(main) {
  main.innerHTML = '<p>Cette page n\'existe pas. <a href="index.html">Retour à l\'accueil</a></p>';
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

function pageProjet() {
  const main = document.querySelector("main");
  const liste = [...PROJETS, ...EXPLORATIONS];
  const i = liste.findIndex((e) => e.slug === parametre("id"));
  if (i < 0) return introuvable(main);
  const e = liste[i];
  document.title = e.titre + " | Julie Lagos";

  // En haut : titre à gauche, texte sur la même ligne vers le milieu-droite
  const haut = document.createElement("div");
  haut.className = "fiche-haut";
  const h1 = document.createElement("h1");
  h1.className = "fiche-titre";
  if (e.logo) h1.append(image(e.logo, e.titre));
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
  haut.append(h1, texte);

  // Images : deux colonnes, les visuels très larges prennent toute la largeur
  const imgs = document.createElement("div");
  imgs.className = "fiche-images";
  const enPaire = new Set((e.paires || []).flat());
  e.images.forEach((src, j) => {
    const paire = (e.paires || []).find((p) => p[0] === j);
    if (paire) {
      const div = document.createElement("div");
      div.className = "paire";
      paire.forEach((k) => div.append(image(e.images[k], "")));
      imgs.append(div);
      return;
    }
    if (enPaire.has(j)) return;
    const img = image(src, "");
    if (ratio(src) >= 1.55) img.classList.add("large");
    imgs.append(img);
  });

  // Projet précédent / suivant
  const suite = document.createElement("nav");
  suite.className = "suite";
  const prec = liste[i - 1];
  const suiv = liste[i + 1];
  suite.append(
    lienSuite(prec ? "projet.html?id=" + prec.slug : "index.html#" + e.slug, prec ? prec.titre : "accueil", "prec"),
    lienSuite(suiv ? "projet.html?id=" + suiv.slug : "index.html#" + e.slug, suiv ? suiv.titre : "accueil", "suiv")
  );

  main.append(haut, imgs, suite);
  main.classList.add("fiche--cotes");
  suite.classList.add("suite--cotes");
  visionneuse(imgs.querySelectorAll("img"));
}

function pageGalerie() {
  const main = document.querySelector("main");
  const e = trouver(parametre("id"));
  if (!e || (e.type !== "carnet" && e.type !== "tableau")) return introuvable(main);
  document.title = e.titre + " | Julie Lagos";

  // Carnet (maquette 4 de Julie) : petite couverture + nom en haut, dessins deux par ligne.
  // Tableau : seulement les images, en énorme, sans texte (le titre reste pour les lecteurs d'écran).
  const h1 = document.createElement("h1");
  if (e.type === "carnet") {
    h1.className = "carnet-entete";
    const nom = document.createElement("span");
    nom.textContent = e.titre;
    h1.append(image(e.couverture, ""), nom);
  } else {
    h1.className = "invisible";
    h1.textContent = e.titre;
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

  main.append(h1, imgs, suite);
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
