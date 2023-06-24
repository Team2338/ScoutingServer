CREATE TABLE IF NOT EXISTS matches (
	id             bigint       NOT NULL,
	team_number    integer      NOT NULL,
	event_code     varchar(32)  NOT NULL,
	secret_code    varchar(255) NOT NULL, -- TODO: decrease size
	creator        varchar(32)  NOT NULL,
	match_number   integer      NOT NULL,
	robot_number   integer      NOT NULL,
	alliance_color varchar(32),           -- TODO: make not null
	time_created   varchar(64)  NOT NULL, -- TODO: decrease size
	is_hidden      boolean      NOT NULL,
	CONSTRAINT matches_pkey PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS objectives (
	id        bigint       NOT NULL,
	match_id  bigint,                -- TODO: make not null
	gamemode  varchar(64),           -- TODO: decrease size? Make not null
	objective varchar(128) NOT NULL, -- TODO: decrease size?
	count     integer      NOT NULL,
	list      integer[],
	CONSTRAINT objectives_pkey PRIMARY KEY (id),
	CONSTRAINT fks7n5wcdhacw6xxyx891lakarx
		FOREIGN KEY (match_id)
			REFERENCES matches (id)
	-- TODO: Cascade on delete
);


CREATE TABLE IF NOT EXISTS matches_objectives (
	match_entity_id bigint NOT NULL,
	objectives_id   bigint NOT NULL,
	CONSTRAINT fk9n2mrcv2y92na4w5c27dbcs9b
		FOREIGN KEY (objectives_id)
			REFERENCES objectives (id),
	-- TODO: Cascade on delete
	CONSTRAINT fka23xigof94x7ooodyxpahof40
		FOREIGN KEY (match_entity_id)
			REFERENCES matches (id)
	-- TODO: Cascade on delete
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_ddtkqjem3iy6vku1meenj2tsp
	ON matches_objectives
		USING btree (objectives_id) -- TODO: consider making this a hash index instead
;


CREATE TABLE IF NOT EXISTS notes (
	id           bigint        NOT NULL,
	team_number  integer       NOT NULL,
	event_code   varchar(32)   NOT NULL,
	secret_code  varchar(255)  NOT NULL, -- TODO: decrease size
	robot_number integer       NOT NULL,
	creator      varchar(32)   NOT NULL,
	time_created varchar(255)  NOT NULL, -- TODO: decrease size
	content      varchar(1024) NOT NULL,
	CONSTRAINT notes_pkey PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS auth (
	id          bigint NOT NULL,
	team_number integer,      -- TODO: make not null
	username    varchar(255), -- TODO: decrease size, make not null
	role        varchar(255), -- TODO: decrease size, make not null
	CONSTRAINT auth_pkey PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS image_info (
	id           bigint       NOT NULL,
	team_number  integer      NOT NULL,
	game_year    integer      NOT NULL,
	event_code   varchar(32)  NOT NULL,
	secret_code  varchar(255) NOT NULL, -- TODO: decrease size
	robot_number integer      NOT NULL,
	creator      varchar(255) NOT NULL, -- TODO: decrease size
	time_created varchar(255) NOT NULL, -- TODO: decrease size
	image_id     bigint       NOT NULL,
	is_present   boolean,               -- TODO: is this used? If so, make non-null
	CONSTRAINT image_info_pkey PRIMARY KEY (id)
	-- TODO: Add foreign key constraint image_id -> image_content.id?
);


CREATE TABLE IF NOT EXISTS image_content (
	id           bigint       NOT NULL,
	secret_code  varchar(255) NOT NULL, -- TODO: decrease size
	content_type varchar(32)  NOT NULL,
	content      bytea        NOT NULL,
	CONSTRAINT image_content PRIMARY KEY (id)
);
