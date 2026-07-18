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

## Configurar el deploy

En Hostinger (hPanel → Archivos → Cuentas FTP), crea una cuenta FTP para el dominio.
En GitHub → Settings → Secrets and variables → Actions:

| Secret | Valor |
|---|---|
| `FTP_SERVER` | Host FTP de Hostinger (ej. `ftp.joseluisalba.com`) |
| `FTP_USERNAME` | Usuario FTP |
| `FTP_PASSWORD` | Contraseña FTP |
| `FTP_REMOTE_DIR` | Normalmente `/public_html/` — verifícalo en hPanel |

Prueba primero contra un subdominio (`beta.joseluisalba.com`). Cuando esté bien, apuntas
a `public_html`.

**Antes de publicar:** desinstala WordPress del dominio o vacía `public_html`. El workflow
no borra `wp-content/`, y no quieres el WordPress viejo colgando debajo del sitio nuevo.

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

- [ ] `/about/` y `/es/sobre-mi/`: son BORRADOR. Verifica cada frase y llena los `[ ]`
      — falta un número concreto en Sportline y otro en el IFRS 9
- [ ] Endpoint real del formulario en `contact.astro` y `es/contacto.astro`
- [ ] Post 1: quitar `draft: true` cuando esté escrito
- [ ] Probar en subdominio antes de cambiar el dominio
- [ ] Vaciar el WordPress viejo de `public_html`
