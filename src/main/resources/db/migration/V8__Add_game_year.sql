ALTER TABLE matches
    ADD COLUMN game_year integer NOT NULL DEFAULT 2023,
    ADD CONSTRAINT chk_matches_min_game_year CHECK (game_year >= 1995)
;