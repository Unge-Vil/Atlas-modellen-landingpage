# 🌍 Multilanguage & Domain Setup for Atlas Model

This document describes how the multilingual and domain structure for **Atlas-modellen / The Atlas Model** is organized.

---

## 🏗️ Architecture Overview

| Domain | Role | Language |
|--------|------|-----------|
| **atlasmodel.org** | Main public site (English) | English |
| **atlasmodel.org/no/** | Norwegian version | Norwegian |
| **atlasmodellen.no** | Redirects to `https://atlasmodel.org/no/` | Norwegian |
| **docs.atlasmodel.org** | Technical documentation portal | Multi-language (optional) |

Both domains represent the same project and share the same license and ownership.

---

## ⚙️ GitHub Pages Setup

**Repository structure:**

```
/
├── index.html                # English landing page
├── /no/index.html            # Norwegian version
├── /docs/                    # Optional documentation (Docusaurus / MkDocs)
├── LICENSE.md
└── README.md
```

**CNAME configuration:**
```
atlasmodel.org
```

**DNS:**
- `atlasmodel.org` → Points to GitHub Pages  
- `docs.atlasmodel.org` → Points to same or secondary repo  
- `atlasmodellen.no` → 301 redirect to `https://atlasmodel.org/no/`

---

## 🧭 SEO and hreflang

Add the following `<link>` tags inside the `<head>` of each page:

```html
<link rel="alternate" href="https://atlasmodel.org/en/" hreflang="en" />
<link rel="alternate" href="https://atlasmodel.org/no/" hreflang="no" />
<link rel="alternate" href="https://atlasmodel.org/" hreflang="x-default" />
```

These tags tell Google which language version each page belongs to.

---

## 🧠 Language Detection Script

To automatically redirect Norwegian visitors:

```js
if (navigator.language.startsWith('no')) {
  window.location.href = 'https://atlasmodel.org/no/';
}
```

Add a manual selector in your header:

```
🌍 English | Norsk
```

---

## 🔎 SEO Summary

| Goal | Solution |
|------|-----------|
| Unified SEO authority | Use `atlasmodel.org` for all pages |
| Local relevance | Keep `/no/` as Norwegian path |
| Brand recognition | Keep `atlasmodellen.no` for printed / Norwegian communication |
| Proper language indexing | Use hreflang tags + 301 redirect |

---

## 📘 Example credit text

**Norwegian:**
> © 2025 Unge Vil. Atlas-modellen deles fritt under CC BY-ND 4.0-lisensen.  
> Du kan bruke modellen fritt, så lenge du nevner Atlas-modellen og Unge Vil som kilde.  
> Les mer på [atlasmodellen.no/lisens](https://atlasmodellen.no/lisens)

**English:**
> © 2025 Unge Vil. The Atlas Model is shared under the CC BY-ND 4.0 license.  
> You may use it freely, provided you credit The Atlas Model and Unge Vil.  
> Learn more at [atlasmodel.org/license](https://atlasmodel.org/license)
