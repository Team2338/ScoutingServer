
CREATE SEQUENCE comments_seq
    START WITH 1 INCREMENT BY 1;

CREATE TABLE comments (
	id           bigint        NOT NULL,
	team_number  integer       NOT NULL,
	robot_number integer       NOT NULL,
	game_year    integer       NOT NULL,
	event_code   varchar(32)   NOT NULL,
	secret_code  varchar(32)   NOT NULL,
	topic        varchar(32)   NOT NULL,
	answer       varchar(1024) NOT NULL,
	creator      varchar(32)   NOT NULL,
	time_created timestamp(0) with time zone NOT NULL,
	CONSTRAINT comments_pkey PRIMARY KEY (id),
	CONSTRAINT chk_comments_min_team_number CHECK (team_number >= 0),
	CONSTRAINT chk_comments_min_robot_number CHECK (robot_number >= 0),
	CONSTRAINT chk_comments_min_game_year CHECK (game_year >= 1995)
);
