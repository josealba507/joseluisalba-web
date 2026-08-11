---
title: "La tasa de cambio no es solo una dimensión, es parte del hecho"
description: "Convertir moneda al consultar da el número correcto y aun así es la arquitectura equivocada."
pubDate: 2026-08-10
eyebrow: "Decision"
translationKey: "rate-belongs-to-the-fact"
draft: false
---

Cinco países, una migración a SAP, y un requerimiento que en la reunión sonó simple: cada venta tenía que quedar registrada en su moneda local y también en dólares.

La primera mitad no se discute. Una venta en Colombia se hace en pesos y así se registra. La segunda tampoco: las oficinas centrales están en Panamá, y para comparar cinco países hay que hablar un idioma común. Ese idioma es el dólar.

Había una tercera condición, y es la que no se sostiene con lo que uno haría por defecto: los reportes tenían que ser comparables en el tiempo. Cuánto vendió Colombia el año pasado contra cuánto vendió este año, cada período con su tasa.

Si la venta se guarda solo en moneda local y se convierte con la tasa de hoy al momento de la consulta, el pasado deja de ser fijo. Las ventas del año pasado valen una cosa si corres el reporte hoy y otra distinta si lo corres en tres meses. Nadie tocó una venta y el número cambió igual.

Eso es evidente y se resuelve fácil: la tasa se busca por la fecha de la transacción, no por la de hoy. Casi cualquier motor lo hace. Una vista en SQL Server con el join contra la tabla de monedas por período te devuelve el número correcto sin almacenar nada.

Y ahí es donde la decisión se pone interesante, porque esa vista funciona. El número está bien.

Las dos opciones son válidas. El dólar puede vivir como columna en la tabla final, o puede resolverse en la consulta contra la tabla de monedas. Lo que decide no es cuál es más elegante, es quién va a escribir esa consulta.

Un analista que domina el modelo hace el join bien y no necesita que se lo dejen servido. Uno que recién entra abre la tabla, ve la columna que dice dólares y sigue. Los dos llegan al número. Solo uno de los dos puede llegar a un número distinto.

Porque el que cruce por fecha de registro en vez de fecha de transacción, o el que arrastre la tasa del mes anterior cuando falta una, produce un número plausible y equivocado. No revienta nada. Nadie lo nota.

El punto de quiebre fue entender que la tasa de cambio es las dos cosas, y que tratarla como una sola era el error.

Como dimensión existe y hay que modelarla: tiene moneda, tiene período de vigencia y tiene un dueño que responde por ella. Eso no está en discusión.

Lo que no puede quedarse del lado de la dimensión es el valor convertido. Ese es una medida, y las medidas van en el hecho. Dejar el dólar calculado en la tabla no es facilitarle la vida a nadie: es sacar la definición de un dato monetario de manos de quien escribe la consulta y ponerla en el modelo, donde tiene un solo dueño.

La decisión fue resolverlo en la capa que construye, no en la que consulta. La capa cruda guarda la venta en su moneda local y nada más: no convierte, no opina. La tabla de monedas entra por ahí mismo: el negocio carga las tasas en el sistema fuente y la capa cruda la copia igual que copia cualquier otra tabla, sin tocarla y sin completar lo que falta.

Al construir la tabla final —el cubo, como se llamaba en ese momento— esa copia es el insumo de las columnas calculadas. La tasa del período de la transacción se aplica una vez y queda materializada: venta en dólares, costo en dólares, utilidad en dólares. Todo lo monetario que el negocio va a mirar sale de ahí.

El reporte de marzo de hace dos años usa la tasa de marzo de hace dos años, y no porque quien consulta se haya acordado de hacer bien el join. Ya viene calculado.

Lo que costó fue mantener la tabla de monedas viva y correcta.

Todo el modelo se apoya en ella. Si una tasa falta o entra mal, la tabla se construye igual y el error se propaga en silencio a todos los reportes de ese período. No revienta nada. Los números simplemente quedan mal, y nadie se entera hasta que alguien compara contra algo impreso.

Por eso la tasa la carga el negocio y no el pipeline. No es delegar trabajo: es poner el dato bajo el dueño que puede responder por él.

¿El dólar en tus reportes lo define el modelo, o lo define quien escribe la consulta?
