
# Atlas-modellen / The Atlas Model

Atlas-modellen er et åpent rammeverk utviklet av **Unge Vil** for å bygge bærekraftige og kreative prosjekter for unge.  
Internasjonalt er modellen kjent som **The Atlas Model**. Landingssiden er designet som en **pitch/introduksjon**, med fokus på animasjoner, moderne gradienter og tydelig presentasjon av modulene.

> **Status:** Work in progress – vi søker aktivt støtte for videre utvikling.

> 🪪 **Lisens:** Atlas-modellen deles under [Creative Commons Attribution – No Derivatives 4.0 International (CC BY-ND 4.0)](https://creativecommons.org/licenses/by-nd/4.0/). Krediter «Unge Vil» og bevar innholdet uendret når du bruker modellen.

## 🏁 Hurtigstart (GitHub Pages)

1. **Fork/klon** repoet til din GitHub-konto.
2. Gå til **Settings → Pages** og velg:
   - *Source*: `Deploy from a branch`
   - *Branch*: `main` (root)
3. Vent til side er publisert.

> **SEO/Indeksering:** Vi har lagt inn `robots.txt` og `<meta name="robots" content="noindex, nofollow">` for å forhindre indeksering mens siden er i utvikling. Fjern disse når du er klar for lansering.

## 🧩 Innhold og struktur

```
/
├─ index.html
├─ robots.txt         # blokkér søkemotorer (fjern for lansering)
├─ assets/
│  ├─ css/
│  │  └─ styles.css
│  ├─ js/
│  │  └─ app.js
│  └─ img/
│     ├─ UngeVil-dark-line.png
│     ├─ atlas-logo.png
│     ├─ module-blanke-ark.png
│     ├─ module-forstaelse.png
│     ├─ module-gi-det-videre.png
│     └─ module-idelab.png
└─ /docs (valgfritt)
```

## ✍️ Redigeringsguide

- **Logo/link i footer:** `assets/img/UngeVil-dark-line.png` og lenken peker til https://www.ungevil.no/
- **Jan Helge-sitat:** Oppdater bildet i seksjonen *"Et ansikt på modellen"* – bytt ut `src="assets/img/jan-helge.jpg"` med korrekt filnavn. **Krediter** i `figcaption` (Growing Youth Work – https://www.growingyouthwork.eu/).
- **Moduler:** Legg til/fjern moduler i HTML (`<section id="modules">`) og (valgfritt) i `app.js` dersom du ønsker å generere dem dynamisk.
- **Testimonials og “Brukes av”-seksjoner:** Legg inn ekte logoer, navn og tekst. Det er placeholder-data som kan kopieres/endres.

## 🧪 Utviklermodus

- CSS er 100% i `assets/css/styles.css` (inkl. gradient-animasjoner og reveal).
- JS (`assets/js/app.js`) har Intersection Observer for reveal, enkel “tilt” og et lite testimonials-rotasjonsskript (uten tredjepart).
- Ingen bygg-steg – kun statiske filer.

## 🔒 Personvern og krediteringer

- Foto av Jan Helge **skal krediteres** Growing Youth Work (https://www.growingyouthwork.eu/).
- Ikon- og modulgrafikk er levert av Unge Vil/Atlas (deg).

## 🚀 Klar for offentlig lansering?

1. Fjern `robots.txt`.
2. Fjern `<meta name="robots" content="noindex, nofollow">` i `index.html`.
3. Legg inn ekte SEO-metadata (title/description/open graph), Google Analytics, og oppdater innholdsseksjonene med faktiske navn/logoer/testimonials.

Lykke til! 💜


## 🔧 Redigering via JSON
- `assets/data/orgs.json` – navn/logo-tekst for «Brukes allerede av»
- `assets/data/testimonials.json` – sitater
- `assets/data/supporters.json` – støttespillere
Endre disse filene uten å touche HTML.

## 🌗 Light/Dark mode
Klikk 🌗-knappen øverst til høyre for å bytte. Valg lagres i `localStorage`.

📍 Nettsider  
- Norsk: [https://atlasmodellen.no](https://atlasmodellen.no)  
- Engelsk / Internasjonal: [https://atlasmodel.org](https://atlasmodel.org)

🪪 Lisens
Atlas-modellen er lisensiert under **Creative Commons Attribution–No Derivatives 4.0 International (CC BY-ND 4.0)**.

- 🔗 Lisens: [creativecommons.org/licenses/by-nd/4.0/](https://creativecommons.org/licenses/by-nd/4.0/)
- ✅ Du kan bruke og dele modellen fritt, så lenge du navngir "Atlas-modellen" / "The Atlas Model" og "Unge Vil" som kilde.
- 🚫 Du har ikke lov til å publisere endrede versjoner av modellen.

🔗 Eksempel på kreditering  
> Basert på Atlas-modellen, utviklet av Unge Vil – [atlasmodellen.no](https://atlasmodellen.no) / [atlasmodel.org](https://atlasmodel.org)
