---
title: "La copia no opina"
description: "Por qué guardar solo los cambios de saldo no alcanza para el cierre mensual — la solución no es una tabla que hace las dos cosas, son dos capas con trabajos distintos: la que copia y la que responde."
pubDate: 2026-08-03
eyebrow: "Governance"
translationKey: "copia-no-opina-accrual"
draft: false
---

Era necesario optimizar el almacenamiento de los datos y la forma más obvia para guardar saldos diarios sin sobrepasar la capacidad de almacenamiento no era solo guardar el saldo todos los días — sino más bien guardar solo cuando este cambia. De igual manera, el hecho de no almacenar información de cuentas inactivas.

Cómo lo hice: primero capto solo las cuentas activas, las inactivas las ignoro; segundo, comparo el último saldo que tengo contra la fuente; si son iguales, lo ignoro, si no, lo inserto. De esta manera solo almaceno los cambios, no la quietud.

El problema es que a nivel de reporte y análisis de negocios se necesita: el saldo a cierre de cada mes. Todos los meses, tenga o no tenga movimiento la cuenta.

Son dos cosas que aparentemente se pelean, debido a que si una cuenta no se movió en todo febrero, guardando solo cambios no tengo ni una sola fila en febrero. Para el promedio diario da igual — el saldo de enero sigue vigente y es el que se usa para el saldo promedio. Pero para el reporte de "saldo a cierre de mes", febrero queda vacío: todas esas cuentas que no tuvieron movimiento no aparecen, aunque la cuenta existe y tiene plata.

La tentación está en tratar de resolverlo en una sola capa o tabla. O guardo el saldo de todas las cuentas todos los fines de mes aunque no cambien en mi tabla copia de la fuente — y vuelvo a inflar lo que estaba tratando de comprimir. O me quedo solo con los cambios y le digo al negocio que se aguante los huecos. Las dos son malas opciones, y las dos nacen del mismo error: creer que esto lo resuelve una sola tabla.

No lo resuelve una tabla. Lo resuelven dos capas con dos trabajos distintos y por ende 2 tablas distintas.

La tabla de accrual es una copia de la fuente. Su único trabajo es almacenar el cambio. Guarda el delta y nada más: si el saldo no se movió, no escribe. No sabe de cierres de mes, no le importa el reporte, no rellena nada. Es una tabla cruda y mínima a propósito. Su métrica de éxito es no haber guardado una sola fila que la fuente no tenía.

La tabla final es otra cosa. Su trabajo no es almacenar, es responder la pregunta del negocio. Y ahí — solo ahí — es donde vive el cierre de mes. Cuando se genera la tabla final, ese proceso reconstruye lo que la capa de abajo comprimió: arrastra el último saldo vigente, y en cada fin de mes fuerza un registro de cierre, tenga o no tenga cambio la cuenta. El hueco de febrero se llena acá, en la capa que responde, no en la que copia.

Lo que costó no fue el código. Fue disciplina: entender que hay que aguantarse las ganas de resolver el problema del reporte una capa antes de donde corresponde. Meter el cierre de mes en el accrual es tentador — está ahí, es fácil. Pero el día que lo hacés, esa tabla deja de ser una copia de la fuente y pasa a ser una copia con opiniones. Le agregaste filas que el origen nunca tuvo. Y el día que necesites auditarla contra la fuente, no cuadra — porque ya no es un espejo, es una interpretación. La copia no opina. Para eso está la tabla final.

Cuando una cuenta tuya no se mueve en todo el mes, ¿tu reporte de cierre lo sabe, o ese mes simplemente no existe?
