/* ==========================================================================
   site.js : code partagé par toutes les pages (index, projets, projet, cv).
   Chargement des données (projects.json), en-tête, pied de page, cartes de projet,
   apparition progressive. Les types de projets viennent de schema.js.
   ========================================================================== */

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const safeUrl = u => /^(https?:|mailto:)/i.test(u || "") ? u : "#";
/* chemins relatifs autorisés (ex. cv.pdf), mais pas javascript: ni data: */
const safeHref = u => /^\s*(javascript|data|vbscript):/i.test(u || "") ? "#" : (u || "#");
const paras = t => String(t || "").split(/\n{2,}/).filter(x => x.trim()).map(x => `<p>${esc(x.trim())}</p>`).join("");
const bullets = a => { const l = (Array.isArray(a) ? a : String(a || "").split("\n")).map(x => String(x).trim()).filter(Boolean); return l.length ? `<ul class="list">${l.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""; };
const csv = s => (Array.isArray(s) ? s : String(s || "").split(",")).map(x => String(x).trim()).filter(Boolean);
const chips = a => a.length ? `<ul class="chips">${a.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : "";

const ICON = {
  dl: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v3h16v-3"/></svg>',
  x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'
};
const live = '<span class="pill live"><i></i>en cours</span>';
const state = p => p.ongoing ? live : '<span class="pill">terminé</span>';

/* ---------- types de projets (schema.js) ---------- */
const TYPES = (window.SCHEMA || {}).types || {};
const OTHER = { label: "Projet", plural: "Autres", code: "projet", facts: [], sections: [{ key: "description", root: true, label: "Description", kind: "long" }] };
const typeOf = p => TYPES[p.type] ? p.type : "other";
const def = p => TYPES[typeOf(p)] || OTHER;
const secVal = (p, s) => s.root ? p[s.key] : (p.details || {})[s.key];
const section = (p, s) => {
  const v = secVal(p, s), body = s.kind === "list" ? bullets(v) : paras(v);
  return body ? `<section class="sect${s.lead ? " lead" : ""}"><h2>${esc(s.label)}</h2><div class="prose">${body}</div></section>` : "";
};

/* ---------- adresses des pages ---------- */
const PAGES = [
  { id: "home", href: "index.html", label: "Accueil" },
  { id: "projects", href: "projets.html", label: "Projets" },
  { id: "cv", href: "cv.html", label: "CV" }
];
/* fiche d'un projet : projet.html?id=<identifiant> (fonctionne en accès direct) */
const projectUrl = p => "projet.html?id=" + encodeURIComponent(p.id);

/* ---------- données ---------- */
async function loadData() {
  const r = await fetch("projects.json", { cache: "no-cache" });
  if (!r.ok) throw new Error(r.status);
  const d = await r.json();
  d.profile = d.profile || {};
  d.cv = d.cv || {};
  d.projects = (d.projects || []).slice().sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
  return d;
}
const fail = el => {
  el.innerHTML = '<div class="wrap"><p class="empty">Impossible de charger projects.json. Ouvrez le site via GitHub Pages ou un serveur local (pas en double-cliquant sur le fichier).</p></div>';
};

/* ---------- en-tête et pied de page ---------- */
function chrome(active) {
  $("#site-header").innerHTML = `
    <div class="wrap">
      <a class="brand" href="index.html" aria-label="Accueil"><span class="mono" id="mono">·</span></a>
      <nav class="seg" aria-label="Navigation principale">${PAGES.map(pg => `<a href="${pg.href}"${pg.id === active ? ' aria-current="page"' : ""}>${pg.label}</a>`).join("")}</nav>
      <div class="header-end"><a class="btn btn-sm" href="admin.html">Admin</a></div>
    </div>`;
  $("#site-footer").innerHTML = '<div class="wrap" id="copy"></div>';
}
function applyProfile(d) {
  const name = ((d.profile || {}).name || "").trim();
  if (!name) return;
  $("#mono").textContent = name.charAt(0).toUpperCase();
  $("#copy").textContent = "© " + new Date().getFullYear() + " " + name;
}
function setMeta(title, description) {
  document.title = title;
  const m = document.querySelector('meta[name="description"]');
  if (m && description) m.setAttribute("content", description);
}

/* ---------- carte de projet (lien vers sa fiche) ---------- */
const card = (p, i = 0, level = 3) => {
  const t = typeOf(p), img = p.images && p.images[0];
  return `
    <article class="card reveal" data-t="${t}" style="--i:${i}">
      <div class="card-media">
        ${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : `<span class="ph" aria-hidden="true">${esc((p.title || "?").trim()[0] || "?")}</span>`}
        ${p.ongoing ? live : ""}
      </div>
      <div class="card-body">
        <p class="meta">${t !== "other" ? `<span class="kind">${esc(def(p).label.toLowerCase())}</span>` : ""}${p.year ? `<span>${esc(p.year)}</span>` : ""}</p>
        <h${level}><a class="stretch" href="${projectUrl(p)}">${esc(p.title)}</a></h${level}>
        ${p.summary ? `<p class="summary">${esc(p.summary)}</p>` : ""}
        ${chips(p.tags || [])}
      </div>
    </article>`;
};

/* projets à la une : ceux marqués "featured": true dans projects.json (4 maximum) ;
   sinon les plus récents qui ont une image. Toujours 2 à 4 projets quand il y en a assez. */
function featuredProjects(list) {
  const out = list.filter(p => p.featured === true).slice(0, 4);
  const withImg = list.filter(p => p.images && p.images.length);
  const pool = (withImg.length >= 2 ? withImg : list).filter(p => !out.includes(p));
  const target = out.length ? 2 : 3;
  while (out.length < target && pool.length) out.push(pool.shift());
  return out;
}

/* ---------- apparition progressive (discrète) ---------- */
function reveal() {
  const els = $$(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { rootMargin: "100000px 0px -6% 0px" });   /* tout ce qui est au-dessus de l'écran est déjà affiché */
  els.forEach(e => io.observe(e));
}
