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

## Estado actual (2026-07-19)
**EN PRODUCCIÓN:** `https://joseluisalba.com` sirve el sitio real (verificado
`200 OK`, contenido correcto, sin WordPress). Repo en GitHub:
`josealba507/joseluisalba-web` (público). Deploy automático funcionando:
push a `main` (o `workflow_dispatch` manual) compila y sube por FTP — ver
la sección "Deploy real a Hostinger" más abajo para la configuración exacta
de secrets, que costó bastante diagnosticar. Home (en/es), plantilla de
artículo, índice de blog (en/es), About/Contact (en/es) y RSS (en/es) ya
existen y renderizan. `public/.htaccess` existe (solo `DirectoryIndex`, sin
los 301 de WordPress todavía — ver Pendientes).

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

## Analítica y SEO (2026-07-20, EN PRODUCCIÓN)
Todo vive en el `<head>` compartido, `src/layouts/Base.astro` — un solo
lugar para las dos versiones de idioma, nada duplicado por página.

- **Google Tag Manager** (`GTM-P76P9SDJ`) y **Cloudflare Web Analytics**
  (token `2219e10584ce4c50a116a2fce523de63`, cargado con `defer`) — ambos
  como `<script is:inline>` en el `<head>`. Sin cookies, sin consent
  banner (Cloudflare Web Analytics no usa cookies).
- **Nota sobre el pedido original:** se pidió instalar esto como "el meta
  tag de verificación de Google Search Console", pero el snippet dado es
  el contenedor de **Google Tag Manager** (`googletagmanager.com/gtm.js`),
  no un `<meta name="google-site-verification">`. Son productos
  distintos — se instaló GTM tal cual se pidió (es además un método
  válido de verificación de Search Console, si en Search Console se elige
  "Google Tag Manager" como método). Si hace falta la verificación
  *directa* de Search Console (el meta tag real), pedirlo aparte.
- **Sitemap:** `@astrojs/sitemap`, generado en build (`dist/sitemap-index.xml`
  + `dist/sitemap-0.xml`), incluye las 10 páginas de ambos idiomas
  automáticamente (no hace falta mantenerlo a mano). **Pineado a la
  versión `3.4.2` a propósito — no actualizar sin probar primero:** la
  versión que instala `npm install @astrojs/sitemap` por defecto (3.7.x)
  rompe el build con este Astro 4.16 (`Cannot read properties of
  undefined (reading 'reduce')` en el hook `astro:build:done` — cambio de
  API interno entre versiones, sin `peerDependencies` que lo prevengan).
- **`robots.txt`**: archivo estático en `public/robots.txt` (ahí SÍ es el
  mecanismo nativo de Astro — todo lo que vive en `public/` se copia tal
  cual a la raíz del sitio), con `Allow: /` y referencia al sitemap.
- **hreflang** (`en`/`es`/`x-default` → inglés): esto **ya existía** desde
  el scaffold inicial (`Base.astro`, con resolución real vía
  `translationKey` para posts, no solo entre home pages) — no fue
  necesario tocarlo, solo verificarlo.

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

## Deploy real a Hostinger — configuración confirmada (2026-07-19, EN PRODUCCIÓN)

El dominio `joseluisalba.com` vivía originalmente en un plan de Hostinger de
**un solo dominio** (con WordPress). El usuario pagó para migrarlo a su otra
cuenta multi-dominio (la misma donde está `albaanalytics.com`) en vez de
redirigir DNS — decisión suya, ver el hilo de esa conversación si hace falta
el razonamiento de costo/beneficio.

### Secrets de GitHub Actions — valores confirmados (actualizado 2026-07-19, ronda 2)
| Secret | Valor real que funciona | Por qué no es lo "obvio" |
|---|---|---|
| `FTP_SERVER` | `joseluisalba.com` (sin `ftp://`, sin espacios, sin `/` final) | hPanel muestra el valor como `ftp://joseluisalba.com` en la pantalla de detalles — ese prefijo NO va en el secret. |
| `FTP_USERNAME` | El usuario FTP **"del sistema"** (el que Hostinger asigna por defecto a la cuenta, distinto del usuario específico del dominio que se probó primero) | El primer usuario probado (formato `NNNNNNNNN.joseluisalba.com`, con chroot) llevaba a una carpeta que NO es la que sirve el sitio realmente — ver punto 8 de la saga abajo. |
| `FTP_PASSWORD` | La contraseña de ese usuario FTP | — |
| `FTP_REMOTE_DIR` | **`/public_html/`** (con el usuario "del sistema" — NO uses este valor si volvés a cambiar a un usuario chroot específico de dominio, ver tabla de contexto en el punto 8) | Ni `/` a secas ni la ruta larga `/domains/joseluisalba.com/public_html/` corresponden a la carpeta que el servidor web realmente lee — confirmado con una prueba destructiva (ver punto 8). |

**Antes de tocar estos valores de nuevo:** la carpeta correcta se confirmó
con una prueba irrefutable — el usuario borró el contenido de
`Sitios Web → joseluisalba.com → Manage → File Manager` (el acceso
específico de ESE sitio, no el explorador general de la cuenta) y la
página pública pasó a dar "no existe". Si en el futuro hay dudas de nuevo
sobre la ruta correcta, repetir esa misma prueba (borrar con backup
primero) es más confiable que cualquier comparación de tamaños/timestamps
por FTP — ver por qué en el punto 8.

### La saga completa (para no repetir el diagnóstico si vuelve a pasar)
1. **Primer intento** con `FTP_REMOTE_DIR=/domains/joseluisalba.com/public_html/`
   — el deploy "funcionaba" (Actions en verde, archivos confirmados por FTP),
   pero el sitio público daba **403 Forbidden**. La `FTP-Deploy-Action` había
   creado esa ruta completa como carpeta nueva *dentro* del chroot del
   usuario específico del dominio — es decir, los archivos vivían en un
   rincón que el servidor web nunca miraba.
2. Se descartaron, con pruebas directas (no solo suposición): archivos
   faltantes (no, estaban completos), permisos (no, estaban abiertos de
   más), `.htaccess` bloqueando (se probó **subiendo el sitio con
   `.htaccess` completamente ausente del servidor** y el 403 no cambió en
   nada — prueba concluyente), SSL sin emitir, dominio inactivo.
3. **Técnica clave usada para diagnosticar sin depender de la interfaz de
   Hostinger:** un workflow de GitHub Actions temporal
   (`ftp-debug.yml`, ya borrado) que corre `curl ftp://...` directo con los
   mismos secrets del deploy real, para listar el directorio remoto
   (incluye dotfiles, a diferencia del explorador de archivos web que los
   esconde por defecto) y volcar contenido de archivos puntuales — todo
   dentro del runner de GitHub, así que los secrets nunca pasan por Claude.
   Cuando hubo que diagnosticar por qué `FTP_SERVER`/`FTP_REMOTE_DIR`
   fallaban con errores de `curl` sin poder ver el valor real, se agregó un
   paso que imprime **solo longitud y booleanos** (`empieza con ftp://`,
   `tiene espacios`, `empieza con /`) — nunca el contenido — para
   diagnosticar a ciegas sin exponer el secret. Así se encontró que
   `FTP_REMOTE_DIR` tenía el texto `public_html` sin ninguna barra (11
   caracteres, coincidía exacto), lo que generaba una URL pegada sin
   separador (`ftp://joseluisalba.compublic_html`) — de ahí el error
   "couldn't resolve host".
4. **Soporte de Hostinger (su IA, "Kodee") ofreció 2 fixes que NO resolvieron
   nada:** forzar actualización de CDN, y desactivar el CDN por completo.
   Ninguno cambió el 403 — el problema nunca fue DNS/CDN, aunque por un
   rato pareció serlo (la zona DNS usa un `ALIAS`/`CNAME` al CDN propio de
   Hostinger — `joseluisalba.com.cdn.hstgr.net` — en vez de un `A` record
   directo, lo cual generó una pista falsa razonable pero equivocada).
5. **La resolución real fue manual:** el usuario copió los archivos a mano,
   dentro del explorador de archivos de hPanel, desde la carpeta anidada
   huérfana hacia la **raíz real** `public_html/` (donde vive el
   `default.php` de Hostinger que generaba la página "Default page"/"You
   Are All Set to Go" que se veía en su lugar). Recién ahí el sitio quedó
   arriba. Confirmado con `X-Powered-By: PHP/7.4.33` en los headers ANTES
   del fix (era `default.php` respondiendo, no nuestro `index.html`) y su
   desaparición después.
6. Quedaron en el servidor, inofensivos pero sin limpiar: la carpeta
   `home/` (el chroot anidado huérfano del primer intento) y `default.php`
   — se pueden borrar a mano desde el File Manager cuando haya tiempo, no
   son urgentes ni los toca el deploy automático (que solo sincroniza los
   archivos que él mismo sube, nunca borra lo que no reconoce).
7. **Regla a seguir de ahora en más para cualquier ajuste de estos
   secrets:** si `FTP_REMOTE_DIR`/`FTP_USERNAME`/`FTP_SERVER` hay que
   tocarlos de nuevo, usar el patrón del punto 3 (workflow temporal con
   diagnóstico de longitud/booleanos) en vez de adivinar — encontró 3 bugs
   de secrets distintos (prefijo `ftp://` sobrante, falta de `/` inicial,
   ruta incorrecta por el chroot) en minutos cada uno, sin necesitar ver
   los valores reales.

### Ronda 2 (agregar favicon reveló que la ruta seguía sin ser la correcta)
Al agregar el favicon del sitio (`public/favicon.svg` + PNGs, ver sección
Diseño), el deploy automático via GitHub Actions reportaba éxito una y
otra vez, pero el sitio público nunca cambiaba. Esto llevó a un segundo
diagnóstico, más largo que el primero:

8. **Hallazgo central: existen VARIAS carpetas llamadas (o mostradas
   como) `public_html` en esta cuenta, anidadas entre sí, y solo UNA es
   la real.** Se identificaron al menos 3 candidatas distintas navegando
   por hPanel (`Home` de la cuenta → `public_html` → otra `public_html`
   anidada adentro → sección `domains/joseluisalba.com/public_html/` del
   explorador general), cada una con contenido ligeramente distinto
   (tamaños de `index.html` distintos: 9.7 KB vs 9.52 KB). Comparar
   tamaños/timestamps por FTP **no alcanzó** para determinar cuál era la
   real — la única prueba que lo confirmó sin ambigüedad fue **borrar el
   contenido de una candidata (con backup primero) y confirmar que el
   sitio público se rompía** (pasó a "no existe"). Esa fue la técnica que
   finalmente identificó la carpeta correcta: el acceso específico del
   sitio vía `Sitios Web → joseluisalba.com → Manage → File Manager`
   (no el explorador general de archivos de la cuenta, que puede mostrar
   una vista distinta/anidada de la misma cuenta).
9. **El mecanismo de deploy automático (tanto `SamKirkland/FTP-Deploy-Action`
   como `lftp mirror`) resultó poco confiable contra esta cuenta
   específica de Hostinger — reportaba éxito sin haber escrito nada, o se
   colgaba indefinidamente:**
   - Se cambió de `FTP-Deploy-Action` (Node.js) a `lftp mirror` pensando
     que el problema era del cliente — confirmado que NO era eso: `lftp`
     también reportó "Sync complete" con cero cambios reales en el
     servidor (verificado con una lectura FTP inmediata después, no
     confiando en el log de la propia herramienta).
   - Subidas de UN solo archivo chico vía `lftp put` sí funcionaron de
     forma consistente (verificado varias veces, con contenido
     confirmado byte a byte). El patrón sugiere que el canal de datos
     FTP (no el de control) es inestable contra este servidor
     específico bajo ciertas condiciones — degradándose con
     `mirror`/transferencias en lote, no con transferencias individuales.
   - Una corrida del `mirror` completo llegó a colgarse **más de 10
     minutos** (contra los <1 minuto normales) y hubo que cancelarla a
     mano vía la API de GitHub. Se le agregó `timeout-minutes: 8` al job
     y `net:timeout`/`net:max-retries` a `lftp`, y se sacó
     `--parallel=3` (sospecha de que las conexiones paralelas agravan el
     problema contra este servidor) — pero **esto no está
     comprobadamente resuelto**, ver Pendientes.
10. **Lección aparte, real y confirmada: el HTML de la portada tiene
    caché de página en el servidor que NO se invalida solo con subir un
    archivo nuevo, a diferencia de los assets estáticos (imágenes/SVG).**
    Se subieron los 3 archivos de favicon manualmente y quedaron
    accesibles al instante (200 OK, contenido correcto) — pero
    `index.html` en la carpeta correcta se sobrescribió manualmente
    *dos veces* antes de que el sitio público reflejara el cambio (las
    etiquetas `<link rel="icon">` en el `<head>`). Ni parámetros
    anti-caché en la URL (`?nocache=...`) ni pegarle directo a la IP del
    hosting evitaron ver la versión vieja en el medio. **No se identificó
    la causa exacta** (¿LiteSpeed Cache con caché de página activado?
    ¿algo más específico de esta cuenta?) — quedó resuelto por fuerza
    bruta (subir de nuevo), no diagnosticado a fondo. Si vuelve a pasar
    que un cambio de HTML no se refleja pese a estar confirmado en el
    servidor, **repetir la subida del archivo una segunda vez** antes de
    seguir buscando causas más profundas.
11. **Estado actual del pipeline automático: NO confiable todavía.**
    El deploy manual (build local + arrastrar `dist/` al File Manager
    específico del sitio, reemplazando existentes) es, a la fecha de
    este registro, el único método probado consistentemente exitoso.
    `deploy.yml` sigue existiendo y puede intentarse, pero cualquier
    corrida debe verificarse después contra el sitio público (no confiar
    en el "✓" de GitHub Actions) — ver Pendientes.

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
- [ ] **Validar que el deploy 100% automático (push → GitHub Actions →
      FTP) realmente funciona de punta a punta — NO confirmado todavía.**
      Después de la Ronda 2 (ver sección de deploy arriba), la ruta
      correcta cambió (`FTP_REMOTE_DIR=/public_html/` con el usuario
      "del sistema", no `/` con el usuario chroot del dominio) y el
      mecanismo (`lftp mirror`) mostró comportamiento poco confiable
      (éxito reportado sin cambios reales, o cuelgues de +10 min). El
      sitio está al día en producción hoy porque se subió el build a
      mano. La próxima vez que se necesite desplegar un cambio, probar
      primero con `workflow_dispatch` y **verificar contra el sitio
      público** (no confiar en el ✓ de Actions) antes de asumir que el
      pipeline automático ya está resuelto. Si vuelve a fallar, el
      camino manual (`npm run build` local + arrastrar `dist/` al File
      Manager específico del sitio) sigue siendo el fallback probado.
- [x] Limpieza de la carpeta correcta (2026-07-20) — se sacaron
      `test-upload.txt`, `.ftp-deploy-sync-state.json`, y archivos de
      repo que habían quedado públicamente expuestos por una subida
      manual que incluyó de más (`package.json`, `package-lock.json`,
      `tsconfig.json`, `astro.config.mjs`, `README.md`, `CLAUDE.md`,
      `.gitignore`). Confirmado por HTTP que `package.json`/`CLAUDE.md`
      ya dan 404 públicamente, y que el sitio sigue en 200 en todas las
      páginas. Quedó solo lo que corresponde: `about/`, `blog/`,
      `contact/`, `es/`, `images/`, `.htaccess`, `favicon*`,
      `index.html`, `rss.xml`.
- [ ] Sin urgencia — en la(s) carpeta(s) `public_html` "equivocada(s)"
      que se identificaron en el camino de la Ronda 2 (ver punto 8 de la
      saga, distintas de la carpeta real de arriba), quedaron `home/`,
      `default.php`, `DO_NOT_UPLOAD_HERE` y favicons/`.htaccess` de
      intentos previos — no las sirve nadie, se pueden dejar así o
      limpiar a mano si el usuario quiere prolijidad total.
- [ ] `public/.htaccess` con los 301 de los 8 posts viejos de WordPress —
      hoy solo tiene `DirectoryIndex`, sin esos redirects todavía.
- [x] Favicon (`public/favicon.svg` + PNGs, monograma "JA") — **en
      producción y confirmado** (2026-07-19), después de la Ronda 2 de
      diagnóstico de deploy. Ver sección de Diseño para el detalle del
      favicon en sí, y la sección de deploy para la saga completa de por
      qué costó tanto que llegara a verse en vivo.
- [x] `/about/` y `/es/sobre-mi/` — reemplazadas (2026-07-18) por el copy
      real que dio el usuario ("What I'm looking for"/"Qué busco": rol
      full-time remoto, Panamá UTC-5, sin visa/reubicación, CTA a
      `/contact/` y a LinkedIn). Ya no son las del borrador con cifras
      pendientes de Sportline/IFRS 9 — ese ángulo (bio larga con casos) se
      descartó a favor de un pitch corto de disponibilidad.
- [ ] Endpoint real del formulario de contacto — hoy `contact.astro`/
      `es/contacto.astro` son un `mailto:` simple, no un formulario.
- [ ] Reemplazar/borrar el post de ejemplo (`draft: true`,
      `src/content/blog/en/template-example.md` +
      `es/ejemplo-plantilla.md`) por el primer post real.
- [x] Vaciar el WordPress viejo de `public_html` — hecho por el usuario
      antes de la migración (ver sección de deploy arriba). El plan
      original de "probar primero en subdominio" quedó obsoleto: el
      usuario terminó migrando el dominio entero a la cuenta multi-dominio
      en vez de redirigir DNS, así que no aplicaba.
- [x] LinkedIn real: `https://www.linkedin.com/in/joseluisalba/` — ya
      linkeado en el footer (todas las páginas) y en About/Acerca de.
- [x] Permisos de archivos/carpetas — corregidos (2026-07-19) a `755`
      (carpetas) / `644` (archivos), recursivo, vía un workflow temporal
      de un solo uso con `ftplib` de Python. **Ojo:** esto se aplicó en
      la carpeta que en ese momento se creía correcta (la del usuario
      chroot del dominio, `FTP_REMOTE_DIR=/`) — la Ronda 2 después
      determinó que esa carpeta probablemente NO es la que sirve el
      sitio realmente (ver punto 8 de la saga). Si hace falta prolijidad
      de permisos, repetirlo contra la carpeta confirmada como correcta
      (`/public_html/` con el usuario del sistema).

## Cómo trabajar en este proyecto
- Repo separado de RanchOS — no reutilizar convenciones/decisiones de ese
  proyecto acá (stacks completamente distintos).
- Sitio 100% estático — no agregar backend/API/base de datos sin que el
  usuario lo pida explícitamente; el diseño actual depende de que Hostinger
  solo sirva archivos.
