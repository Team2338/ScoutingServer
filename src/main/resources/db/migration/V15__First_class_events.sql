-- Create first-class "event" entity
-- 1. Create events table
-- 2. Populate events table with existing event info from other entities
-- 3. Point existing entities to inserted event IDs
-- 4. Add indexes for event_id in entities

-------------------------
-- Create events table --
-------------------------
CREATE SEQUENCE IF NOT EXISTS events_seq
	START WITH 1
	INCREMENT BY 1
;
CREATE TABLE IF NOT EXISTS events (
	eid			bigint		NOT NULL, -- Non-standard name helps with inner join further on
	team_number	integer		NOT NULL,
	game_year	integer		NOT NULL,
	event_code	varchar(32)	NOT NULL,
	secret_code	varchar(32)	NOT NULL,
	CONSTRAINT events_pkey PRIMARY KEY (eid),
	CONSTRAINT chk_events_min_team_number CHECK (team_number >= 0),
	CONSTRAINT chk_events_min_game_year CHECK (game_year >= 1995)
);
CREATE INDEX IF NOT EXISTS idx__events__info
	ON events
	USING btree (team_number, game_year, event_code, secret_code)
;


------------------------------------------------------------------
-- Populate events table with event info from existing entities --
------------------------------------------------------------------
INSERT INTO events (eid, team_number, game_year, event_code, secret_code)
	SELECT nextval('events_seq'), team_number, game_year, event_code, secret_code FROM (
		SELECT team_number, game_year, event_code, secret_code FROM matches
		UNION DISTINCT
		SELECT team_number, game_year, event_code, secret_code FROM comments
		UNION DISTINCT
		SELECT team_number, game_year, event_code, secret_code FROM image_info
		UNION DISTINCT
		SELECT team_number, game_year, event_code, secret_code FROM detail_notes
	) combined_event_descriptors
;


----------------------------------------------
-- Add event_id column to each entity table --
----------------------------------------------
ALTER TABLE matches			ADD COLUMN event_id bigint;
ALTER TABLE comments		ADD COLUMN event_id bigint;
ALTER TABLE image_info		ADD COLUMN event_id bigint;
ALTER TABLE detail_notes	ADD COLUMN event_id bigint;


----------------------------------------------------------
-- Update event_id column for each row in entity tables --
----------------------------------------------------------
MERGE INTO matches M
	USING (
		SELECT eid, team_number, game_year, event_code, secret_code
			FROM events
	) E
	ON M.team_number = E.team_number
		AND M.game_year = E.game_year
		AND M.event_code = E.event_code
		AND M.secret_code = E.secret_code
	WHEN MATCHED THEN
		UPDATE
			SET event_id = E.eid
;

MERGE INTO comments M
	USING (
		SELECT eid, team_number, game_year, event_code, secret_code
		FROM events
	) E
	ON M.team_number = E.team_number
		AND M.game_year = E.game_year
		AND M.event_code = E.event_code
		AND M.secret_code = E.secret_code
	WHEN MATCHED THEN
		UPDATE
			SET event_id = E.eid
;

MERGE INTO image_info M
	USING (
		SELECT eid, team_number, game_year, event_code, secret_code
		FROM events
	) E
	ON M.team_number = E.team_number
		AND M.game_year = E.game_year
		AND M.event_code = E.event_code
		AND M.secret_code = E.secret_code
	WHEN MATCHED THEN
		UPDATE
			SET event_id = E.eid
;

MERGE INTO detail_notes M
	USING (
		SELECT eid, team_number, game_year, event_code, secret_code
		FROM events
	) E
	ON M.team_number = E.team_number
		AND M.game_year = E.game_year
		AND M.event_code = E.event_code
		AND M.secret_code = E.secret_code
	WHEN MATCHED THEN
		UPDATE
			SET event_id = E.eid
;


---------------------------------------------------
-- Rename event.eid column to event.id,          --
--     now that the inner join ambiguity is done --
---------------------------------------------------
ALTER TABLE events
	RENAME COLUMN eid to id
;


------------------------------------------------------------------
-- Add foreign key constraint on event_id for each entity table --
------------------------------------------------------------------
ALTER TABLE matches
	DROP COLUMN event_code,
	DROP COLUMN secret_code,
	ALTER COLUMN event_id SET NOT NULL,
	ADD CONSTRAINT fk__matches__event_id FOREIGN KEY (event_id)
		REFERENCES events (id)
		ON DELETE CASCADE
;

ALTER TABLE comments
	DROP COLUMN event_code,
	DROP COLUMN secret_code,
	ALTER COLUMN event_id SET NOT NULL,
	ADD CONSTRAINT fk__comments__event_id FOREIGN KEY (event_id)
		REFERENCES events (id)
		ON DELETE CASCADE
;

ALTER TABLE image_info
	DROP COLUMN event_code,
	DROP COLUMN secret_code,
	ALTER COLUMN event_id SET NOT NULL,
	ADD CONSTRAINT fk__image_info__event_id FOREIGN KEY (event_id)
		REFERENCES events (id)
		ON DELETE CASCADE
;

ALTER TABLE detail_notes
	DROP COLUMN event_code,
	DROP COLUMN secret_code,
	ALTER COLUMN event_id SET NOT NULL,
	ADD CONSTRAINT fk__inspections__event_id FOREIGN KEY (event_id)
		REFERENCES events (id)
		ON DELETE CASCADE
;


--------------------
-- Create indexes --
--------------------
CREATE INDEX IF NOT EXISTS idx__matches__event_id
	ON matches
	USING btree (event_id)
;

CREATE INDEX IF NOT EXISTS idx__comments__event_id
	ON comments
	USING btree (event_id)
;

CREATE INDEX IF NOT EXISTS idx__image_info__event_id
	ON image_info
	USING btree (event_id)
;

CREATE INDEX IF NOT EXISTS idx__inspections__event_id
	ON detail_notes
	USING btree (event_id)
;
