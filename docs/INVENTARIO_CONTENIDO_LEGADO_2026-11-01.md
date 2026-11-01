# Inventario verificable de contenido heredado

**Fecha:** 2026-11-01  
**Repositorio:** `linguafly6-ui/linguaflynew`  
**Rama:** `feat/cefr-600-relational-curriculum`  
**Referencia de código inspeccionada:** `2e37b917e6963f3e7f58ee148d8d5f4b15d4a2ea`  
**D1 producción:** consultas exclusivamente de lectura.

Este inventario registra lo que se pudo verificar directamente. No es una declaración de que el contenido esté validado pedagógicamente ni una autorización para importarlo o publicarlo.

## 1. JSON A1 presentes en el repositorio

Se inspeccionaron los diez ficheros `src/content/cursos/ingles-a1/unit1.json` a `unit10.json`. Todos parsean como JSON y comparten estructura raíz `course`, `learning_outcomes`, `blocks`.

### Resumen comprobado

- 10 unidades.
- 5 objetivos de aprendizaje por unidad.
- 4 bloques por unidad, con 15 actividades exactas por bloque.
- 60 actividades por unidad; 600 actividades en total.
- El orden fuente actual es **grammar, vocabulary, listening, reading**, no el orden requerido **grammar, listening, vocabulary, reading**.
- 598 actividades son `multiple_choice` y 2 son `fill_blank` (las dos actividades fill_blank están en la unidad 1).
- Las 600 actividades contienen `correct_answer` y `explanation` en la fuente.
- Los 150 ejercicios de Listening tienen campo `transcript`; no se encontró campo de audio/referencia de audio en los objetos inspeccionados.
- Los 150 ejercicios de Reading tienen campo `main_text`.
- Los IDs `g01–g15`, `v01–v15`, `l01–l15`, `r01–r15` son únicos dentro de cada fichero inspeccionado.
- La sección Vocabulary sí sigue el sentido inglés → español en los ejemplos comprobados: `question_en` contiene la palabra/expresión inglesa y las opciones y `correct_answer` son traducciones españolas.
- No se ha validado todavía de forma lingüística cada respuesta, distractor, texto o transcripción.

### Inventario de ficheros A1

Los SHA indicados son blob SHA de GitHub (identifican el fichero en el commit inspeccionado; no son un hash recalculado del contenido normalizado).

| Unidad | Título en fuente | Actividades | Bytes | Blob SHA |
|---:|---|---:|---:|---|
| 1 | Hello! Saying hello | 60 | 43.327 | `e35b6e42d8171bed8ccd965595a13e375d48fcb0` |
| 2 | My family and people around me | 60 | 42.809 | `2e4580bf328654b424eebf4584ccd6235ed6d377` |
| 3 | My day and daily routines | 60 | 45.193 | `8ae4d54abe634b54c6b136d87845726afe4d1325` |
| 4 | Food and drink | 60 | 44.033 | `2ad1a612af637d2c70967bd7ccb5d8c1d6039cd7` |
| 5 | My home and my town | 60 | 45.661 | `e16dc3bb3309f243e61f78be602dbb4ac6ab883b` |
| 6 | Clothes and the weather | 60 | 45.854 | `9395297a673a42b399ded3b3c0d30338f4010051` |
| 7 | Free time and hobbies | 60 | 46.123 | `c256aa56c80588b8f52424ce04feccdc58fea248` |
| 8 | Getting around town | 60 | 45.614 | `fb02113cf57759d27e01bf94571d4ec30aa59e19` |
| 9 | Jobs and workplaces | 60 | 45.262 | `7ec305f5cfcf6a5217aba1ddd4467623c06529ad` |
| 10 | Making plans and special days | 60 | 46.340 | `9ba404f17a623d7749f51c2b5ec777c1320bf216` |

### Correspondencia con D1

En `learning_course_json_units`, las filas A1 1–10 tienen el mismo `source_path`, título y tamaño de `content_json` que los ficheros inspeccionados (incluidos tamaños en bytes). Los `content_hash` de D1 para estas filas son etiquetas/versiones editoriales (`a1-unitN-editorial-vN-2026-11-01`), no los blob SHA de GitHub. Esta coincidencia de ruta, título y tamaño es evidencia de correspondencia, pero **no sustituye una comparación byte a byte**.

La misma tabla contiene además unidades A1 11–60 (50 filas) con rutas `src/content/cursos/ingles-a1/unit11.json` … `unit60.json`. Esos 50 ficheros no aparecieron en el árbol Git inspeccionado. Sus registros D1 no deben borrarse ni sobrescribirse; hay que exportar su contenido completo y decidir cómo preservarlo en la nueva estructura.

## 2. Bancos TypeScript A2

Se inspeccionaron los 30 módulos `app/academia/[level]/[unit]/a2-unit-001-exercises.ts` … `a2-unit-030-exercises.ts`.

### Resumen comprobado

- 30 módulos, uno por unidad A2 1–30.
- 32 objetos de actividad detectados por sus campos `interaction_id`.
- Unidades 1 y 2 tienen dos actividades cada una; unidades 3–30 tienen una actividad cada una.
- 30 actividades son `multiple_choice` y 2 son `fill_blank`.
- Los 32 objetos inspeccionados contienen `correct_answer`.
- Estos ficheros contienen claves en código de servidor/build y **no deben continuar importándose desde una página cliente ni incluirse en el bundle del navegador**.
- Este recuento es independiente de los 29 ejercicios relacionales A2 de D1. No asumir que representan los mismos ejercicios ni que son duplicados sin comparar contenido e IDs.

### Inventario de módulos A2

| Unidad | Actividades | Tipos detectados | Blob SHA |
|---:|---:|---|---|
| 1 | 2 | multiple_choice, fill_blank | `4736f2cdf3dd2fc80002d7ea03c425023e35a273` |
| 2 | 2 | multiple_choice, fill_blank | `d25e95aa1a6fdfc99a12c04484889b023eafec1c` |
| 3 | 1 | multiple_choice | `f3a388f3e5cf096686806ae8634328a06b691ba2` |
| 4 | 1 | multiple_choice | `8e1683ed3dee2618b012eb40a7eb8ecafc530d98` |
| 5 | 1 | multiple_choice | `77cdeee82034b79ebbd3f3411100128d8f9e9a33` |
| 6 | 1 | multiple_choice | `168f837087a31eff9b72def3a899b8add50b9704` |
| 7 | 1 | multiple_choice | `4d199289b24230ce01b145af0ced5a45f18f3d09` |
| 8 | 1 | multiple_choice | `c49b4ad26671425277aed2031fa03b0bb80664c6` |
| 9 | 1 | multiple_choice | `38775ab7ac998a768794a0e2d60f89786ebdd0ef` |
| 10 | 1 | multiple_choice | `48542fa36d96ccf0f1f74cea1efc5cc9c826c608` |
| 11 | 1 | multiple_choice | `300dcf441a2faa0d2ee8d370216f0d5c132b224f` |
| 12 | 1 | multiple_choice | `3e73989d5665d8502721499b07300453902acd24` |
| 13 | 1 | multiple_choice | `7cda5da272f673864d8b766a5e5106eca87cec92` |
| 14 | 1 | multiple_choice | `e3cad24d855658c0705ac98f5c90c569e8f0867c` |
| 15 | 1 | multiple_choice | `3089bca1f549c83df4f098465a4970243d777986` |
| 16 | 1 | multiple_choice | `81cc8e7d7a2e84c6e3a1e09c68358e26624f89b9` |
| 17 | 1 | multiple_choice | `ffeb5c63decff69cd3699965212fc7e5b4a2b27` |
| 18 | 1 | multiple_choice | `0eb472459e77e78e7bd428129c99c9662bc10548` |
| 19 | 1 | multiple_choice | `1e50603bc40f73119a8894922ce6cf2ce29a52c5` |
| 20 | 1 | multiple_choice | `3de9d1862daf2d2b685e062f754dc6b36b642351` |
| 21 | 1 | multiple_choice | `65c7592f8a12dd22146803ad92e63a97612836dc` |
| 22 | 1 | multiple_choice | `cf63d129166bc10cf31cde7d64ec7ea5779fdd14` |
| 23 | 1 | multiple_choice | `7f4ad8d7fd4c8917f4d7b75a73e4428bfdfb72d2` |
| 24 | 1 | multiple_choice | `76d5d748d11c6004ae052ae10539dc7b0af79182` |
| 25 | 1 | multiple_choice | `6eb1feb127364f4450a1528cbacefbec086c319c` |
| 26 | 1 | multiple_choice | `7ea790b47d37cdf66d6f5ac46f304ec0d805a290` |
| 27 | 1 | multiple_choice | `8db3b4a2fd5ad6df8502204385a0806ca50a2cb3` |
| 28 | 1 | multiple_choice | `8d819dc243663e409f83174938b01402b2c9fa9e` |
| 29 | 1 | multiple_choice | `c2ddc706ba578a30edaae7d3d92ef5c071c120f1` |
| 30 | 1 | multiple_choice | `f24380af5d66658ff7f79ba13bf629adafb4fb4d` |

## 3. Distribución de contenido legado en D1

### `learning_course_json_units`

| Nivel / clave | Filas | Unidades distintas | Observación |
|---|---:|---:|---|
| A1 | 60 | 60 | Unidades 1–60; 11–60 no están en el árbol Git inspeccionado |
| A1-NARRATIVE | 10 | 10 | Colección narrativa separada |
| B1 | 100 | 100 | Unidades 1–100 |
| B2 | 100 | 100 | Unidades 1–100 |
| C1 | 10 | 10 | Solo 1–10 |
| C2 | 5 | 5 | Solo 1–5 |

Total: 285 filas. Los tamaños de contenido van desde 483 hasta 76.110 bytes según nivel. No se ha descargado ni comparado byte a byte el contenido de las 285 filas en esta fase.

### `unit_content_blueprints`

| Nivel relacional asociado | Filas | Tamaño JSON |
|---|---:|---|
| A2 | 100 | 3.584–17.408 bytes |
| B1 | 10 | 16.475–17.452 bytes |

Total: 110 blueprints. Se han verificado conteos y tamaños, no el contenido completo de cada blueprint.

## 4. Cobertura relacional de ejercicios por unidad

Las 406 unidades relacionales tienen cuatro secciones, pero muchas no tienen ejercicios:

| Nivel | 0 ejercicios | 1–4 | 5–14 | 15–29 | 30+ |
|---|---:|---:|---:|---:|---:|
| A1 | 0 | 0 | 0 | 0 | 6 |
| A2 | 96 | 3 | 0 | 1 | 0 |
| B1 | 46 | 0 | 36 | 16 | 2 |
| B2 | 99 | 0 | 0 | 1 | 0 |
| C1 | 99 | 0 | 0 | 1 | 0 |

En A2, los ejercicios relacionales están concentrados en las unidades 1 (20 ejercicios), 17 (3), 25 (3) y 29 (3). En B2 y C1 solo la unidad 1 tiene ejercicios (15). En B1, 46 unidades están vacías de ejercicios; la unidad 1 y 31 tienen 60 cada una. Estos datos demuestran que crear 400 secciones por nivel no equivale a tener 100 unidades didácticamente completas.

## 5. Implicaciones para la migración

1. La importación debe tener un registro de origen con `source_system`, `source_key`, `source_path`, `source_hash`, `target_id`, `imported_at` y estado de reconciliación.
2. Debe soportar múltiples orígenes por unidad (por ejemplo, curso relacional + blueprint + módulo TS) sin sobrescribir automáticamente uno con otro.
3. Para A1 1–10, reconciliar JSON Git y D1 por contenido, no solo por tamaño. Mantener el historial de ambas fuentes.
4. Para A1 11–60, exportar primero las 50 filas D1 y conservar todos sus textos, actividades, claves, feedback y media.
5. Para A2 1–30, reconciliar 32 actividades TS con 29 ejercicios D1 y 100 blueprints. No suponer equivalencia a partir del número de unidad.
6. Para B1/B2/C1/C2, exportar el JSON completo y comparar con cualquier estructura relacional existente antes de mapear.
7. El importador debe ser idempotente y detenerse ante IDs duplicados, referencias rotas, tipos sin estrategia, claves faltantes o diferencias de contenido no resueltas.
8. No importar claves a `content_json` ni a tablas públicas. Las respuestas correctas deben escribirse solo en `exercise_answer_keys`.
9. El estado por defecto de contenido importado o generado será `draft` o `review`, nunca `published` por defecto.
10. No eliminar los ficheros TS/JSON ni las tablas legacy hasta completar reconciliación, pruebas de regresión y aprobación explícita.

## 6. Próxima fase

- Exportar en lotes acotados el contenido de `learning_course_json_units` y `unit_content_blueprints`, generando hashes criptográficos reproducibles fuera de D1.
- Auditar la estructura interna de los 30 bancos A2 y sus relaciones con ejercicios relacionales.
- Construir un formato canónico de intercambio y un importador en modo `dry-run`.
- Preparar un preview completo mediante migraciones versionadas; el preview actual carece de varias tablas de producción.
- Solo después ejecutar el piloto de cinco unidades en preview y reconciliar cada campo.
