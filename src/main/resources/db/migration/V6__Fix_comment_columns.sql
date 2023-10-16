ALTER TABLE comments
	RENAME COLUMN answer to content;

ALTER TABLE comments
	ADD COLUMN match_number integer NOT NULL DEFAULT 0,
	ADD CONSTRAINT chk_comments_min_match_number CHECK (match_number >= 0)
;


