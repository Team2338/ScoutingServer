-- TODO add sequence
CREATE SEQUENCE detail_notes_seq
	START WITH 1 INCREMENT BY 1;

CREATE TABLE detail_notes (
	id           bigint      NOT NULL,
	team_number  integer     NOT NULL,
	robot_number integer     NOT NULL,
	game_year    integer     NOT NULL,
	event_code   varchar(32) NOT NULL,
	secret_code  varchar(32) NOT NULL,
	question     varchar(32) NOT NULL,
	answer       varchar(32) NOT NULL,
	creator      varchar(32) NOT NULL,
	time_created varchar(32) NOT NULL,
	CONSTRAINT detail_notes_pkey PRIMARY KEY (id),
	CONSTRAINT chk_detail_notes_min_team_number CHECK (team_number >= 0),
	CONSTRAINT chk_detail_notes_min_robot_number CHECK (robot_number >= 0),
	CONSTRAINT chk_detail_notes_min_game_year CHECK (game_year >= 1995)
-- Will add index(es) later for optimization, if deemed necessary
);
