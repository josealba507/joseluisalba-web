# joseluisalba.com

Sitio estático bilingüe en Astro. Compila en GitHub Actions y sube HTML a Hostinger por FTP,
así que el plan de Hostinger da igual: el servidor solo sirve archivos.

```
push a main → Actions compila → sube dist/ por FTP a public_html
```

## Idiomas

**Inglés en la raíz. Español en `/es/`.** El lector #1 del sitio es un empleador remoto,
así que el inglés no es el idioma secundario: es el principal. El español existe para el
tráfico que llega desde LinkedIn, donde tu audiencia es LATAM.

| | Inglés | Español |
|---|---|---|
| Portada | `/` | `/es/` |
| Archivo | `/blog/` | `/es/blog/` |
| Post | `/blog/<slug>/` | `/es/blog/<slug>/` |
| Acerca de | `/about/` | `/es/sobre-mi/` |
| Contacto | `/contact/` | `/es/contacto/` |
| RSS | `/rss.xml` | `/es/rss.xml` |

El `hreflang` y el selector de idioma se generan solos. Los 8 posts viejos de WordPress
se descartan: hay `Redirect 301` de cada uno hacia la portada en `public/.htaccess`.

## Escribir un post

Los posts viven en `src/content/blog/en/` y `src/content/blog/es/`. El nombre del archivo
es el slug — y **puede ser distinto en cada idioma**, eso es correcto (`sql-server-cost.md`
vs `costo-sql-server.md`).

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

`translationKey` es lo que une las dos versiones: genera el `hreflang` y el enlace
"Read in English / Leer en español". Si un post existe en un solo idioma, omítelo — está
permitido y el enlace apunta a la portada del otro idioma.

`eyebrow` es la etiqueta mono sobre el título. Es el **tipo** de pieza, no el tema.

### El flujo bilingüe realista

Escribe primero en español — es tu idioma, sale al doble de velocidad. Después haces la
versión en inglés. **No la traduzcas literal**: un post traducido se nota y trabaja en
contra justo con el lector que te importa. Reescríbelo, que suene escrito en inglés.

Ese es el costo real del bilingüe: cada post es 1.5x, no 1x. Si una semana no te da,
publica solo en inglés — el lector #1 lo lee ahí.

## Correr en local

```bash
npm install
npm run dev     # http://localhost:4321
npm run build
```

## Deploy

Ya está en producción (`https://joseluisalba.com`). Push a `main` dispara el workflow
`.github/workflows/deploy.yml`, que compila y sube `dist/` por FTP.

Los 4 secrets (`FTP_SERVER`/`FTP_USERNAME`/`FTP_PASSWORD`/`FTP_REMOTE_DIR`) ya están
cargados en GitHub → Settings → Secrets and variables → Actions. Si hay que tocarlos de
nuevo (cuenta FTP nueva, etc.), ver **CLAUDE.md → "Deploy real a Hostinger"** — tiene el
detalle de por qué los valores no son los "obvios" (el usuario FTP del dominio viene con
chroot, así que `FTP_REMOTE_DIR` es `/`, no `/public_html/`) y cómo se diagnosticó.

## Estructura

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

## Diseño

Negro, blanco, naranja `#FF6600`. El naranja **no decora**: marca estructura (la regla del
eyebrow, el subrayado activo, el sustantivo del argumento en la portada). Si un naranja no
señala nada, se quita.

Tipografía: Space Grotesk (display), Inter (texto), JetBrains Mono (metadatos). La etiqueta
mono sobre cada título es la firma del sitio: cada pieza se anuncia por su tipo antes que
por su nombre.

El índice es una tabla, no tarjetas. Fecha y tipo son datos.

## Pendientes

- [ ] Endpoint real del formulario en `contact.astro` y `es/contacto.astro` (hoy es un
      `mailto:` simple)
- [ ] Post 1: reemplazar el post de ejemplo (`draft: true`) por el primero real
- [ ] `public/.htaccess`: agregar los 301 de los 8 posts viejos de WordPress
- [ ] Limpieza cosmética en el servidor: borrar `home/` y `default.php`, que quedaron de
      la migración (ver CLAUDE.md)

Detalle completo, incluida la configuración real del deploy, en `CLAUDE.md`.
