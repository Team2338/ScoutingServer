
ALTER TABLE events
	ADD is_hidden boolean
;

-- Update all rows in the table to have a value of 'false'
-- Apparently this is many times faster than running an UPDATE operation
-- https://stackoverflow.com/questions/70994637/set-postgres-column-to-not-null-with-default-without-update
ALTER TABLE events
	ALTER COLUMN is_hidden TYPE boolean USING (COALESCE(is_hidden, FALSE)),
	ALTER COLUMN is_hidden SET NOT NULL
;
