-- This file is not actually processed by Flyway
-- I just put it here to show what the baseline currently is
-- If I need to add a new baseline schema to Flyway,
-- I can just copy this one to the `migrations` folder

CREATE SEQUENCE IF NOT EXISTS hibernate_sequence
	START WITH 1
	INCREMENT BY 1
;


CREATE SEQUENCE IF NOT EXISTS matches_seq
	START WITH 1
	INCREMENT BY 1
;
CREATE TABLE IF NOT EXISTS matches (
	id             bigint      NOT NULL,
	team_number    integer     NOT NULL,
    game_year      integer     NOT NULL,
	event_code     varchar(32) NOT NULL,
	secret_code    varchar(32) NOT NULL,
	creator        varchar(32) NOT NULL,
	match_number   integer     NOT NULL,
	robot_number   integer     NOT NULL,
	alliance_color varchar(32),
	time_created   varchar(32) NOT NULL,
	is_hidden      boolean     NOT NULL,
	CONSTRAINT matches_pkey PRIMARY KEY (id),
    CONSTRAINT chk_matches_min_game_year CHECK (game_year >= 1995)
);


CREATE SEQUENCE IF NOT EXISTS objectives_seq
	START WITH 1
	INCREMENT BY 1
;
CREATE TABLE IF NOT EXISTS objectives (
	id        bigint      NOT NULL,
	match_id  bigint,               -- TODO: want it to be non-null, but every row is null
	gamemode  varchar(32) NOT NULL,
	objective varchar(64) NOT NULL, -- TODO: decrease size?
	count     integer     NOT NULL,
	list      integer[],
	CONSTRAINT objectives_pkey PRIMARY KEY (id),
	CONSTRAINT fk__objective__match_id
		FOREIGN KEY (match_id)
			REFERENCES matches (id)
			ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS matches_objectives (
	match_entity_id bigint NOT NULL,
	objectives_id   bigint NOT NULL,
	CONSTRAINT fk__matches_objectives__objective_id
		FOREIGN KEY (objectives_id)
			REFERENCES objectives (id)
			ON DELETE CASCADE,
	CONSTRAINT fk__matches_objectives__match_id
		FOREIGN KEY (match_entity_id)
			REFERENCES matches (id)
			ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx__match_obj__match_id
	ON matches_objectives
	USING btree (match_entity_id)
;


CREATE SEQUENCE IF NOT EXISTS image_info_seq
	START WITH 1
	INCREMENT BY 1
;
CREATE TABLE IF NOT EXISTS image_info (
	id           bigint      NOT NULL,
	team_number  integer     NOT NULL,
	game_year    integer     NOT NULL,
	event_code   varchar(32) NOT NULL,
	secret_code  varchar(32) NOT NULL,
	robot_number integer     NOT NULL,
	creator      varchar(32) NOT NULL,
	time_created varchar(32) NOT NULL,
	image_id     uuid        NOT NULL,
	CONSTRAINT image_info_pkey PRIMARY KEY (id)
	-- TODO: Add foreign key constraint image_id -> image_content.id?
);


CREATE TABLE IF NOT EXISTS image_content (
	id           uuid        NOT NULL DEFAULT gen_random_uuid(),
	content_type varchar(32) NOT NULL,
	content      bytea       NOT NULL,
	CONSTRAINT image_content_pkey PRIMARY KEY (id)
);


-- TODO: Increase increment size to make mass inserts more efficient
-- TODO: Add `unique` constraint on (tn, rn, gy, ec, sc, question)?
-- TODO: Separate into two tables: forms, questions
CREATE SEQUENCE detail_notes_seq
	START WITH 1
	INCREMENT BY 1
;
CREATE TABLE detail_notes (
	id           bigint        NOT NULL,
	team_number  integer       NOT NULL,
	robot_number integer       NOT NULL,
	game_year    integer       NOT NULL,
	event_code   varchar(32)   NOT NULL,
	secret_code  varchar(32)   NOT NULL,
	question     varchar(32)   NOT NULL,
	answer       varchar(1024) NOT NULL,
	creator      varchar(32)   NOT NULL,
	time_created varchar(32)   NOT NULL,
	CONSTRAINT detail_notes_pkey PRIMARY KEY (id),
	CONSTRAINT chk_detail_notes_min_team_number CHECK (team_number >= 0),
	CONSTRAINT chk_detail_notes_min_robot_number CHECK (robot_number >= 0),
	CONSTRAINT chk_detail_notes_min_game_year CHECK (game_year >= 1995)
-- Will add index(es) later for optimization, if deemed necessary
);


CREATE SEQUENCE comments_seq
	START WITH 1
	INCREMENT BY 1
;
CREATE TABLE comments (
	id           bigint        NOT NULL,
	team_number  integer       NOT NULL,
	robot_number integer       NOT NULL,
	game_year    integer       NOT NULL,
	event_code   varchar(32)   NOT NULL,
	secret_code  varchar(32)   NOT NULL,
	match_number integer       NOT NULL,
	topic        varchar(32)   NOT NULL,
	content      varchar(1024) NOT NULL,
	creator      varchar(32)   NOT NULL,
	time_created timestamp(0) with time zone NOT NULL,
	CONSTRAINT comments_pkey PRIMARY KEY (id),
	CONSTRAINT chk_comments_min_team_number CHECK (team_number >= 0),
	CONSTRAINT chk_comments_min_robot_number CHECK (robot_number >= 0),
	CONSTRAINT chk_comments_min_game_year CHECK (game_year >= 1995),
	CONSTRAINT chk_comments_min_match_number CHECK (match_number >= 0)
);


CREATE SEQUENCE users_seq
	START WITH 1
	INCREMENT BY 5
;
CREATE TABLE users (
	user_id     bigint       NOT NULL,
	email       varchar(254) NOT NULL,
	team_number integer      NOT NULL,
	username    varchar(32)  NOT NULL,
	role        varchar(32)  NOT NULL,
	UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (user_id),
	CONSTRAINT chk_users_min_team_number CHECK (team_number >= 0)
);


CREATE TABLE credentials (
	user_id		bigint			NOT NULL,
	password	varchar(256)	NOT NULL,
	UNIQUE (user_id),
	CONSTRAINT fk__credentials__user_id FOREIGN KEY (user_id)
		REFERENCES users (user_id)
		ON DELETE CASCADE
);
CREATE UNIQUE INDEX idx_credentials
	ON credentials USING btree (user_id)
;

CREATE TABLE tokens (
	token_id     uuid   NOT NULL DEFAULT gen_random_uuid(),
	user_id      bigint NOT NULL,
	time_created timestamp(0) with time zone NOT NULL,
	CONSTRAINT tokens_pkey PRIMARY KEY (token_id),
	CONSTRAINT fk__tokens__user_id FOREIGN KEY (user_id)
		REFERENCES users (user_id)
		ON DELETE CASCADE
);
