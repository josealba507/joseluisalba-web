---
title: "El saldo promedio no se calcula, se captura"
description: "Por qué el saldo promedio diario en banca no se puede recalcular después del cierre — la decisión real fue elegir qué tablas de accrual capturar a diario, sabiendo que el costo es permanente."
pubDate: 2026-07-20
eyebrow: "Decision"
translationKey: "saldo-promedio-accrual"
draft: false
---

El negocio no quería saber solo cuánto tiene un cliente hoy. Quería saber cuánto tiene, en promedio, a lo largo del tiempo.

Parece el mismo dato pero no lo es. Dos clientes pueden cerrar el mes con el mismo saldo y ser clientes completamente distintos: uno lo mantuvo estable los 30 días; el otro tocó ese número una tarde, el día de pago, antes de vaciarlo hasta casi cero. La foto de fin de mes los muestra iguales. El promedio diario los separa. Y esa separación es justo lo que alimenta los modelos de comportamiento y de rentabilidad — el saldo promedio no es un número más, es una variable de entrada de las grandes.

El problema es que ese dato no se puede pedir tarde o recalcular.

El sistema fuente no guarda historia. Te muestra el saldo de hoy. Mañana te muestra el de mañana, y el de ayer ya se sobrescribió. El saldo promedio diario no es algo que reconstruyes en el cierre — o lo capturaste el día que existió, o no existe. El cierre mensual te da doce fotos al año. El promedio diario necesita trescientas sesenta y cinco.

Ahí está el punto de quiebre: la única forma de tener ese dato es guardarlo todos los días, y guardar todos los días cuesta. Si el servidor es físico, hay un tope. Si es en la nube, cada dato innecesario que guardas tiene un costo. De cualquier forma, no es gratis.

Así que la decisión real no fue "hago una foto diaria de todas las tablas". Sino elegir qué tablas justifican su almacenamiento diario. En banca, la respuesta tiene nombre: las tablas de accrual — las que llevan el detalle del saldo, día a día. Esas son las que pagan el costo de almacenar una foto todos los días; el resto se toma una foto al cierre de mes. No es preferencia de diseño, es presupuesto: cada tabla que almaceno a diario es almacenamiento que se multiplica por 365 y que crece para siempre según los registros que tenga la tabla.

Si trabajas con datos en banca, ese es el lugar por donde empiezas: el accrual es donde vive el saldo, y el saldo es el que no se reconstruye.

Lo que costó no fue solo el disco o almacenamiento en la nube en base al escenario. Fue decidir bajo una restricción que no perdona: esto no se puede probar y corregir después. Si dentro de seis meses descubro que necesitaba una foto diaria de otra tabla, ese histórico no existe — no se rellena algo que la fuente ya borró. El costo incluye acertar hoy, con información incompleta, de forma permanente.

Tu sistema fuente guarda el saldo de ayer, ¿o ya lo perdiste?
