
ALTER TABLE events
	ADD CONSTRAINT uk__events__descriptor UNIQUE (team_number, game_year, event_code, secret_code)
;
