# joseluisalba.com — Contexto del Proyecto

## Qué es esto
Sitio personal estático bilingüe de José Luis Alba (ingeniero de datos senior,
Panamá), construido en Astro. Objetivo: portafolio + blog técnico donde
escribe las decisiones reales detrás de su trabajo (pipelines, gobierno de
datos, migraciones). El lector #1 es un empleador remoto potencial — no un
lector casual.

**Este proyecto NO tiene relación con RanchOS/ranchos--app.** Stack, dominio,
convenciones y decisiones de diseño son completamente independientes. No
apliques patrones ni supuestos de ese otro proyecto acá (Firebase, Firestore,
BigQuery, vanilla JS SPA, etc. no existen en este repo).

## Estado actual (2026-07-18)
Proyecto recién arrancado, todavía no es un repo git. Scaffold parcial:
- **Existe:** `src/pages/index.astro`, `src/pages/es/index.astro`,
  `src/pages/rss.xml.js`, `README.md`.
- **Falta (referenciado por los archivos existentes pero sin crear
  todavía):** `package.json`, `astro.config.mjs`, `src/layouts/Base.astro`,
  `src/layouts/Post.astro` (si aplica), `src/components/PostIndex.astro`,
  `src/i18n/ui.ts`, config de content collections (`src/content/config.ts`),
  `src/styles/global.css`, `public/.htaccess`, y el workflow de GitHub
  Actions (`.github/workflows/` existe como carpeta pero está vacía).
- No asumas que algo del scaffold ya funciona sin verificar que el archivo
  exista primero.

## Stack
- **Astro** (sitio 100% estático). `npm run dev` → `localhost:4321`.
- **Deploy:** push a `main` → GitHub Actions compila → sube `dist/` por FTP a
  Hostinger (`public_html`). El plan de Hostinger da igual porque el servidor
  solo sirve archivos estáticos — no corre Astro ni Node.
- Sin backend, sin base de datos, sin autenticación.

## Idiomas — inglés es el idioma principal, no el secundario
El lector #1 es un empleador remoto: **inglés en la raíz**, español en `/es/`
(existe para tráfico de LinkedIn, audiencia LATAM).

| | Inglés | Español |
|---|---|---|
| Portada | `/` | `/es/` |
| Archivo | `/blog/` | `/es/blog/` |
| Post | `/blog/<slug>/` | `/es/blog/<slug>/` |
| Acerca de | `/about/` | `/es/sobre-mi/` |
| Contacto | `/contact/` | `/es/contacto/` |
| RSS | `/rss.xml` | `/es/rss.xml` |

`hreflang` y el selector de idioma se generan solos a partir del
`translationKey` del frontmatter (ver abajo). Los 8 posts viejos de WordPress
se descartan con `Redirect 301` de cada uno hacia la portada, en
`public/.htaccess`.

## Escribir un post
Los posts viven en `src/content/blog/en/` y `src/content/blog/es/`. El
nombre del archivo es el slug — **puede ser distinto en cada idioma**, es
correcto (`sql-server-cost.md` vs `costo-sql-server.md`).

```yaml
---
title: "Título"
description: "Una línea. Sale en Google y en el índice."
pubDate: 2026-07-19
eyebrow: "Case"              # Case | Decision | Governance | Note
translationKey: "app-to-bigquery"   # mismo valor en ambos idiomas
draft: false
---
```

- `translationKey` une las dos versiones del mismo post: genera el
  `hreflang` y el enlace "Read in English / Leer en español". Si un post
  existe en un solo idioma, se omite el campo — está permitido, y el enlace
  cruzado cae a la portada del otro idioma.
- `eyebrow` es la etiqueta mono sobre el título — es el **tipo** de pieza
  (Case/Decision/Governance/Note), no el tema del post.

### Flujo bilingüe realista
Escribir primero en español (idioma nativo del usuario, sale más rápido).
Después la versión en inglés — **nunca traducción literal**: un post
traducido se nota y trabaja en contra justo con el lector que importa acá.
Reescribir para que suene escrito en inglés desde el inicio, no traducido.
Costo real: cada post es ~1.5x el esfuerzo de uno solo. Si no alcanza el
tiempo, publicar solo en inglés (el lector #1 lee ahí) y dejar el español
para después — nunca al revés.

## Diseño
- **Paleta:** negro, blanco, naranja `#FF6600`. El naranja **no decora**:
  marca estructura (la regla del eyebrow, el subrayado activo, el sustantivo
  del argumento en la portada). Si un naranja no señala nada estructural, se
  quita.
- **Tipografía:** Space Grotesk (display), Inter (texto), JetBrains Mono
  (metadatos). La etiqueta mono sobre cada título es la firma visual del
  sitio — cada pieza se anuncia por su tipo antes que por su nombre.
- El índice de posts es una **tabla, no tarjetas** — fecha y tipo son datos,
  se muestran como tales.

## Configurar el deploy (cuando se retome)
En Hostinger (hPanel → Archivos → Cuentas FTP), crear una cuenta FTP para el
dominio. En GitHub → Settings → Secrets and variables → Actions:

| Secret | Valor |
|---|---|
| `FTP_SERVER` | Host FTP de Hostinger (ej. `ftp.joseluisalba.com`) |
| `FTP_USERNAME` | Usuario FTP |
| `FTP_PASSWORD` | Contraseña FTP |
| `FTP_REMOTE_DIR` | Normalmente `/public_html/` — verificar en hPanel |

Probar primero contra un subdominio (`beta.joseluisalba.com`). Cuando esté
bien, recién apuntar a `public_html`.

**Antes de publicar en el dominio real:** desinstalar WordPress del dominio o
vaciar `public_html`. El workflow no borra `wp-content/` — no dejar el
WordPress viejo colgando debajo del sitio nuevo.

## Estructura de carpetas (objetivo, ver "Estado actual" para qué existe hoy)
```
src/
  content/blog/en/*.md    Posts en inglés
  content/blog/es/*.md    Posts en español
  i18n/ui.ts              Strings, rutas y helpers de idioma
  pages/                  Inglés (raíz) + es/ (español)
  layouts/                Base + Post
  styles/global.css       Tokens: negro, blanco, #FF6600
public/.htaccess          301s de los posts viejos + caché
```

## Pendientes conocidos
- [ ] Scaffold base: `package.json`, `astro.config.mjs`, `Base.astro`,
      `PostIndex.astro`, `i18n/ui.ts`, content collection config,
      `global.css` — nada de esto existe todavía.
- [ ] Workflow de GitHub Actions (build + FTP deploy) — la carpeta
      `.github/workflows/` existe pero está vacía.
- [ ] `/about/` y `/es/sobre-mi/`: serán BORRADOR hasta verificar cada frase
      y llenar los `[ ]` — falta un número concreto en Sportline y otro en
      el IFRS 9.
- [ ] Endpoint real del formulario en `contact.astro` y `es/contacto.astro`.
- [ ] Post 1: quitar `draft: true` cuando esté escrito.
- [ ] Probar en subdominio antes de cambiar el dominio real.
- [ ] Vaciar el WordPress viejo de `public_html`.
- [ ] Inicializar git (`git init`) — no es un repo todavía.

## Cómo trabajar en este proyecto
- Repo separado de RanchOS — no reutilizar convenciones/decisiones de ese
  proyecto acá (stacks completamente distintos).
- Sitio 100% estático — no agregar backend/API/base de datos sin que el
  usuario lo pida explícitamente; el diseño actual depende de que Hostinger
  solo sirva archivos.
