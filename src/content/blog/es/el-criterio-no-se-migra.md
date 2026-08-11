---
title: "El modelo se migra, el criterio no"
description: "La misma tabla que era correcta en tierra se vuelve cara en nube, y no porque el modelo haya cambiado."
pubDate: 2026-08-10
eyebrow: "Decision"
translationKey: "reasoning-does-not-migrate"
draft: false
---

En "El saldo promedio no se calcula, se captura" la decisión fue guardar solo el cambio, no la quietud. Fue correcta. Pero fue correcta en tierra. Esa misma tabla, montada en nube, se diseña distinto — y no porque el modelo de datos haya cambiado, sino porque cambió la forma en que se factura el data warehouse.

En tierra ya pagaste por la infraestructura. Ese costo es fijo: lo compraste una vez y ahí está, uses lo que uses. La limitante es el espacio en disco — se llena, y cuando se llena hay que comprar más. El procesamiento no se llena, se pelea: se compite por ventana, se corre de madrugada, se reordena. Ante una limitante que no cede y una que sí, se impone la que no cede sobre la que se puede negociar. Comprimir no fue elegante, fue obligado.

En nube el costo es variable y se cobra por uso en las dos partes del proceso: la construcción de la tabla y el consumo de lo construido. Nada está pagado de antemano. Y las dos partes no pesan igual, ya que el margen libre que te da cada servicio — sea de lectura o procesamiento — es distinto. Reconstruir el saldo vigente cada vez que alguien consulta se cobra cada vez. Cuarenta consultas contra la misma tabla son cuarenta reconstrucciones y cuarenta cobros por la misma respuesta.

Por eso no puedes migrar el modelo tal cual. La estructura viaja; el criterio no.

La variable que decide no es si está en tierra o en la nube. Es cuántas veces se consulta ese dato. Si esa tabla se consulta una vez al mes, comprimes y reconstruyes: el recálculo sale barato porque casi nunca ocurre. Si la consultan cuarenta dashboards y procesos todos los días, ese mismo recálculo deja de ser una estrategia de ahorro y pasa a ser un gasto. La tabla no cambió. Cambió la frecuencia en la que se consulta.

Y como las estructuras de costo son distintas, las estrategias de optimización también lo son. En tierra la infraestructura es la limitante y el trabajo es aprovecharla al máximo. En nube optimizas para gastar menos: no hay limitante física, hay una estructura de precios — y la estrategia sale de leer esa estructura, la del proveedor que estés usando, ya que cada proveedor y cada servicio dentro de ese proveedor tiene una estructura de precios distinta. No existe una optimización para "la nube" en general.

La decisión, entonces: una sola corrida diaria que reconstruye, agrupa y deja el saldo neto del día ya resuelto. Esa tabla responde las cuarenta consultas. Nadie vuelve a recalcular para consultar lo mismo.

Lo que costó fue la actualidad del dato. La respuesta es la foto de la última corrida, y eso hay que decirlo en voz alta. Cuando alguien pregunta a las dos de la tarde por el saldo de esa misma tarde, no lo tengo.

Pero acá está lo que aprendí: la actualidad del dato no la decide tu arquitectura ni tu presupuesto. La decide la fuente. Puedes querer dos extracciones diarias y no poder tenerlas, porque el core solo te deja copiar después del cierre. Mientras el día corre hay saldos bloqueados, tablas intermedias en vuelo, movimientos que todavía no aterrizaron. Lo que leerías a media tarde no es un saldo confiable — es un saldo a medio construir. Ahí T-1 no es una concesión por costo. Es lo único que produce un número defendible.

Y eso obliga a una conversación con el negocio que es más incómoda que cualquier decisión técnica: explicar por qué no vas a entregar un número que se ve más actualizado pero no es confiable.

La salida no es forzar el reporte. Es reconocer que cada sistema tiene un trabajo. Si quieres saber el saldo de un cliente ahora, entra a la herramienta que lo maneja: ahí está, en pantalla, en tiempo real. El data warehouse no está para eso. El data warehouse responde el histórico, lo comparable, lo que ya cerró.

Cuando alguien te pide el dato de hoy en el reporte de ayer, ¿le explicas por qué no está ahí, o se lo calculas igual?
