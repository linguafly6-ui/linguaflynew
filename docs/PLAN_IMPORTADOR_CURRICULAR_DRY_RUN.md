# Diseño del importador curricular relacional (dry-run primero)

**Estado:** diseño técnico; todavía no implementado ni ejecutado contra D1.  
**Fecha:** 2026-11-01  
**Rama:** `feat/cefr-600-relational-curriculum`

## 1. Decisión de seguridad

El importador se desarrollará en dos modos explícitos:

- `dry-run`: lee fuentes, normaliza a un modelo canónico, calcula hashes y genera un informe. No escribe cursos, unidades, secciones, ejercicios, opciones, claves ni media.
- `apply`: solo estará disponible cuando el dry-run esté limpio, el esquema de preview esté preparado, las pruebas pasen y exista aprobación explícita para ejecutar el lote.

La ejecución de un lote debe ser transaccional o tener una estrategia de reanudación idempotente verificada. Nunca debe sobrescribir contenido relacional existente por coincidencia de número de unidad.

## 2. Fuentes y namespaces

Cada origen mantiene su identidad y espacio de claves:

| Fuente | Namespace | Identidad de origen | Destino esperado |
|---|---|---|---|
| JSON A1 del repositorio | `repo:a1-json` | ruta + unidad + ID de actividad | units, sections, exercises, options, answer keys |
| JSON A1 11–60 de D1 | `d1:learning_course_json_units` | course_key + unit_number | units, sections, exercises, options, answer keys, media |
| JSON B1/B2/C1/C2 de D1 | `d1:learning_course_json_units` | course_key + unit_number | units, sections, exercises, options, answer keys, media |
| Blueprints A2/B1 | `d1:unit_content_blueprints` | unit_id + content_version | unit editorial/design metadata and canonical exercise content when supported |
| Bancos A2 TypeScript | `repo:a2-ts` | module path + interaction_id | exercises, options, answer keys |
| Relational D1 | `d1:relational` | existing primary key / exercise_code | source of existing target records; never treated as disposable input |

No se deben colapsar dos namespaces distintos aunque compartan nivel, número o título. El importador genera un conflicto cuando dos fuentes reclaman la misma unidad destino con hashes distintos y no existe una regla de precedencia aprobada.

## 3. Modelo canónico de intercambio

El modelo intermedio se construye antes de tocar D1:

- **Course:** language_code, cefr_level, title, description, sort_order, status.
- **Unit:** source identities, unit_number, title, learning objectives, editorial status.
- **Section:** unit source identity, section_type, position, title, instructions, status.
- **Exercise:** source identity, exercise_type_code, exercise_code, title, instructions, content público, position, points, status.
- **Option:** option_key, content, structured content, position.
- **Answer key privada:** grading_strategy, answer_config, normalization_config, scoring_config, feedback.
- **Media:** source identity, media type, storage metadata, alt text, duration, usage role, position.
- **Provenance:** source system/key/path/hash, import run, target entity, status, conflict details.

La representación pública del ejercicio no admite propiedades `correct_answer`, `answer_config_json`, `correctOptionKeys`, claves equivalentes ni feedback que revele la solución antes del intento. Esos datos solo se serializan en `exercise_answer_keys` y solo se leen en el servidor de corrección.

## 4. Mapeo de secciones

La única secuencia admitida para las 600 unidades es:

1. `grammar`
2. `listening`
3. `vocabulary`
4. `reading`

El importador debe mapear por significado de sección, no por índice de origen. Para los JSON A1, la secuencia heredada es grammar/vocabulary/listening/reading; el importador reordena a la secuencia canónica, sin cambiar el contenido ni los IDs de actividad. La transformación debe quedar registrada en el informe.

Los blueprints A2 y B1 contienen actividades o elementos adicionales (por ejemplo, speaking_task y writing_task en el blueprint A2). No se deben descartar silenciosamente: se conservan en metadatos editoriales/plan de unidad o se registran como conflicto de alcance, sin crear secciones principales adicionales.

## 5. Mapeo de tipos de ejercicio

El registro D1 contiene `single-choice`, `gap-fill`, `cloze`, `reading-comprehension`, `listening-comprehension` y otros tipos. Los formatos fuente como `multiple_choice` y `fill_blank` **no se traducen por nombre solamente**.

Reglas:
- `multiple_choice` se puede mapear a `single-choice` únicamente si la respuesta es una opción única y se conservan claves y distractores sin ambigüedad.
- `fill_blank` requiere inspección de la estructura de estímulo y respuestas aceptadas. No asumir que todos los casos son `gap-fill`; si la respuesta es contextual o hay varios huecos, puede requerir `cloze`.
- Listening/Reading deben conservar el texto o transcripción compartida, las preguntas y la relación entre ambas. La transcripción no se convierte en un archivo de audio.
- Si no existe audio real ni referencia verificable, se marca `review` y no se presenta como audio reproducible.
- Si falta clave verificable, el ejercicio queda `review`; nunca se inventa una respuesta.

## 6. Idempotencia y conflictos

La migración propuesta añade:
- `curriculum_import_runs`: ejecución, snapshot, hash de manifiesto, modo, estado e informe.
- `curriculum_source_records`: identidad de origen, hash, tipo de entidad, ID destino, estado y conflictos.

El índice único `(source_system, source_key, source_hash, entity_type)` permite reconocer una versión de origen ya reconciliada. El importador debe:
1. ordenar los registros determinísticamente;
2. calcular hash criptográfico sobre JSON canonicalizado y codificado UTF-8;
3. detectar source keys repetidas y relaciones sin padre;
4. comparar target existente por identidad y hash;
5. no actualizar un destino si hay contenido distinto sin decisión explícita;
6. registrar diferencias por campo y detener el lote ante conflictos bloqueantes;
7. reanudar sin duplicar registros después de una interrupción;
8. emitir un manifiesto de IDs, conteos, hashes y decisiones.

## 7. Precondiciones del entorno

- `wrangler.jsonc` declara `COURSE_DB`, pero **no declara `migrations_dir` para esa base**. El directorio `migrations/course-db` no está conectado a la configuración actual.
- No se encontró una migración base académica versionada en el repositorio.
- `d1_migrations` existe en producción pero no contiene filas.
- Preview carece de `learning_course_json_units`, `unit_content_blueprints` y otras tablas presentes en producción.

Por ello, `migrations/course-db/0005_curriculum_source_registry.sql` se ha añadido como propuesta aditiva, pero **no se ha aplicado ni debe aplicarse todavía**. Primero hay que reconstruir un historial de esquema fiable y decidir cómo inicializar preview. No añadir aún `migrations_dir` a Wrangler: hacerlo antes de una migración base verificada podría hacer que Wrangler intente aplicar migraciones incompletas o fuera de orden.

La sintaxis de la migración 0005 se comprobó localmente con SQLite en memoria y se ejecutó dos veces; ambas ejecuciones terminaron correctamente. Esto solo valida sintaxis e idempotencia DDL, no compatibilidad con el esquema remoto.

## 8. Criterios de aceptación del primer lote (cinco unidades)

Un lote de prueba no se considera satisfactorio hasta cumplir todo lo siguiente:

- cinco unidades exactamente, con los cuatro tipos de sección en orden y posiciones 1–4;
- IDs de origen y destino trazables;
- mismo número de ejercicios, opciones, claves y medios que el manifiesto validado;
- igualdad de hashes de contenido normalizado donde no se haya aprobado una transformación;
- transformaciones registradas (por ejemplo, reordenación de secciones);
- ninguna clave en contenido público, HTML, RSC, props cliente ni payload de unidad;
- todas las claves válidas en tabla privada y corregidas en servidor;
- cero relaciones huérfanas, códigos duplicados o tipos sin estrategia;
- ningún estado `published` propagado automáticamente;
- segundo `dry-run` sin diferencias;
- pruebas de regresión de loader y API antes de habilitar el nuevo camino.

## 9. Bloqueos actuales

1. Exportar íntegramente las 285 filas JSON y los 110 blueprints y generar hashes reproducibles.
2. Exportar las 50 unidades A1 11–60 que no aparecen en el árbol Git.
3. Comparar los 600 ejercicios JSON A1 con los 360 ejercicios relacionales A1; no son equivalentes por conteo ni por origen.
4. Reconciliar las 32 actividades A2 TypeScript con 29 ejercicios relacionales y 100 blueprints.
5. Preparar un preview con esquema completo y migraciones verificables.
6. Definir una migración base académica reproducible a partir del esquema real, no inventada a partir de las columnas parciales inspeccionadas.

Hasta cerrar estos bloqueos, no se debe ejecutar `apply`, cambiar el loader de producción ni retirar fuentes heredadas.
