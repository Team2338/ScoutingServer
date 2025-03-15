CREATE INDEX IF NOT EXISTS idx__match_obj__match_id
	ON matches_objectives
	USING btree (match_entity_id)
;

-- We never look up a match ID from an obj ID
-- This will improve write performance
ALTER TABLE matches_objectives
	DROP CONSTRAINT uk_ddtkqjem3iy6vku1meenj2tsp
;
