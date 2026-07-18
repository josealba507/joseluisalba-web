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
Repo en GitHub: `josealba507/joseluisalba-web` (público). Scaffold Astro
completo y funcional — `npm install && npm run dev` levanta el sitio,
`npm run build` compila sin errores (verificado). Home (en/es), plantilla de
artículo, índice de blog (en/es), About/Contact (en/es) y RSS (en/es) ya
existen y renderizan. `public/.htaccess` y el workflow real de GitHub
Actions (`.github/workflows/`) todavía NO existen — ver Pendientes.

**Diseño visual importado desde Claude Design** (2026-07-18): el sistema
visual (paleta, tipografía, layout de header/footer/hero/índice/artículo)
viene de un mockup en `claude.ai/design`, proyecto "Portafolio técnico
senior en datos" (`668f178f-d135-44cc-ade4-d53f600e64f0`), archivo
`Sitio Personal.dc.html`, importado vía el MCP `DesignSync`. El copy real
(hero, dek, nombre) y la estructura de navegación (Blog/About/Contact) son
los ya definidos en este documento — del mockup solo se tomó el vestido
visual, no su copy de ejemplo ("D. Herrera") ni su IA (Writing/Work/About).
Si se vuelve a tocar el diseño, ese proyecto de Claude Design sigue siendo
la fuente de verdad visual — no reinventar paleta/tipografía a mano.

**Detalle no obvio para trabajar con `astro:content` en este proyecto:**
`CollectionEntry.id` incluye la extensión del archivo (`"en/slug.md"`);
`CollectionEntry.slug` NO la incluye (`"en/slug"`). Todas las funciones que
arman URLs (`postUrl()` en `src/i18n/ui.ts`, los `getStaticPaths()` de
`src/pages/blog/[slug].astro` y `src/pages/es/blog/[slug].astro`, y los
`link` de ambos `rss.xml.js`) usan `.slug`, nunca `.id`, para esto — usar
`.id` genera URLs rotas con `.md` en la ruta (bug real encontrado y
corregido durante la implementación de este scaffold, confirmado con el
servidor de dev devolviendo 404 hasta el fix).

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
Fuente de verdad: el proyecto de Claude Design referenciado arriba en
"Estado actual". Tokens ya portados a `src/styles/global.css`:
- **Paleta:** tinta `#111110` (`--ink`), papel `#FCFBF9` (`--paper`, fondo
  real del sitio), naranja `#FF6600` (`--orange`), más una escala de grises
  cálidos para texto secundario (`--ink-70/55/40`) y hairlines (`--rule`,
  `--rule-strong`). `--canvas` (`#E9E7E3`) es el fondo del LIENZO de Claude
  Design detrás de las pantallas del mockup — nunca el fondo real del
  sitio, no usarlo como tal. El naranja **no decora**: marca estructura
  (regla del eyebrow, subrayado activo del nav, el sustantivo del
  argumento en el H1). Si un naranja no señala nada estructural, se quita.
- **Tipografía:** Archivo (`--display`, headings/nav/botones), Source
  Serif 4 (`--serif`, cuerpo — es el font-family por defecto del `body`),
  IBM Plex Mono (`--mono`, eyebrows/metadatos/fechas/nav). La etiqueta mono
  sobre cada título es la firma visual del sitio — cada pieza se anuncia
  por su tipo antes que por su nombre.
- El índice de posts (`PostIndex.astro`) es una lista editorial con fecha y
  tiempo de lectura alineados a la derecha como datos — no tarjetas.
- El artículo (`Post.astro`) numera dentro de su propio `eyebrow`
  (`DECISION · №01`, calculado por orden cronológico ascendente dentro del
  mismo tipo) y muestra "Next in {eyebrow}" al final si existe un post
  posterior del mismo tipo.

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

## Estructura de carpetas (estado real, 2026-07-18)
```
src/
  content/config.ts       Schema de la colección blog (zod)
  content/blog/en/*.md    Posts en inglés (hoy: 1 de ejemplo, draft:true)
  content/blog/es/*.md    Posts en español (ídem)
  i18n/ui.ts              Diccionario, rutas por idioma, postUrl()
  utils.ts                readingTime()
  pages/                  Inglés (raíz) + es/ (español) — home, blog,
                           blog/[slug], about/sobre-mi, contact/contacto,
                           rss.xml
  layouts/Base.astro      Header (nav + selector EN/ES) + footer, hreflang
  layouts/Post.astro      Plantilla de artículo (usa Base)
  components/PostIndex.astro   Lista de posts (usada en home y /blog/)
  styles/global.css       Tokens de diseño + fuentes de Google Fonts
.claude/launch.json       Config del dev server (npm run dev, puerto 4321)
```
`public/.htaccess` todavía no existe (ver Pendientes).

## Pendientes conocidos
- [ ] Workflow de GitHub Actions (build + FTP deploy) — la carpeta
      `.github/workflows/` existe pero está vacía.
- [ ] `public/.htaccess` con los 301 de los 8 posts viejos de WordPress —
      no existe todavía.
- [ ] `/about/` y `/es/sobre-mi/`: siguen BORRADOR — faltan las cifras
      concretas de Sportline y de IFRS 9 (marcadas con `[Cifra concreta
      pendiente...]` directo en el HTML para que sean fáciles de encontrar).
- [ ] Endpoint real del formulario de contacto — hoy `contact.astro`/
      `es/contacto.astro` son un `mailto:` simple, no un formulario.
- [ ] Reemplazar/borrar el post de ejemplo (`draft: true`,
      `src/content/blog/en/template-example.md` +
      `es/ejemplo-plantilla.md`) por el primer post real.
- [ ] Probar el deploy en subdominio (`beta.joseluisalba.com`) antes de
      cambiar el dominio real.
- [ ] Vaciar el WordPress viejo de `public_html` antes de publicar.
- [ ] LinkedIn real en el footer — hoy `href="#"` (no se inventó una URL).

## Cómo trabajar en este proyecto
- Repo separado de RanchOS — no reutilizar convenciones/decisiones de ese
  proyecto acá (stacks completamente distintos).
- Sitio 100% estático — no agregar backend/API/base de datos sin que el
  usuario lo pida explícitamente; el diseño actual depende de que Hostinger
  solo sirva archivos.
