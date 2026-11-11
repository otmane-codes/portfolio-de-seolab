/* ===== EDIT YOUR DETAILS HERE ===== */
const CONFIG = {
  firstName: "Salah eddine",
  lastName:  "OUTHAMA",
  instagram: "seoth.lab",            // without @
  email:     "salahouthama@gmail.com"
};

const CATS = { portrait:["Portrait","--coral"], fashion:["Fashion","--lav"], street:["Street","--orange"], nature:["Nature","--blue"], events:["Events","--sun"] };
const SERVICES = [
  { name:"Portrait sessions", c:"--coral", text:"Relaxed, guided sessions for individuals, couples and families.", inc:["Studio or outdoors"] },
  { name:"Fashion and editorial", c:"--lav", text:"Lookbooks, campaigns and editorial stories with full creative direction.", inc:["Moodboard","Styling help","Retouched selects"] },
  { name:"Events", c:"--sun", text:"Weddings, launches and parties covered discreetly from start to finish.", inc:["Online gallery","Fast delivery"] },
  { name:"Street and travel", c:"--orange", text:"Guided photo walks and travel stories shot in your city or mine.", inc:["Photo walk","Story series","Print options"] },
  { name:"Brand and commercial", c:"--blue", text:"Product and lifestyle imagery that gives your brand a consistent look.", inc:["Shot list","Usage licence","Web-ready files"] }
];
const WORDS = ["Portrait","Fashion","Street","Nature","Events","Stories","Light","Colour"];

/* ===== CODE (no need to edit below) ===== */
const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
const full = `${CONFIG.firstName} ${CONFIG.lastName}`.trim();

// details
$$("[data-name]").forEach(e => e.textContent = full);
$("[data-first]").textContent = CONFIG.firstName; $("[data-last]").textContent = CONFIG.lastName;
$$("[data-ig]").forEach(e => e.textContent = "@" + CONFIG.instagram);
$$("[data-email]").forEach(e => e.textContent = CONFIG.email);
$("#ig").href = `https://instagram.com/${CONFIG.instagram}`;
$("#mail").href = `mailto:${CONFIG.email}`;
$("#yr").textContent = new Date().getFullYear(); document.title = `${full} | Photographer`;

// marquees
["mq1","mq2","mq3"].forEach((id,k) => { const w = WORDS.slice(k*2).concat(WORDS.slice(0,k*2)); const h = w.map(x => `<span>${x}</span>`).join(""); $("#"+id).innerHTML = h+h+h+h; });

// split headings into words
$$("[data-split]").forEach(el => { let n = 0;
  const walk = node => [...node.childNodes].forEach(c => {
    if (c.nodeType === 3) { const f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) f.append(" "); else { const w = document.createElement("span"); w.className = "w"; w.innerHTML = `<i style="--n:${n++}">${t}</i>`; f.append(w); } }); c.replaceWith(f); }
    else if (c.nodeType === 1 && c.tagName !== "BR") walk(c);
  }); walk(el); });

// gallery
const grid = $("#grid"), filters = $("#filters");
// the photos are written in index.html; this adds category labels, colours and open buttons
const items = $$(".item", grid), counts = {};
items.forEach((b, i) => { const c = b.dataset.cat; counts[c] = (counts[c] || 0) + 1;
  b.dataset.i = i; b.dataset.cur = "View"; b.style.setProperty("--c", `var(${CATS[c][1]})`);
  b.setAttribute("aria-label", `Open ${CATS[c][0]} photo`);
  b.insertAdjacentHTML("beforeend", `<span class="plus"><svg viewBox="0 0 24 24"><path d="M12 4v16M4 12h16"/></svg></span><span class="chip"><small>${CATS[c][0]}</small></span>`); });
filters.innerHTML = `<button class="pill" aria-pressed="true" data-f="all">All<sup>${items.length}</sup></button>` + Object.entries(CATS).map(([k,[n,c]]) => `<button class="pill" style="--c:var(${c})" aria-pressed="false" data-f="${k}">${n}<sup>${counts[k]||0}</sup></button>`).join("");
const photo = i => { const it = items[i]; return { src: it.dataset.full || $("img", it).src, alt: $("img", it).alt, cat: it.dataset.cat }; };
// Layout: shapes tile perfectly in groups so the grid always looks composed
const mob = matchMedia("(max-width:600px)");
const SEQ_D = ["l","t","w","w","s","s","s"], SEQ_M = ["w","t","s","s"];
let curF = "all", limit = 0;
const PAGE = () => mob.matches ? 12 : 14;   // photos shown per batch
const more = $("#more");
function layout(f, anim = true) { curF = f; const SEQ = mob.matches ? SEQ_M : SEQ_D; let n = 0, total = 0;
  $$(".item").forEach(it => { const match = f === "all" || it.dataset.cat === f; if (match) total++;
    const show = match && n < limit; it.hidden = !show; it.classList.remove("l","t","w","s");
    if (show) { it.classList.add(SEQ[n++ % SEQ.length]); if (anim && it.classList.contains("in")) { it.classList.remove("in"); it.offsetHeight; setTimeout(() => it.classList.add("in"), 40 + n*60); } } });
  const rest = Math.max(0, total - limit); more.hidden = rest === 0; more.textContent = `Show more photos (${rest})`; }
limit = PAGE();
layout("all");
mob.addEventListener("change", () => { limit = PAGE(); layout(curF); });
more.addEventListener("click", () => { limit += PAGE(); layout(curF, false); });
grid.addEventListener("error", e => { const it = e.target.closest(".item"); if (it) { it.remove(); layout(curF, false); } }, true);
filters.addEventListener("click", e => { const b = e.target.closest(".pill"); if (!b) return; $$(".pill", filters).forEach(x => x.setAttribute("aria-pressed", x === b)); limit = PAGE(); layout(b.dataset.f); });

// services
const svc = $("#svc");
svc.innerHTML = SERVICES.map((s,i) => `<div class="s-row" style="--c:var(${s.c})"><button class="s-btn" aria-expanded="false" aria-controls="sb${i}"><h3>${s.name}</h3></button><div class="s-body" id="sb${i}"><div><div class="s-in"><p>${s.text}</p><ul>${s.inc.map(x=>`<li>${x}</li>`).join("")}</ul></div></div></div></div>`).join("");
svc.addEventListener("click", e => {
  const b = e.target.closest(".s-btn"); if (!b) return; const row = b.parentElement, o = !row.classList.contains("open");
  $$(".s-row", svc).forEach(r => { r.classList.remove("open"); $(".s-btn", r).setAttribute("aria-expanded", false); });
  if (o) { row.classList.add("open"); b.setAttribute("aria-expanded", true); } });
$("#f-type").innerHTML = SERVICES.map(s => `<option>${s.name}</option>`).join("") + "<option>Something else</option>";
$("#f-date").min = new Date().toISOString().slice(0,10);

// booking form
function msg() { const d = $("#f-date").value; return `Hello ${CONFIG.firstName}, I would like to book: ${$("#f-type").value}.\nName: ${$("#f-name").value.trim()}\nPreferred date: ${d || "flexible"}\n${$("#f-msg").value.trim()}`; }
function ok() { $("#err").classList.remove("ok"); if (!$("#f-name").value.trim()) { $("#err").textContent = "Please add your name so I know who to reply to."; $("#f-name").focus(); return false; } $("#err").textContent = ""; return true; }
$("#send-ig").onclick = () => { if (!ok()) return; const e = $("#err");
  const done = t => { e.textContent = t; e.classList.add("ok"); };
  if (navigator.clipboard) navigator.clipboard.writeText(msg()).then(() => done("Message copied. Paste it in the Instagram chat."), () => done("Opening Instagram. Send me your idea there."));
  else done("Opening Instagram. Send me your idea there.");
  window.open(`https://ig.me/m/${CONFIG.instagram}`, "_blank", "noopener"); };
$("#send-mail").onclick = () => ok() && (location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Booking request: " + $("#f-type").value)}&body=${encodeURIComponent(msg())}`);

// reveal on scroll
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); if (en.target.dataset.count) countUp(en.target); io.unobserve(en.target); } }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
$$(".rv,[data-split],.item,[data-count]").forEach(e => io.observe(e));
function countUp(el) { const to = +el.dataset.count, t0 = performance.now(); (function f(t) { const k = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + (k === 1 ? "+" : ""); if (k < 1) requestAnimationFrame(f); })(t0); }
// hero intro
setTimeout(() => $("#h1").classList.add("in"), 80);
(function(){ let n=0; const h=$("#h1"); [...h.querySelectorAll("span")].forEach(sp => { sp.innerHTML = sp.textContent.split("").length ? `<span class="w"><i style="--n:${n++*2}">${sp.textContent}</i></span>` : ""; }); })();
setTimeout(() => $$(".print").forEach(p => p.classList.add("rested")), 2200);

// parallax: mouse on hero, subtle
if (fine && !reduce) { const hero = $("#home"); hero.addEventListener("mousemove", e => { const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
  $$("[data-depth]", hero).forEach(el => { const d = +el.dataset.depth; el.style.translate = `${x*d}px ${y*d}px`; }); }); }

// custom cursor
if (fine) { const c = $("#cur"), t = $("#curt"); let x = 0, y = 0, cx = 0, cy = 0;
  addEventListener("mousemove", e => { x = e.clientX; y = e.clientY; c.style.opacity = 1; });
  (function loop() { cx += (x - cx) * .2; cy += (y - cy) * .2; c.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
  document.addEventListener("mouseover", e => { const el = e.target.closest("[data-cur]"); if (el) { t.textContent = el.dataset.cur; c.classList.add("on"); } else c.classList.remove("on"); });
  document.addEventListener("mouseleave", () => c.style.opacity = 0);
  // magnetic buttons
  $$("[data-magnet]").forEach(b => { b.addEventListener("mousemove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width/2)*.2}px,${(e.clientY - r.top - r.height/2)*.3}px)`; }); b.addEventListener("mouseleave", () => b.style.transform = ""); }); }

// page transition between sections
const wipe = $("#wipe"), COL = { "#home":"--sun", "#portfolio":"--coral", "#about":"--lav", "#services":"--orange", "#contact":"--blue" };
let busy = false;
function go(h) { const t = $(h); if (!t || busy) return; history.replaceState(null, "", h);
  if (reduce) { t.scrollIntoView(); return; }
  busy = true; wipe.style.background = `var(${COL[h] || "--blue"})`; $("#wipet").textContent = (h === "#home" ? full : h.slice(1).replace(/^./, c => c.toUpperCase()));
  const o = { duration: 520, easing: "cubic-bezier(.7,0,.2,1)", fill: "forwards" };
  wipe.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], o).finished.then(() => {
    document.documentElement.style.scrollBehavior = "auto"; t.scrollIntoView(); setTimeout(() => {
      wipe.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], { ...o, duration: 620 }).finished.then(() => { document.documentElement.style.scrollBehavior = ""; busy = false; });
    }, 160); }); }
document.addEventListener("click", e => { const a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute("href").length < 2) return; e.preventDefault(); nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); document.body.style.overflow = ""; go(a.getAttribute("href")); });

// nav
const nav = $("#nav"), burger = $("#burger");
burger.onclick = () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Close menu" : "Open menu"); document.body.style.overflow = o ? "hidden" : ""; };
const links = $$("#menu a");
["portfolio","about","services","contact"].forEach(id => new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) links.forEach(l => l.classList.toggle("on", l.hash === "#" + id)); }), { rootMargin: "-45% 0px -50% 0px" }).observe($("#" + id)));
new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) links.forEach(l => l.classList.remove("on")); }), { rootMargin: "-45% 0px -50% 0px" }).observe($("#home"));
addEventListener("scroll", () => { $("#bar").style.transform = `scaleX(${scrollY / (document.documentElement.scrollHeight - innerHeight || 1)})`; }, { passive: true });

// lightbox
const lb = $("#lb"), lbimg = $("#lbimg"), lbcap = $("#lbcap"); let cur = 0, list = [], last;
const vis = () => $$(".item").filter(i => !i.hidden).map(i => +i.dataset.i);
function show(i, first) { cur = i; const p = photo(i); const set = () => { lbimg.src = p.src; lbimg.alt = p.alt; lbcap.innerHTML = `${CATS[p.cat][0]}<small>${list.indexOf(i)+1} of ${list.length}</small>`; lbimg.classList.remove("swap"); };
  if (first || reduce) set(); else { lbimg.classList.add("swap"); setTimeout(set, 200); }
  new Image().src = photo(list[(list.indexOf(i)+1) % list.length]).src; }
function openLb(i) { last = document.activeElement; list = vis(); lb.classList.add("show"); requestAnimationFrame(() => lb.classList.add("vis")); document.body.style.overflow = "hidden"; show(i, true); $(".x", lb).focus(); }
function closeLb() { lb.classList.remove("vis"); setTimeout(() => lb.classList.remove("show"), 400); document.body.style.overflow = ""; last && last.focus(); }
const step = d => show(list[(list.indexOf(cur) + d + list.length) % list.length]);
grid.addEventListener("click", e => { const it = e.target.closest(".item"); if (it) openLb(+it.dataset.i); });
$(".x", lb).onclick = closeLb; $(".n", lb).onclick = () => step(1); $(".p", lb).onclick = () => step(-1);
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
document.addEventListener("keydown", e => { if (!lb.classList.contains("show")) return; if (e.key === "Escape") closeLb(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); });
let sx = 0; lb.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
lb.addEventListener("touchend", e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) step(d < 0 ? 1 : -1); });