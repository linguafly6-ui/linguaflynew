# Auditoría técnica de Linguafly — migración curricular relacional

**Fecha de verificación:** 2026-11-01  
**Repositorio:** `linguafly6-ui/linguaflynew`  
**Rama:** `feat/cefr-600-relational-curriculum`  
**HEAD auditado:** `2e37b917e6963f3e7f58ee148d8d5f4b15d4a2ea`  
**Alcance:** lectura de GitHub y consultas SQL de solo lectura a D1 producción y preview. No se modificó ninguna base de datos.

## 1. Resultado ejecutivo

La aplicación todavía **no utiliza D1 relacional como única fuente académica**. El loader combina tres caminos distintos y la API de intentos obtiene respuestas desde más de una fuente, incluida una importación de ejercicios TypeScript y contenido JSON. La rama de trabajo sigue sin cambios de aplicación desde el commit que añadió el prompt maestro.

La producción conserva el snapshot de 5 cursos y 406 unidades. No existe curso relacional C2. Preview no es una copia vacía equivalente a producción: además de no contener cursos/unidades, carece de tablas de contenido legado y de otras tablas operativas presentes en producción. No debe utilizarse como destino de importación hasta preparar y verificar un esquema de preview completo.

## 2. Estado observado en D1 producción

Consultas de solo lectura ejecutadas contra `linguafly-learning`:

| Métrica | Conteo |
|---|---:|
| Cursos | 5 |
| Unidades | 406 |
| Secciones | 1.624 |
| Ejercicios | 1.053 |
| Opciones | 3.746 |
| Claves de respuesta | 1.039 |
| Filas `learning_course_json_units` | 285 |
| Filas `unit_content_blueprints` | 110 |

### Cursos y unidades por nivel

| Nivel | Estado del curso | Unidades | Estado de unidades |
|---|---|---:|---|
| A1 | draft | 6 | 6 draft |
| A2 | draft | 100 | 100 draft |
| B1 | published | 100 | 50 published, 50 draft |
| B2 | draft | 100 | 100 draft |
| C1 | draft | 100 | 100 draft |
| C2 | No existe curso relacional | 0 | — |

El total relacional actual es 406, no 600. Las 600 unidades son el objetivo curricular, no el estado implementado.

### Distribución de secciones relacionales

- A1: 6 unidades con cuatro secciones en orden **grammar, vocabulary, listening, reading** (posiciones 1–4). Este orden no coincide con el requisito confirmado del propietario.
- A2, B1, B2 y C1: 100 unidades por nivel, con cuatro secciones en el orden requerido **grammar, listening, vocabulary, reading**.
- No se encontró curso C2.

### Fuentes JSON de contenido en D1

| Tabla | Nivel / clave | Filas |
|---|---|---:|
| learning_course_json_units | A1 / ingles-a1 | 60 |
| learning_course_json_units | A1-NARRATIVE / ingles-a1-narrative | 10 |
| learning_course_json_units | B1 / ingles-b1 | 100 |
| learning_course_json_units | B2 / ingles-b2 | 100 |
| learning_course_json_units | C1 / ingles-c1 | 10 |
| learning_course_json_units | C2 / ingles-c2 | 5 |
| unit_content_blueprints | A2 | 100 |
| unit_content_blueprints | B1 | 10 |

Las filas C2 y parte de A1/C1 en `learning_course_json_units` no equivalen a cursos relacionales ni demuestran que existan 100 unidades válidas. Deben inventariarse por contenido, hash, número, estado y relaciones antes de migrar.

### Claves ausentes

Hay 14 ejercicios sin registro en `exercise_answer_keys`:

| Tipo | Ejercicios sin clave |
|---|---:|
| short-answer | 4 |
| gap-fill | 4 |
| flashcard-recall | 4 |
| matching-pairs | 1 |
| cloze | 1 |

Todos los 1.009 `single-choice`, 15 `reading-comprehension` y 15 `listening-comprehension` observados sí tienen clave. No crear claves para los 14 restantes por inferencia. Inspeccionar el contenido fuente y derivar solo cuando exista evidencia explícita; en caso contrario, mantener el ejercicio en draft/review.

## 3. Estado observado en D1 preview

La base `linguafly-learning-preview` tiene tablas académicas básicas (`courses`, `units`, `sections`, `exercises`, `exercise_options`, `exercise_answer_keys`, `exercise_type_registry`, `learning_media`, etc.), pero las consultas devolvieron cero cursos/unidades/secciones/ejercicios.

Además, el esquema preview consultado **no contiene** `learning_course_json_units`, `unit_content_blueprints`, `d1_migrations` ni varias tablas que sí existen en producción. Por tanto:
- Preview no es un clon de producción.
- No ejecutar todavía el importador curricular allí.
- Primero hay que decidir y documentar cómo se reconstruye el esquema completo de preview, con migraciones versionadas y sin copiar datos personales/operativos de producción.

## 4. Dependencias de código confirmadas

### `lib/academy.ts`

Actualmente mezcla fuentes:
- Niveles A1: consulta `courses`, `units`, `sections`, `exercises` y `exercise_options`, pero solo para unidades 1–6; en esta rama el loader construye bloques con una estructura que no conserva aún el orden requerido por el propietario.
- A2: obtiene unidades y contenido desde `unit_content_blueprints`.
- B1/B2/C1/C2: obtiene unidades y contenido desde `learning_course_json_units`.
- El resumen de niveles también depende de `learning_course_json_units` y del blueprint A2.

### Página de unidad

`app/academia/[level]/[unit]/page.tsx` importa los 30 bancos TypeScript A2 (`a2-unit-001-exercises.ts` … `a2-unit-030-exercises.ts`). No retirar estos bancos hasta migrar, reconciliar y probar sus actividades.

### API de intentos

`app/api/academia/[level]/[unit]/attempt/route.ts`:
- Importa directamente `a2Unit2Exercises`.
- Para A1 lee opciones y `answer_config_json` desde D1.
- Para A2 unidad 2 busca claves en el banco TS y en arrays del blueprint.
- Para otras unidades consulta `json_each` sobre `learning_course_json_units`.
- Tiene un fallback que recorre el contenido devuelto por `getAcademyUnit` buscando `correct_answer`.

Este endpoint debe reemplazarse por una única ruta de corrección basada en `exercise_id` + `exercise_answer_keys` en servidor, con estrategia de corrección específica por tipo. No debe usar `correct_answer` del contenido público ni importar bancos desde la página.

### Contrato cliente

`activity-content.tsx` ya define `ClientActivity = Omit<Activity, "correct_answer">`. Mantener esta separación y comprobar también que las claves no se filtran en HTML, RSC, payloads, logs o respuestas de API.

## 5. Archivos heredados localizados

- 10 JSON A1: `src/content/cursos/ingles-a1/unit1.json` … `unit10.json`.
- 30 módulos TypeScript de ejercicios A2: `app/academia/[level]/[unit]/a2-unit-001-exercises.ts` … `a2-unit-030-exercises.ts`.
- `docs/editorial/a1-100-unit-editorial-plan.md`: existe un plan editorial A1 de 100 unidades, con una propuesta de 15 ejercicios por sección (60 por unidad). Ese documento usa el orden grammar, vocabulary, listening, reading y por tanto **no debe prevalecer** sobre el orden confirmado por el propietario: grammar, listening, vocabulary, reading. Revisar y corregir el plan en una fase separada, preservando su cobertura temática útil.
- Migraciones SQL localizadas: `0001_student_accounts.sql`, `0002_error_review.sql`, `0002_stripe_billing.sql`, `0003_ai_exercise_drafts.sql`, `0004_support_tickets.sql`. No se encontró una migración versionada en el repo que cree el esquema académico base.
- La tabla `d1_migrations` existe en producción, pero no contiene registros según la consulta realizada. No asumir que el historial de migraciones refleja el esquema real.

## 6. Modelo relacional disponible y observaciones

Las tablas actuales ya separan:
- Curso y unidad: `courses`, `units`.
- Secciones: `sections` con `section_type` y `position`.
- Ejercicios: `exercises` con `exercise_type_id`, `content_json`, `position`, `status`.
- Opciones: `exercise_options`.
- Corrección privada: `exercise_answer_keys` con `grading_strategy`, `answer_config_json`, `normalization_config_json`, `scoring_config_json` y feedback.
- Tipos: `exercise_type_registry`.
- Medios: `learning_media`, `exercise_media`.
- Diseño editorial: `unit_editorial_plans`, `unit_learning_design`.
- Competencias: `competencies`, `unit_competencies`.

Las columnas JSON dentro de estas tablas relacionales son atributos estructurados del modelo y no deben borrarse por la petición de retirar archivos/tablas JSON de origen. `content_json` de un ejercicio puede conservar estímulos y estructura de actividad; la clave de corrección permanece separada en `exercise_answer_keys`.

## 7. Discrepancias y riesgos que bloquean una migración directa

1. **Orden de A1 incorrecto:** seis unidades están ordenadas grammar/vocabulary/listening/reading, mientras que el requisito es grammar/listening/vocabulary/reading.
2. **Fuentes mixtas en runtime:** loader y API aún dependen de dos tablas de contenido JSON y bancos TS.
3. **A2 fragmentado:** existen 100 blueprints, pero solo 29 ejercicios relacionales en 100 unidades A2; el contenido visible también depende de 30 módulos TS.
4. **Unidades relacionales escasas en ejercicios:** B2 y C1 tienen 15 ejercicios cada uno para 100 unidades (un ejercicio por sección en promedio); no interpretar 100 unidades + 400 secciones como 100 unidades completas.
5. **Ausencia de C2 relacional:** cinco filas JSON de C2 no son un curso relacional de 100 unidades.
6. **Claves ausentes:** 14 actividades no tienen answer key relacional.
7. **Preview incompleto:** faltan tablas legacy y migraciones de esquema; necesita preparación antes de pruebas de importación.
8. **Historial de migraciones insuficiente:** `d1_migrations` está vacío en producción y no se encontró esquema académico base versionado en el repo.
9. **Estados:** B1 está marcado como curso published y contiene 50 unidades published; no cambiar ni despublicar datos sin evaluación y autorización específica.
10. **Plan editorial A1 antiguo:** propone otro orden de secciones; debe alinearse con el contrato curricular vigente.

## 8. Puertas de salida para la siguiente fase

Antes de escribir datos:
1. Exportar/leer el contenido de los 10 JSON A1, 30 bancos TS A2, 285 filas `learning_course_json_units` y 110 blueprints; calcular hashes estables y mapa de IDs.
2. Auditar por unidad títulos, objetivos, secciones, ejercicios, opciones, claves, feedback, transcripciones y media.
3. Identificar duplicados entre JSON, blueprints y tablas relacionales sin decidir automáticamente qué fuente gana.
4. Diseñar importador idempotente con tabla de trazabilidad de origen y reportes de conflictos.
5. Definir migraciones de esquema reproducibles para preview y producción; probar exclusivamente en preview una vez preparado.
6. Crear pruebas para cuatro secciones y su orden, preservación de datos, integridad de relaciones, claves privadas y corrección por estrategia.
7. Migrar un lote piloto pequeño y reconciliar antes de ampliar.

## 9. Acciones realizadas y no realizadas

**Realizado**
- Verificada la referencia de la rama y el HEAD.
- Leídos loader, API de intentos, página de unidad, contrato de actividad, configuración Wrangler, package y documentación editorial.
- Consultadas las tablas, conteos, estados, tipos de ejercicio, claves ausentes y estructura de tablas en D1 producción y preview.
- Todas las consultas a D1 descritas aquí fueron de solo lectura.

**No realizado**
- No se ha escrito ni modificado D1 producción o preview.
- No se ha creado ni aplicado ninguna migración SQL.
- No se ha modificado código de runtime ni se han eliminado archivos.
- No se han ejecutado build, lint, typecheck ni tests.
- No se ha creado PR, hecho merge ni desplegado.

**Siguiente tarea técnica:** preparar un inventario verificable de contenido legado (incluidos hashes y relaciones) y después diseñar el importador de prueba para un lote de cinco unidades en una preview con esquema completo.
