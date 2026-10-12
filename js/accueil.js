// Page d'accueil : projets graphiques puis explorations le long du fil.

function entreeFil(e) {
  const lien = "projet.html?id=" + e.slug;
  const art = document.createElement("article");
  art.className = "entree";
  art.id = e.slug;

  const titre = document.createElement("a");
  titre.className = "entree-titre";
  titre.href = lien;
  titre.dataset.branche = "";
  if (e.logo) {
    titre.append(image(e.logo, e.titre));
  } else {
    const span = document.createElement("span");
    span.textContent = e.titre;
    titre.append(span);
  }

  const imgs = document.createElement("a");
  imgs.className = "entree-images";
  imgs.href = lien;
  imgs.setAttribute("aria-label", e.titre + " : voir le projet");
  e.tete.forEach((src) => imgs.append(image(src, "")));

  art.append(titre, imgs);
  return art;
}

function titreRubrique(texte, niveau) {
  const h = document.createElement(niveau || "h2");
  h.className = "rubrique";
  h.textContent = texte;
  return h;
}

/* ---------- Carnets : trois livres qu'on fait tourner ----------
   Le livre du milieu est au premier plan. Cliquer sur un livre de côté
   (ou les flèches, le clavier, un glissement du doigt) le fait passer
   devant ; cliquer sur celui de devant ouvre ses dessins. */
function carnets() {
  const bloc = document.createElement("div");
  bloc.className = "carnets";
  const scene = document.createElement("div");
  scene.className = "carnets-scene";
  scene.dataset.branche = "";

  let centre = 0;
  const livres = CARNETS.map((c, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "livre";
    b.dataset.slug = c.slug;
    const nom = document.createElement("span");
    nom.className = "livre-nom";
    nom.textContent = c.titre;
    b.append(image(c.couverture, c.titre), nom);
    b.addEventListener("click", () => {
      if (i === centre) location.href = "galerie.html?id=" + c.slug;
      else placer(i);
    });
    scene.append(b);
    return b;
  });

  function placer(c) {
    centre = (c + livres.length) % livres.length;
    livres.forEach((b, i) => {
      const ecart = (i - centre + livres.length) % livres.length;
      const place = ecart === 0 ? 0 : ecart === 1 ? 1 : -1;
      b.dataset.place = place;
      b.setAttribute("aria-label", CARNETS[i].titre + (place === 0 ? " : ouvrir" : " : mettre devant"));
    });
  }
  // retour depuis un carnet (index.html#<slug>) : ce carnet revient devant
  const depuis = CARNETS.findIndex((c) => "#" + c.slug === location.hash);
  placer(depuis > 0 ? depuis : 0);

  // glisser pour faire tourner
  let x0 = null;
  scene.addEventListener("pointerdown", (ev) => { x0 = ev.clientX; });
  scene.addEventListener("pointerup", (ev) => {
    if (x0 !== null && Math.abs(ev.clientX - x0) > 40) {
      placer(centre + (ev.clientX < x0 ? 1 : -1));
      glisse = true;
      setTimeout(() => { glisse = false; }, 0);
    }
    x0 = null;
  });
  // un glissement ne doit pas compter comme un clic sur un livre
  let glisse = false;
  scene.addEventListener("click", (ev) => {
    if (glisse) ev.stopPropagation();
  }, true);

  bloc.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowLeft") placer(centre - 1);
    if (ev.key === "ArrowRight") placer(centre + 1);
  });

  const cmd = document.createElement("div");
  cmd.className = "carnets-commandes";
  const prec = document.createElement("button");
  prec.type = "button";
  prec.innerHTML = FLECHE_SVG;
  prec.classList.add("carnets-prec");
  prec.setAttribute("aria-label", "carnet précédent");
  prec.addEventListener("click", () => placer(centre - 1));
  const suiv = document.createElement("button");
  suiv.type = "button";
  suiv.innerHTML = FLECHE_SVG;
  suiv.setAttribute("aria-label", "carnet suivant");
  suiv.addEventListener("click", () => placer(centre + 1));
  const aide = document.createElement("span");
  aide.textContent = "cliquez sur le carnet de devant pour l'ouvrir";
  cmd.append(prec, aide, suiv);

  bloc.append(scene, cmd);
  return bloc;
}

function tableaux() {
  const grille = document.createElement("div");
  grille.className = "tableaux";
  TABLEAUX.forEach((t) => {
    const a = document.createElement("a");
    a.className = "tableau";
    a.dataset.slug = t.slug; // pas d'id : sinon le navigateur met le focus et un contour au retour
    a.href = "galerie.html?id=" + t.slug;
    const imgs = document.createElement("div");
    imgs.className = "tableau-images";
    t.images.slice(0, 3).forEach((src, i) => imgs.append(image(src, i === 0 ? t.titre : "")));
    const nom = document.createElement("span");
    nom.className = "tableau-nom";
    nom.textContent = t.titre;
    a.append(imgs, nom);
    grille.append(a);
  });
  return grille;
}

function accueil() {
  const fil = document.getElementById("fil");

  fil.append(titreRubrique("projets graphiques"));
  PROJETS.forEach((p) => fil.append(entreeFil(p)));

  fil.append(titreRubrique("explorations"));
  EXPLORATIONS.forEach((e) => fil.append(entreeFil(e)));

  const sousCarnets = titreRubrique("carnets de dessins", "h3");
  sousCarnets.classList.add("sous-rubrique");
  fil.append(sousCarnets, carnets());

  const sousTableaux = titreRubrique("peintures", "h3");
  sousTableaux.classList.add("sous-rubrique");
  sousTableaux.dataset.branche = "";
  fil.append(sousTableaux, tableaux());

  accentsMain();
  dessinerFil(fil);

  // Retour depuis une page projet : se placer directement sur l'entrée regardée
  const ancre = decodeURIComponent(location.hash.slice(1));
  const cible = ancre && (document.getElementById(ancre) || document.querySelector('[data-slug="' + CSS.escape(ancre) + '"]'));
  if (cible) {
    const aller = () => cible.scrollIntoView({ block: "start", behavior: "instant" });
    aller();
    window.addEventListener("load", aller, { once: true });
  }
}

entete(true);
piedContact();
accueil();
