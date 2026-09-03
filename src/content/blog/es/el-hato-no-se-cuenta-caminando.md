---
title: "El hato no se cuenta caminando, se cuenta quieto"
description: "Un test de reconciliación reportaba diferencias que no eran errores del dato — medía la distancia entre cuándo se copió y cuándo se preguntó."
pubDate: 2026-09-02
eyebrow: "Decision"
translationKey: "herd-settles-before-counting"
draft: false
---

El data warehouse de RanchOS empieza con una copia. Una réplica diaria del sistema operacional hacia BigQuery, y encima de esa réplica un test que hace una sola pregunta: ¿se copió todo? Cuenta las filas de las 26 tablas fuente y las compara, una por una, contra el origen. Cuadra exacto o no cuadra.

Ese test reportó tres diferencias.

Ninguna era real. Las tres desaparecían solas en la corrida siguiente, sin que nadie tocara nada. Eso ya te dice que el problema no estaba en el dato — un dato mal copiado no se arregla porque vuelvas a consultarlo.

Lo que pasaba era más simple de lo que pensaba. La réplica corría según su propio horario, tres veces al día. El dbt build se lanzaba manualmente. Entre una cosa y la otra podían pasar horas, y en esas horas alguien seguía capturando en la app. Si un registro entraba después de la última sync y antes de la corrida, la réplica quedaba atrás y el test reportaba la diferencia debido a que en ese instante había filas en el origen que no estaban en la copia.

El punto de quiebre fue entender qué estaba midiendo ese test. No medía un defecto del dato. Medía la distancia entre dos momentos: cuándo se copiaron los datos y cuándo los consulté.

La primera decisión fue técnica y es la obvia una vez que lo ves así. El Workflow que dispara la sync ahora espera a que termine — pregunta por el estado hasta que cierra — y recién entonces lanza el job de dbt. La ventana pasó de horas a los segundos que hay entre que la copia cierra y la próxima escritura de datos. Y si la copia falla o no termina dentro del tope de espera, el Workflow no corre dbt: falla y se detiene ahí. No tiene sentido correr tests contra una réplica que ya sabes desactualizada o que falló. Eso produce ruido.

Con eso los falsos positivos se acabaron. Sin escrituras nuevas en el momento exacto de la sync, no hay diferencia que reportar.

La segunda decisión no fue técnica, y es la que más me interesa.

Seguía corriendo tres veces al día: ocho de la mañana, una de la tarde, ocho de la noche. Ese horario no salió de ningún lado. Lo puse cuando armé el pipeline, antes de saber cómo se mueve realmente la operación, y "tres veces al día" sonaba a diligencia.

Sincronizar tres veces mientras la jornada sigue corriendo no te da tres fotos mejores. Te da tres fotos de un hato que todavía se está moviendo. El conteo no falla porque el dato esté mal; falla porque la jornada aún no termina y muchas cosas todavía pueden cambiar — un animal que salió con un lote que no le correspondía y que recién se corrige más tarde, entre otras.

Y hay algo más de fondo: nadie necesita esa foto del mediodía. Las decisiones operativas de una finca se toman en la mañana, sobre lo que se va a hacer ese día. Una foto tomada cuando el hato ya está quieto sirve exactamente igual, y no discute con nadie.

Así que pasó a correr una vez al día, a las diez de la noche. Está escrito en el header del Workflow, para que dentro de un año nadie lo lea como una arbitrariedad: corre de noche a propósito, porque con la captura del día terminada el test de reconciliación deja de competir contra escrituras en curso.

El dato no estaba mal. El momento sí.

Lo que costó tiene dos partes, y la segunda es la incómoda.

La primera es frescura, y es un intercambio aceptado a conciencia. Pasé de tres fotos al día a una. Si mañana alguien necesita decidir a las dos de la tarde con datos capturados a mediodía, este horario no lo sirve. El día que aparezca esa necesidad, se revisa. Hoy no existe, y programar para una necesidad que no existe es lo que me trajo acá en primer lugar.

La segunda es lo que la ventana nocturna no arregla. El timestamp de cada registro lo asigna el reloj del dispositivo, no el servidor — no hay una sola llamada a `serverTimestamp()` en la app. Un dato capturado en un potrero sin señal llega a BigQuery cuando el teléfono recupera conexión, no cuando yo programé la sync.

El horario sí está pensado según el ritmo de la finca — corre cuando la jornada operativa ya cerró. Lo que no cubre son las particularidades del trabajo en el campo, donde la señal es intermitente por disponibilidad de servicio. Un dato capturado un día puede no reportarse hasta horas o incluso días después, cuando el teléfono finalmente recupera conexión. Esto no es exclusivo de una finca — pasa igual en retail, donde una venta capturada sin conexión se carga según su fecha de posteo, no según el momento real en que ocurrió. La fecha de negocio y la fecha de sistema no siempre coinciden, y ningún horario de sincronización cierra esa diferencia.

Cuando programaste la frecuencia de tu pipeline, ¿la sacaste del ritmo del negocio, o de lo que te pareció razonable ese día?
