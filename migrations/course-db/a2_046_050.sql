-- A2.046-A2.050 import from unit blueprints. Draft until editorial/audio QA.
WITH unit_blueprints AS (
 SELECT b.unit_id,b.content_json,
        'a2-u'||substr(b.unit_id,-3) AS prefix
 FROM unit_content_blueprints b
 WHERE b.unit_id IN ('a2-unit-046','a2-unit-047','a2-unit-048','a2-unit-049','a2-unit-050')
),
items AS (
 SELECT u.unit_id,u.prefix,'grammar' AS kind,CAST(j.key AS INTEGER)+1 AS pos,j.value AS q,
        NULL AS stimulus,NULL AS stimulus_type
 FROM unit_blueprints u,json_each(u.content_json,'$.grammar_exercises') j
 UNION ALL
 SELECT u.unit_id,u.prefix,'vocabulary',CAST(j.key AS INTEGER)+1,j.value,NULL,NULL
 FROM unit_blueprints u,json_each(u.content_json,'$.vocabulary_exercises') j
 UNION ALL
 SELECT u.unit_id,u.prefix,'reading',CAST(j.key AS INTEGER)+1,j.value,
        json_extract(u.content_json,'$.reading.passages['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'reading'
 FROM unit_blueprints u,json_each(u.content_json,'$.reading.questions') j
 UNION ALL
 SELECT u.unit_id,u.prefix,'listening',CAST(j.key AS INTEGER)+1,j.value,
        json_extract(u.content_json,'$.listening.dialogues['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'listening'
 FROM unit_blueprints u,json_each(u.content_json,'$.listening.questions') j
)
INSERT INTO exercises
(id,section_id,exercise_type_id,template_version_id,exercise_code,creation_mode,title,instructions,content_json,position,points,status)
SELECT i.prefix||'-'||i.kind||'-'||printf('%02d',i.pos),
       i.unit_id||'-'||i.kind,
       'single-choice',NULL,
       i.prefix||'-'||i.kind||'-'||printf('%02d',i.pos),
       'manual',
       (SELECT title FROM units WHERE id=i.unit_id),
       'Choose the correct answer.',
       json_object('prompt',json_extract(i.q,'$[0]'),
                   'explanation',json_extract(i.q,'$[4]'),
                   'stimulus',i.stimulus,
                   'stimulus_type',i.stimulus_type),
       i.pos,1,'draft'
FROM items i
WHERE json_extract(i.q,'$[0]') IS NOT NULL
ON CONFLICT(section_id,exercise_code) DO NOTHING;

WITH unit_blueprints AS (
 SELECT b.unit_id,'a2-u'||substr(b.unit_id,-3) AS prefix,b.content_json
 FROM unit_content_blueprints b
 WHERE b.unit_id IN ('a2-unit-046','a2-unit-047','a2-unit-048','a2-unit-049','a2-unit-050')
),
items AS (
 SELECT u.unit_id,u.prefix,'grammar' kind,CAST(j.key AS INTEGER)+1 pos,j.value q FROM unit_blueprints u,json_each(u.content_json,'$.grammar_exercises') j
 UNION ALL
 SELECT u.unit_id,u.prefix,'vocabulary',CAST(j.key AS INTEGER)+1,j.value FROM unit_blueprints u,json_each(u.content_json,'$.vocabulary_exercises') j
 UNION ALL
 SELECT u.unit_id,u.prefix,'reading',CAST(j.key AS INTEGER)+1,j.value FROM unit_blueprints u,json_each(u.content_json,'$.reading.questions') j
 UNION ALL
 SELECT u.unit_id,u.prefix,'listening',CAST(j.key AS INTEGER)+1,j.value FROM unit_blueprints u,json_each(u.content_json,'$.listening.questions') j
)
INSERT INTO exercise_options (id,exercise_id,option_key,content,content_json,position)
SELECT e.id||'-opt-'||CAST(CAST(o.key AS INTEGER) AS TEXT),e.id,
       CASE CAST(o.key AS INTEGER) WHEN 1 THEN 'A' WHEN 2 THEN 'B' ELSE 'C' END,
       o.value,json_object('text',o.value),CAST(o.key AS INTEGER)
FROM items i
JOIN exercises e ON e.id=i.prefix||'-'||i.kind||'-'||printf('%02d',i.pos)
JOIN json_each(i.q) o
WHERE CAST(o.key AS INTEGER) BETWEEN 1 AND 3 AND o.value IS NOT NULL
ON CONFLICT(exercise_id,option_key) DO NOTHING;

INSERT INTO exercise_answer_keys
(id,exercise_id,grading_strategy,answer_config_json,normalization_config_json,scoring_config_json,correct_feedback,incorrect_feedback)
SELECT id||'-answer',id,'single-choice','{"correctOptionKeys":["A"]}','{}','{}',
       'Correct.','Try again and review the explanation.'
FROM exercises
WHERE exercise_code GLOB 'a2-u046-*'
   OR exercise_code GLOB 'a2-u047-*'
   OR exercise_code GLOB 'a2-u048-*'
   OR exercise_code GLOB 'a2-u049-*'
   OR exercise_code GLOB 'a2-u050-*'
ON CONFLICT(exercise_id) DO NOTHING;

SELECT s.unit_id,COUNT(DISTINCT e.id) AS exercises,COUNT(o.id) AS options
FROM sections s
LEFT JOIN exercises e ON e.section_id=s.id
LEFT JOIN exercise_options o ON o.exercise_id=e.id
WHERE s.unit_id IN ('a2-unit-046','a2-unit-047','a2-unit-048','a2-unit-049','a2-unit-050')
GROUP BY s.unit_id ORDER BY s.unit_id;
