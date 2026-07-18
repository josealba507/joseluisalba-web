---
title: "[Ejemplo] Cómo se ve un post en esta plantilla"
description: "Este post existe solo para validar el layout — reemplázalo por contenido real y bórralo cuando ya no haga falta."
pubDate: 2026-07-18
eyebrow: "Decision"
translationKey: "ejemplo-plantilla"
draft: true
---

Este post es de ejemplo, generado para probar visualmente la plantilla de artículo (tipografía, bloque de código, cita destacada, navegación al siguiente post) — no es contenido real. Con `draft: true` no aparece en el índice del blog ni en el RSS; solo es visible navegando directo a esta URL en desarrollo.

## Un subtítulo de ejemplo

Así se ve un párrafo normal de cuerpo, en Source Serif 4, con el ancho de línea acotado a `760px` para que la lectura sea cómoda.

> Una cita destacada se ve así — útil para resaltar una frase clave dentro del argumento del post.

Y así se ve un bloque de código:

```python
stages = (exposures
    .join(delinquency_history, "contract_id")
    .withColumn("stage", stage_rules("sicr_flag", "dpd_bucket")))
```

Reemplazá este archivo por tu primer post real y borralo, o dejalo con `draft: true` como referencia de formato.
