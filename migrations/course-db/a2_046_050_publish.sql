-- Finalize A2.046-A2.050 after content and audio validation.
-- Attach the three listening tracks per unit using the established audio_key/audio_group convention.
UPDATE exercises
SET content_json = json_set(
      content_json,
      '$.audio_key', 'listening-' || CAST(((position - 1) / 5) + 1 AS TEXT),
      '$.audio_group', 'listening-' || CAST(((position - 1) / 5) + 1 AS TEXT)
    ),
    status='published',
    updated_at=CURRENT_TIMESTAMP
WHERE section_id IN (
  'a2-unit-046-listening','a2-unit-047-listening','a2-unit-048-listening',
  'a2-unit-049-listening','a2-unit-050-listening'
);

UPDATE exercises
SET status='published', updated_at=CURRENT_TIMESTAMP
WHERE section_id IN (
  'a2-unit-046-grammar','a2-unit-046-vocabulary','a2-unit-046-reading',
  'a2-unit-047-grammar','a2-unit-047-vocabulary','a2-unit-047-reading',
  'a2-unit-048-grammar','a2-unit-048-vocabulary','a2-unit-048-reading',
  'a2-unit-049-grammar','a2-unit-049-vocabulary','a2-unit-049-reading',
  'a2-unit-050-grammar','a2-unit-050-vocabulary','a2-unit-050-reading'
);

UPDATE sections SET status='published'
WHERE unit_id IN ('a2-unit-046','a2-unit-047','a2-unit-048','a2-unit-049','a2-unit-050');

UPDATE units SET status='published'
WHERE id IN ('a2-unit-046','a2-unit-047','a2-unit-048','a2-unit-049','a2-unit-050');

-- Verification: expected 60 exercises, 60 answer keys and 180 options per unit.
SELECT u.id,u.status,COUNT(DISTINCT e.id) AS exercises,
       COUNT(DISTINCT k.id) AS answer_keys,COUNT(o.id) AS options,
       SUM(CASE WHEN e.status='published' THEN 1 ELSE 0 END) AS published_exercises,
       SUM(CASE WHEN s.section_type='listening'
                 AND json_extract(e.content_json,'$.audio_key') IS NOT NULL
                THEN 1 ELSE 0 END) AS listening_with_audio_key
FROM units u
JOIN sections s ON s.unit_id=u.id
LEFT JOIN exercises e ON e.section_id=s.id
LEFT JOIN exercise_answer_keys k ON k.exercise_id=e.id
LEFT JOIN exercise_options o ON o.exercise_id=e.id
WHERE u.id IN ('a2-unit-046','a2-unit-047','a2-unit-048','a2-unit-049','a2-unit-050')
GROUP BY u.id ORDER BY u.id;
