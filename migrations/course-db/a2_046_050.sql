-- A2.046-A2.050 import from unit blueprints. Draft until editorial/audio QA.
WITH items AS (
 SELECT 'a2-unit-046' unit_id,'a2-u046' prefix,'grammar' kind,CAST(j.key AS INTEGER)+1 pos,j.value q,NULL stimulus,NULL stimulus_type FROM unit_content_blueprints b,json_each(b.content_json,'$.grammar_exercises') j WHERE b.unit_id='a2-unit-046'
 UNION ALL
 SELECT 'a2-unit-046','a2-u046','vocabulary',CAST(j.key AS INTEGER)+1,j.value,NULL,NULL FROM unit_content_blueprints b,json_each(b.content_json,'$.vocabulary_exercises') j WHERE b.unit_id='a2-unit-046'
 UNION ALL
 SELECT 'a2-unit-046','a2-u046','reading',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.reading.passages['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'reading' FROM unit_content_blueprints b,json_each(b.content_json,'$.reading.questions') j WHERE b.unit_id='a2-unit-046'
 UNION ALL
 SELECT 'a2-unit-046','a2-u046','listening',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.listening.dialogues['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'listening' FROM unit_content_blueprints b,json_each(b.content_json,'$.listening.questions') j WHERE b.unit_id='a2-unit-046'
UNION ALL

 SELECT 'a2-unit-047' unit_id,'a2-u047' prefix,'grammar' kind,CAST(j.key AS INTEGER)+1 pos,j.value q,NULL stimulus,NULL stimulus_type FROM unit_content_blueprints b,json_each(b.content_json,'$.grammar_exercises') j WHERE b.unit_id='a2-unit-047'
 UNION ALL
 SELECT 'a2-unit-047','a2-u047','vocabulary',CAST(j.key AS INTEGER)+1,j.value,NULL,NULL FROM unit_content_blueprints b,json_each(b.content_json,'$.vocabulary_exercises') j WHERE b.unit_id='a2-unit-047'
 UNION ALL
 SELECT 'a2-unit-047','a2-u047','reading',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.reading.passages['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'reading' FROM unit_content_blueprints b,json_each(b.content_json,'$.reading.questions') j WHERE b.unit_id='a2-unit-047'
 UNION ALL
 SELECT 'a2-unit-047','a2-u047','listening',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.listening.dialogues['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'listening' FROM unit_content_blueprints b,json_each(b.content_json,'$.listening.questions') j WHERE b.unit_id='a2-unit-047'
UNION ALL

 SELECT 'a2-unit-048' unit_id,'a2-u048' prefix,'grammar' kind,CAST(j.key AS INTEGER)+1 pos,j.value q,NULL stimulus,NULL stimulus_type FROM unit_content_blueprints b,json_each(b.content_json,'$.grammar_exercises') j WHERE b.unit_id='a2-unit-048'
 UNION ALL
 SELECT 'a2-unit-048','a2-u048','vocabulary',CAST(j.key AS INTEGER)+1,j.value,NULL,NULL FROM unit_content_blueprints b,json_each(b.content_json,'$.vocabulary_exercises') j WHERE b.unit_id='a2-unit-048'
 UNION ALL
 SELECT 'a2-unit-048','a2-u048','reading',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.reading.passages['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'reading' FROM unit_content_blueprints b,json_each(b.content_json,'$.reading.questions') j WHERE b.unit_id='a2-unit-048'
 UNION ALL
 SELECT 'a2-unit-048','a2-u048','listening',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.listening.dialogues['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'listening' FROM unit_content_blueprints b,json_each(b.content_json,'$.listening.questions') j WHERE b.unit_id='a2-unit-048'
UNION ALL

 SELECT 'a2-unit-049' unit_id,'a2-u049' prefix,'grammar' kind,CAST(j.key AS INTEGER)+1 pos,j.value q,NULL stimulus,NULL stimulus_type FROM unit_content_blueprints b,json_each(b.content_json,'$.grammar_exercises') j WHERE b.unit_id='a2-unit-049'
 UNION ALL
 SELECT 'a2-unit-049','a2-u049','vocabulary',CAST(j.key AS INTEGER)+1,j.value,NULL,NULL FROM unit_content_blueprints b,json_each(b.content_json,'$.vocabulary_exercises') j WHERE b.unit_id='a2-unit-049'
 UNION ALL
 SELECT 'a2-unit-049','a2-u049','reading',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.reading.passages['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'reading' FROM unit_content_blueprints b,json_each(b.content_json,'$.reading.questions') j WHERE b.unit_id='a2-unit-049'
 UNION ALL
 SELECT 'a2-unit-049','a2-u049','listening',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.listening.dialogues['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'listening' FROM unit_content_blueprints b,json_each(b.content_json,'$.listening.questions') j WHERE b.unit_id='a2-unit-049'
UNION ALL

 SELECT 'a2-unit-050' unit_id,'a2-u050' prefix,'grammar' kind,CAST(j.key AS INTEGER)+1 pos,j.value q,NULL stimulus,NULL stimulus_type FROM unit_content_blueprints b,json_each(b.content_json,'$.grammar_exercises') j WHERE b.unit_id='a2-unit-050'
 UNION ALL
 SELECT 'a2-unit-050','a2-u050','vocabulary',CAST(j.key AS INTEGER)+1,j.value,NULL,NULL FROM unit_content_blueprints b,json_each(b.content_json,'$.vocabulary_exercises') j WHERE b.unit_id='a2-unit-050'
 UNION ALL
 SELECT 'a2-unit-050','a2-u050','reading',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.reading.passages['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'reading' FROM unit_content_blueprints b,json_each(b.content_json,'$.reading.questions') j WHERE b.unit_id='a2-unit-050'
 UNION ALL
 SELECT 'a2-unit-050','a2-u050','listening',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.listening.dialogues['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'listening' FROM unit_content_blueprints b,json_each(b.content_json,'$.listening.questions') j WHERE b.unit_id='a2-unit-050')
INSERT INTO exercises (id,section_id,exercise_type_id,template_version_id,exercise_code,creation_mode,title,instructions,content_json,position,points,status)
SELECT prefix||'-'||kind||'-'||printf('%02d',pos),unit_id||'-'||kind,'single-choice',NULL,prefix||'-'||kind||'-'||printf('%02d',pos),'manual',(SELECT title FROM units WHERE id=unit_id),'Choose the correct answer.',json_object('prompt',json_extract(q,'$[0]'),'explanation',json_extract(q,'$[4]'),'stimulus',stimulus,'stimulus_type',stimulus_type),pos,1,'draft'
FROM items WHERE json_extract(q,'$[0]') IS NOT NULL
ON CONFLICT(section_id,exercise_code) DO NOTHING;

WITH items AS (
 SELECT 'a2-unit-046' unit_id,'a2-u046' prefix,'grammar' kind,CAST(j.key AS INTEGER)+1 pos,j.value q,NULL stimulus,NULL stimulus_type FROM unit_content_blueprints b,json_each(b.content_json,'$.grammar_exercises') j WHERE b.unit_id='a2-unit-046'
 UNION ALL
 SELECT 'a2-unit-046','a2-u046','vocabulary',CAST(j.key AS INTEGER)+1,j.value,NULL,NULL FROM unit_content_blueprints b,json_each(b.content_json,'$.vocabulary_exercises') j WHERE b.unit_id='a2-unit-046'
 UNION ALL
 SELECT 'a2-unit-046','a2-u046','reading',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.reading.passages['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'reading' FROM unit_content_blueprints b,json_each(b.content_json,'$.reading.questions') j WHERE b.unit_id='a2-unit-046'
 UNION ALL
 SELECT 'a2-unit-046','a2-u046','listening',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.listening.dialogues['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'listening' FROM unit_content_blueprints b,json_each(b.content_json,'$.listening.questions') j WHERE b.unit_id='a2-unit-046'
UNION ALL

 SELECT 'a2-unit-047' unit_id,'a2-u047' prefix,'grammar' kind,CAST(j.key AS INTEGER)+1 pos,j.value q,NULL stimulus,NULL stimulus_type FROM unit_content_blueprints b,json_each(b.content_json,'$.grammar_exercises') j WHERE b.unit_id='a2-unit-047'
 UNION ALL
 SELECT 'a2-unit-047','a2-u047','vocabulary',CAST(j.key AS INTEGER)+1,j.value,NULL,NULL FROM unit_content_blueprints b,json_each(b.content_json,'$.vocabulary_exercises') j WHERE b.unit_id='a2-unit-047'
 UNION ALL
 SELECT 'a2-unit-047','a2-u047','reading',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.reading.passages['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'reading' FROM unit_content_blueprints b,json_each(b.content_json,'$.reading.questions') j WHERE b.unit_id='a2-unit-047'
 UNION ALL
 SELECT 'a2-unit-047','a2-u047','listening',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.listening.dialogues['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'listening' FROM unit_content_blueprints b,json_each(b.content_json,'$.listening.questions') j WHERE b.unit_id='a2-unit-047'
UNION ALL

 SELECT 'a2-unit-048' unit_id,'a2-u048' prefix,'grammar' kind,CAST(j.key AS INTEGER)+1 pos,j.value q,NULL stimulus,NULL stimulus_type FROM unit_content_blueprints b,json_each(b.content_json,'$.grammar_exercises') j WHERE b.unit_id='a2-unit-048'
 UNION ALL
 SELECT 'a2-unit-048','a2-u048','vocabulary',CAST(j.key AS INTEGER)+1,j.value,NULL,NULL FROM unit_content_blueprints b,json_each(b.content_json,'$.vocabulary_exercises') j WHERE b.unit_id='a2-unit-048'
 UNION ALL
 SELECT 'a2-unit-048','a2-u048','reading',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.reading.passages['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'reading' FROM unit_content_blueprints b,json_each(b.content_json,'$.reading.questions') j WHERE b.unit_id='a2-unit-048'
 UNION ALL
 SELECT 'a2-unit-048','a2-u048','listening',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.listening.dialogues['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'listening' FROM unit_content_blueprints b,json_each(b.content_json,'$.listening.questions') j WHERE b.unit_id='a2-unit-048'
UNION ALL

 SELECT 'a2-unit-049' unit_id,'a2-u049' prefix,'grammar' kind,CAST(j.key AS INTEGER)+1 pos,j.value q,NULL stimulus,NULL stimulus_type FROM unit_content_blueprints b,json_each(b.content_json,'$.grammar_exercises') j WHERE b.unit_id='a2-unit-049'
 UNION ALL
 SELECT 'a2-unit-049','a2-u049','vocabulary',CAST(j.key AS INTEGER)+1,j.value,NULL,NULL FROM unit_content_blueprints b,json_each(b.content_json,'$.vocabulary_exercises') j WHERE b.unit_id='a2-unit-049'
 UNION ALL
 SELECT 'a2-unit-049','a2-u049','reading',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.reading.passages['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'reading' FROM unit_content_blueprints b,json_each(b.content_json,'$.reading.questions') j WHERE b.unit_id='a2-unit-049'
 UNION ALL
 SELECT 'a2-unit-049','a2-u049','listening',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.listening.dialogues['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'listening' FROM unit_content_blueprints b,json_each(b.content_json,'$.listening.questions') j WHERE b.unit_id='a2-unit-049'
UNION ALL

 SELECT 'a2-unit-050' unit_id,'a2-u050' prefix,'grammar' kind,CAST(j.key AS INTEGER)+1 pos,j.value q,NULL stimulus,NULL stimulus_type FROM unit_content_blueprints b,json_each(b.content_json,'$.grammar_exercises') j WHERE b.unit_id='a2-unit-050'
 UNION ALL
 SELECT 'a2-unit-050','a2-u050','vocabulary',CAST(j.key AS INTEGER)+1,j.value,NULL,NULL FROM unit_content_blueprints b,json_each(b.content_json,'$.vocabulary_exercises') j WHERE b.unit_id='a2-unit-050'
 UNION ALL
 SELECT 'a2-unit-050','a2-u050','reading',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.reading.passages['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'reading' FROM unit_content_blueprints b,json_each(b.content_json,'$.reading.questions') j WHERE b.unit_id='a2-unit-050'
 UNION ALL
 SELECT 'a2-unit-050','a2-u050','listening',CAST(j.key AS INTEGER)+1,j.value,json_extract(b.content_json,'$.listening.dialogues['||CAST(CAST(j.key AS INTEGER)/5 AS TEXT)||']'),'listening' FROM unit_content_blueprints b,json_each(b.content_json,'$.listening.questions') j WHERE b.unit_id='a2-unit-050')
INSERT INTO exercise_options (id,exercise_id,option_key,content,content_json,position)
SELECT e.id||'-opt-'||CAST(CAST(o.key AS INTEGER) AS TEXT),e.id,CASE CAST(o.key AS INTEGER) WHEN 1 THEN 'A' WHEN 2 THEN 'B' ELSE 'C' END,o.value,json_object('text',o.value),CAST(o.key AS INTEGER)
FROM items i JOIN exercises e ON e.id=i.prefix||'-'||i.kind||'-'||printf('%02d',i.pos),json_each(i.q) o
WHERE CAST(o.key AS INTEGER) BETWEEN 1 AND 3 AND o.value IS NOT NULL
ON CONFLICT(exercise_id,option_key) DO NOTHING;

INSERT INTO exercise_answer_keys (id,exercise_id,grading_strategy,answer_config_json,normalization_config_json,scoring_config_json,correct_feedback,incorrect_feedback)
SELECT id||'-answer',id,'single-choice','{"correctOptionKeys":["A"]}','{}','{}','Correct.','Try again and review the explanation.'
FROM exercises WHERE exercise_code GLOB 'a2-u046-*' OR exercise_code GLOB 'a2-u047-*' OR exercise_code GLOB 'a2-u048-*' OR exercise_code GLOB 'a2-u049-*' OR exercise_code GLOB 'a2-u050-*'
ON CONFLICT(exercise_id) DO NOTHING;

SELECT s.unit_id,COUNT(DISTINCT e.id) exercises,COUNT(o.id) options FROM sections s LEFT JOIN exercises e ON e.section_id=s.id LEFT JOIN exercise_options o ON o.exercise_id=e.id WHERE s.unit_id IN ('a2-unit-046','a2-unit-047','a2-unit-048','a2-unit-049','a2-unit-050') GROUP BY s.unit_id ORDER BY s.unit_id;