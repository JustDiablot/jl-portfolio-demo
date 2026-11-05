// Éléments partagés par toutes les pages : en-tête, contact, images, fil tracé à la main.

const CONTACT = {
  tel: "06 43 15 74 06",
  telLien: "tel:+33643157406",
  mail: "julie.lagos.guyot@gmail.com",
  linkedin: "https://www.linkedin.com/in/julie-lagos-02902b302/"
};

// Petite flèche tracée à la main. La police de Julie n'a pas de caractère
// flèche, et celui d'une autre police ne s'aligne pas avec son écriture.
const FLECHE_SVG =
  '<svg viewBox="0 0 30 14" aria-hidden="true"><path d="M1.5 7.3c5.2-.4 11 .3 16.4-.2 3.4-.3 6.6.1 10.4-.3M21.6 1.6c2.1 1.9 4.4 3.6 6.7 5.3-2.4 1.8-4.6 3.5-6.4 5.6"/></svg>';

function entete(accueil) {
  const header = document.createElement("header");
  header.className = "entete" + (accueil ? " entete--accueil" : "");
  // Hors accueil : "retour" ramène à l'accueil au niveau du projet / carnet / tableau regardé
  const id = parametre("id");
  const retour = accueil ? "" :
    '<a class="entete-retour" href="index.html' + (id ? "#" + encodeURIComponent(id) : "") + '">' +
    '<span class="suite-fleche">' + FLECHE_SVG + "</span>retour</a>";
  header.innerHTML =
    '<div class="entete-gauche">' + retour + '<a class="entete-nom" href="index.html">Julie Lagos</a></div>' +
    '<nav><a href="apropos.html">à propos</a><a href="#contact">me contacter</a></nav>';
  document.body.prepend(header);

  // Hauteur de l'en-tête collant, pour que le texte des pages projet se cale juste dessous
  const majHauteur = () => document.documentElement.style.setProperty("--entete-h", header.offsetHeight + "px");
  majHauteur();
  window.addEventListener("resize", majHauteur);
  if (document.fonts) document.fonts.ready.then(majHauteur);

  // Accueil : le petit nom apparaît quand le grand nom du hero sort de l'écran
  const grandNom = document.querySelector(".hero-nom");
  if (accueil && grandNom && "IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => {
      header.classList.toggle("entete--defile", !e.isIntersecting);
    }).observe(grandNom);
  }
}

function piedContact() {
  const footer = document.createElement("footer");
  footer.className = "contact";
  footer.id = "contact";
  footer.innerHTML =
    "<h2>me contacter</h2>" +
    '<p><a href="mailto:' + CONTACT.mail + '">' + CONTACT.mail + "</a></p>" +
    '<p><a href="' + CONTACT.telLien + '">' + CONTACT.tel + "</a></p>" +
    '<p><a href="' + CONTACT.linkedin + '" target="_blank" rel="noopener">LinkedIn</a></p>' +
    "<small>&copy; " + new Date().getFullYear() + " Julie Lagos</small>";
  document.body.append(footer);
}

// <img> avec ses dimensions connues (dims.js) pour éviter les sauts de mise en page
function image(src, alt) {
  const img = document.createElement("img");
  const d = typeof DIMS !== "undefined" && DIMS[src];
  // ?v=<version> : une image modifiée (tournée, recadrée) n'est jamais resservie depuis le cache
  img.src = d && d[2] ? src + "?v=" + d[2] : src;
  img.alt = alt || "";
  img.loading = "lazy";
  img.decoding = "async";
  if (d) {
    img.width = d[0];
    img.height = d[1];
  }
  return img;
}

function ratio(src) {
  const d = typeof DIMS !== "undefined" && DIMS[src];
  return d ? d[0] / d[1] : 1;
}

function parametre(nom) {
  return new URLSearchParams(location.search).get(nom);
}

/* ---------- Fil conducteur tracé à la main ----------
   Un trait vertical qui tremble et ondule comme un trait au feutre, avec un
   petit trait + une boucle "o" vers chaque élément marqué [data-branche].
   Le hasard est "graine" : le trait garde la même forme à chaque visite. */

function graine(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Courbe lisse (Catmull-Rom convertie en Bézier) passant par tous les points
function chemin(points) {
  let d = "M" + points[0][0].toFixed(1) + " " + points[0][1].toFixed(1);
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += "C" + c1.map((v) => v.toFixed(1)).join(" ") + " " + c2.map((v) => v.toFixed(1)).join(" ") + " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
  }
  return d;
}

function dessinerFil(conteneur) {
  const NS = "http://www.w3.org/2000/svg";
  const hasard = graine(19);
  const phases = [hasard() * 6, hasard() * 6, hasard() * 6];
  // Trait décalé vers le centre (environ 4x plus loin du bord gauche qu'avant),
  // tout en restant à gauche du contenu (retrait --fil-retrait).
  // 4 fois plus loin du bord que l'ancienne version (demande Julie) ; sur grand écran,
  // l'ensemble fil + projets (1108px) est centré. Même formule que --fil-x dans site.css.
  const xBase = () => Math.max(36, window.innerWidth * 0.16, (window.innerWidth - 1108) / 2);
  const xFil = (y) => xBase() + 7 * Math.sin(y / 190 + phases[0]) + 3.5 * Math.sin(y / 67 + phases[1]) + 1.3 * Math.sin(y / 23 + phases[2]);

  let svg, traits, branches, hauteur;

  function construire() {
    if (svg) svg.remove();
    // Le trait finit sa course sur le titre « me contacter », en bas de page
    const fin = document.querySelector(".contact h2");
    const hautFil = conteneur.getBoundingClientRect().top;
    const yCible = (el) => {
      const r = el.getBoundingClientRect();
      return r.top - hautFil + Math.min(r.height / 2, 40);
    };
    // Le trait vertical s'arrête un peu au-dessus du titre, puis tourne vers lui (rayon du virage)
    let rayonVirage = 0;
    if (fin) {
      const place = fin.getBoundingClientRect().left - conteneur.getBoundingClientRect().left - 22 - xBase();
      rayonVirage = Math.max(14, Math.min(90, place * 0.6));
    }
    hauteur = fin ? yCible(fin) - rayonVirage : conteneur.offsetHeight;
    svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "fil-trace");
    svg.setAttribute("aria-hidden", "true");

    // Trait principal + un second passage plus fin, légèrement décalé
    const pts = [];
    const pts2 = [];
    for (let y = 0; y <= hauteur; y += 26) {
      const x = xFil(y) + (hasard() - 0.5) * 0.9;
      pts.push([x, y]);
      pts2.push([x + 0.9 + Math.sin(y / 40) * 0.7, y + 3]);
    }
    pts.push([xFil(hauteur), hauteur]);
    pts2.push([xFil(hauteur) + 0.9, hauteur]);
    traits = [ajouter(chemin(pts), 2.3, 1), ajouter(chemin(pts2), 0.8, 0.45)];

    // Branches vers chaque projet / rubrique
    const cibles = [...conteneur.querySelectorAll("[data-branche]")];
    if (fin) cibles.push(fin);
    branches = cibles.map((el) => {
      const r = el.getBoundingClientRect();
      const y = yCible(el);
      const virage = el === fin;
      const xb = r.left - conteneur.getBoundingClientRect().left - 22;
      const pb = [];
      // Dernière branche : quart de cercle depuis le bout du trait, d'un seul geste
      let xa = xFil(y);
      if (virage) {
        const x0 = xFil(hauteur);
        for (let a = 0; a < Math.PI / 2; a += Math.PI / 16) {
          pb.push([x0 + rayonVirage * (1 - Math.cos(a)), hauteur + rayonVirage * Math.sin(a)]);
        }
        xa = x0 + rayonVirage;
      }
      const n = Math.max(3, Math.round((xb - xa) / 14));
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        pb.push([xa + (xb - xa) * t, y + Math.sin(t * Math.PI) * 2.5 + (hasard() - 0.5) * 1.4]);
      }
      // petite boucle "o" tracée d'un geste, qui ne se referme pas tout à fait
      const rayon = 5.5;
      const cx = xb + rayon + 2;
      for (let a = Math.PI; a <= Math.PI * 3.15; a += Math.PI / 6) {
        const rr = rayon * (1 + (hasard() - 0.5) * 0.18);
        pb.push([cx + Math.cos(a) * rr, y - Math.sin(a) * rr * 1.1]);
      }
      // même épaisseur que le trait pour le virage ; elle part quand le trait arrive à son bout
      const p = ajouter(chemin(pb), virage ? 2.3 : 1.7, 1);
      return { p, y: virage ? hauteur : y };
    });

    conteneur.append(svg);
    [...traits, ...branches.map((b) => b.p)].forEach((p) => {
      const l = p.getTotalLength();
      p.style.strokeDasharray = l + 1;
      p.dataset.long = l + 1;
    });
    branches.forEach((b) => {
      b.p.style.transition = "stroke-dashoffset 0.7s ease";
    });
    avancer();
  }

  function ajouter(d, epaisseur, opacite) {
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", d);
    p.setAttribute("stroke-width", epaisseur);
    p.setAttribute("opacity", opacite);
    svg.appendChild(p);
    return p;
  }

  // Le trait se dessine jusqu'aux 3/4 de l'écran ; les branches apparaissent quand il les atteint
  function avancer() {
    if (!svg) return; // pas encore construit (scroll avant le premier tracé)
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = conteneur.getBoundingClientRect();
    // tout en bas de la page, le trait est forcément arrivé au bout (même sur un écran bas)
    const enBas = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    const atteint = reduit || enBas ? hauteur : Math.min(hauteur, Math.max(0, window.innerHeight * 0.75 - r.top));
    traits.forEach((p) => {
      p.style.strokeDashoffset = p.dataset.long * (1 - atteint / hauteur);
    });
    branches.forEach((b) => {
      b.p.style.strokeDashoffset = atteint >= b.y ? 0 : b.p.dataset.long;
    });
  }

  let attente = false;
  window.addEventListener("scroll", () => {
    if (attente) return;
    attente = true;
    requestAnimationFrame(() => {
      attente = false; // libéré avant, pour qu'une erreur ne bloque jamais le tracé
      avancer();
    });
  }, { passive: true });

  // Reconstruit le trait quand la mise en page bouge (images, police, redimensionnement)
  let minuteur;
  const plusTard = () => {
    clearTimeout(minuteur);
    minuteur = setTimeout(construire, 150);
  };
  new ResizeObserver(plusTard).observe(conteneur);
  window.addEventListener("resize", plusTard);
  window.addEventListener("load", plusTard);
  if (document.fonts) document.fonts.ready.then(plusTard);
}

/* ---------- Accents dans la police manuscrite ----------
   La police de Julie ne contient que les lettres sans accent. On écrit donc
   la lettre de base dans sa police, et l'accent est un petit trait dessiné
   en CSS par-dessus (.acc), pour garder son écriture partout. */
const ACCENTS = { "́": "aigu", "̀": "grave", "̂": "circ", "̈": "trema", "̧": "cedille" };
const SELECTEURS_MAIN = ".entete a, .hero-nom, .rubrique, .entree-titre span, .fiche-titre, .apropos h1, .contact h2, .fiche-lien, .suite a, .livre-nom-main";

function accentsMain(racine) {
  (racine || document).querySelectorAll(SELECTEURS_MAIN).forEach((el) => {
    const marche = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const noeuds = [];
    while (marche.nextNode()) noeuds.push(marche.currentNode);
    noeuds.forEach((n) => {
      const texte = n.nodeValue.replace(/[’‘]/g, "'");
      if (!/[^\x20-\x7e]/.test(texte)) {
        n.nodeValue = texte;
        return;
      }
      const frag = document.createDocumentFragment();
      let tampon = "";
      for (const c of texte) {
        const d = c.normalize("NFD");
        const type = d.length === 2 && ACCENTS[d[1]];
        if (type) {
          if (tampon) frag.append(tampon);
          tampon = "";
          const s = document.createElement("span");
          s.className = "acc acc--" + type + (d[0] !== d[0].toLowerCase() ? " acc--maj" : "");
          s.textContent = d[0];
          frag.append(s);
        } else if (/[^\x20-\x7e]/.test(c)) {
          // caractère absent de la police (flèches...) : police normale
          if (tampon) frag.append(tampon);
          tampon = "";
          const s = document.createElement("span");
          s.className = "hors-police";
          s.textContent = c;
          frag.append(s);
        } else {
          tampon += c;
        }
      }
      if (tampon) frag.append(tampon);
      n.replaceWith(frag);
    });
  });
}
