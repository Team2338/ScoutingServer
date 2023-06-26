-- Add 'not null' constraints
ALTER TABLE objectives
	ALTER COLUMN gamemode SET NOT NULL
;

ALTER TABLE auth
	ALTER COLUMN team_number SET NOT NULL,
	ALTER COLUMN username SET NOT NULL,
	ALTER COLUMN role SET NOT NULL
;

-- Rename foreign key constrains and add 'on delete cascade'
ALTER TABLE objectives
	DROP CONSTRAINT fks7n5wcdhacw6xxyx891lakarx,
	ADD CONSTRAINT fk__objective__match_id
		FOREIGN KEY (match_id)
			REFERENCES matches (id)
			ON DELETE CASCADE
;

ALTER TABLE matches_objectives
	DROP CONSTRAINT fk9n2mrcv2y92na4w5c27dbcs9b,
	ADD CONSTRAINT fk__matches_objectives__objective_id
		FOREIGN KEY (objectives_id)
			REFERENCES objectives (id)
			ON DELETE CASCADE
;

ALTER TABLE matches_objectives
	DROP CONSTRAINT fka23xigof94x7ooodyxpahof40,
	ADD CONSTRAINT fk__matches_objectives__match_id
		FOREIGN KEY (match_entity_id)
			REFERENCES matches (id)
			ON DELETE CASCADE
;

-- Restrict length of columns that didn't get set up properly
ALTER TABLE matches
	ALTER COLUMN secret_code TYPE varchar(32),
	ALTER COLUMN time_created TYPE varchar(32)
;

ALTER TABLE objectives
	ALTER COLUMN gamemode TYPE varchar(32),
	ALTER COLUMN objective TYPE varchar(64)
;

ALTER TABLE notes
	ALTER COLUMN secret_code TYPE varchar(32),
	ALTER COLUMN time_created TYPE varchar(32)
;

ALTER TABLE auth
	ALTER COLUMN username TYPE varchar(32),
	ALTER COLUMN role TYPE varchar(32)
;

ALTER TABLE image_info
	ALTER COLUMN secret_code TYPE varchar(32),
	ALTER COLUMN creator TYPE varchar(32),
	ALTER COLUMN time_created TYPE varchar(32)
;

ALTER TABLE image_content
	ALTER COLUMN secret_code TYPE varchar(32)
;
