
# 🌊 Atlas-modellen — Redesignplan for Codex

Dette dokumentet beskriver hele planstrukturen for nytt design av Atlas-modellen. Det skal brukes direkte i Codex med kommandoen **/plan** for å generere oppgaver. Siden hostes på GitHub Pages (aktiv DNS). Alle referanser til dokumentasjon skal peke til **https://docs.atlasmodel.org**.

---

## 🎯 Overordnet mål

Bygg et nytt, moderne og “fluid” nettsted for **Atlas-modellen** med fokus på bølgete seksjonsoverganger, modul-gradienter, høy tilgjengelighet (WCAG 2.2 AA), animasjoner, flerspråk (NO/EN), og SEO-struktur (men med midlertidig noindex).

Målet er å gjenskape følelsen av flyt og samarbeid som modellen står for, med levende animasjoner og organisk oppbygging — samtidig som alt er statisk og hostet trygt på GitHub Pages.

---

## 🌍 Tekniske krav

- **Hosting:** GitHub Pages (aktiv DNS)
- **Flerspråk:** atlasmodel.org/en og atlasmodel.org/no  
  - atlasmodellen.no → 301 redirect → atlasmodel.org/no
- **SEO:** `<meta name="robots" content="noindex, nofollow">` foreløpig
- **Lenke til dokumentasjon:** https://docs.atlasmodel.org
- **WCAG 2.2 AA:** kontrast ≥ 4.5:1, tastaturnavigasjon, fokusstiler, ARIA, `prefers-reduced-motion`
- **Dark/Light mode:** via CSS-variabler og bruker-toggle
- **Ytelse:** lazyloading, inline critical CSS, komprimerte SVG-bølger
- **Animasjoner:** tillatt, ønsket og fremtredende (bruk myke “wave” og “flow”-overganger)
- **Typografi:** Montserrat + system fallback

---

## 🧭 Struktur og seksjoner

### 1. Hero / Header
- “Powered by Unge Vil” badge
- Tittel: *Atlas-modellen*
- Undertittel: *Et åpent rammeverk for kreativt ungdomsarbeid og samarbeid på tvers av sektorer. Bruk det fritt. Tilpass. Del tilbake.*
- Knapper:
  - “Se modulene”
  - “Les modellen” → `https://docs.atlasmodel.org`
- Språk- og tema-toggle (øverst til høyre)
- Stor bølgete bakgrunn (SVG eller CSS), gjerne animert bølgebevegelse

### 2. Om modellen
- Kort forklaring + enkel illustrasjon
- Lenke til dokumentasjonen
- Lett fade-in animasjon når seksjonen vises

### 3. Modulene
- Grid med modul-kort (uten nummer)
- Hver modul har ikon, tittel, kort tekst, og egen gradient
- Hover: myk skalering + flytende glans
- Gradienter (klassene):

| Modul | Klasse | Gradient |
|-------|---------|----------|
| Idélab | `.mod-idealab` | `linear-gradient(135deg, #12c4ad 0%, #4a00e0 100%)` |
| Blanke ark | `.mod-blankeark` | `linear-gradient(135deg, #f7971e 0%, #ffd200 100%)` |
| Forståelsesmodul | `.mod-forstaelse` | `linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)` |
| Gi det videre | `.mod-gi-det-videre` | `linear-gradient(135deg, #00b09b 0%, #96c93d 100%)` |

### 4. Brukes av / Samarbeid
- Horisontal logo-scroller (autoplay, stopper ved hover)
- Tekst: *Atlas-modellen brukes allerede i prosjekter på tvers av Norge og internasjonalt.*
- JSON-basert logo-liste

### 5. Møt menneskene bak
- To-kolonne layout:
  - Venstre: bilde av Jan Helge (tydelig ansikt, med bølgeformet maske)
  - Høyre: sitat og rolle
- Lett fade-in + scrollreveal
- CTA “Se flere bidragsytere” (placeholder)

### 6. Hva sier folk?
- Testimonial-kort med “Eksempel” placeholders (JSON-basert)
- Subtil “float” animasjon i bakgrunnen

### 7. Støtte / Partnere
- Grid med logoer og “Takk for støtten”
- JSON-basert, lett fade-in
- Hover: glød eller wave-effekt på logo

### 8. Footer
- Lik dagens versjon, men med gradient bakgrunn og bedre spacing
- Lisens: **CC BY-ND 4.0**
- Kontakt: org@ungevil.no
- Lenker: Creative Commons, GitHub, språkvalg

---

## ⚙️ Filstruktur

```
/assets/
  /icons/
  /img/
  /svg/waves/
/data/
  modules.no.json
  modules.en.json
  partners.json
  testimonials.no.json
  testimonials.en.json
  team.no.json
  team.en.json
/styles/
  tokens.css
  base.css
  components.css
  utilities.css
/scripts/
  i18n.js
  theme.js
  ui.js
/en/index.html
/no/index.html
/index.html
robots.txt
```

---

## 🎨 Design Tokens

```css
:root {
  --brand: #12c4ad;
  --brand-2: #8e2de2;
  --brand-3: #4a00e0;
  --bg: #0f0f16;
  --surface: rgba(255,255,255,0.06);
  --txt: #e7e8ee;
  --focus: #12c4ad;
}
@media (prefers-color-scheme: light) {
  :root {
    --bg: #f7f8fb;
    --txt: #1b1c22;
  }
}
```

Font: Montserrat (400/600/700)  
Animasjoner: CSS `@keyframes wave`, `fadeInUp`, `float`

---

## 💾 Datafiler

**modules.no.json**
```json
[
  {"id":"idealab","title":"Idélab","desc":"Kreativ idéutvikling og eksperimentering.","class":"mod-idealab","icon":"bulb"},
  {"id":"blanke-ark","title":"Blanke ark","desc":"Rett fram og ny start.","class":"mod-blankeark","icon":"book"},
  {"id":"forstaelse","title":"Forståelsesmodul","desc":"Felles forståelse og språk mellom aktører.","class":"mod-forstaelse","icon":"puzzle"},
  {"id":"gi-det-videre","title":"Gi det videre","desc":"Metoder for deling og skalering.","class":"mod-gi-det-videre","icon":"share"}
]
```

Andre JSON-filer: `partners.json`, `testimonials.no.json`, `team.no.json` — med placeholders.

---

## 🧠 Interaktivitet

- **Språkvelger:** NO/EN toggle → endrer URL + lagrer i localStorage
- **Tema-velger:** Dark/Light → toggler `.theme-light`/`.theme-dark`
- **Scroll reveal:** via IntersectionObserver
- **Wave transitions:** SVG `path`-animasjon mellom seksjoner
- **Hover-effekter:** myk `transform: scale(1.03)` + glød

---

## 🧩 Komponenter

1. Topbar (språk + tema)
2. Hero
3. SectionHeader
4. ModuleGrid (fra JSON)
5. PartnerScroller
6. TeamSpotlight
7. TestimonialList
8. Footer
9. WaveSeparator (SVG mellom seksjoner)

---

## ✅ Testscenarioer

- 360px mobilvisning fungerer uten scrollfeil
- Tastatur-navigasjon fungerer overalt
- Light/Dark har god kontrast
- Språkbytte endrer alt innhold og URL
- “Les modellen” åpner docs.atlasmodel.org i ny fane
- Animasjoner stopper ved `prefers-reduced-motion: reduce`

---

## 📦 Oppgaver for Codex

1. Opprett struktur og CSS tokens
2. Implementer Hero med animert bølge
3. Bygg modulgrid med modul-gradienter
4. Lag JSON-laster og dynamisk rendering
5. Implementer språk- og tema-toggle
6. Legg inn seksjoner for samarbeid, team, testimonials og støtte
7. Implementer footer med lisens
8. Legg til SEO meta, hreflang, robots.txt (noindex)
9. Optimaliser bilder og SVG
10. Skriv README for deploy og redigering

---

**Lenke til dokumentasjonen:**  
👉 https://docs.atlasmodel.org

