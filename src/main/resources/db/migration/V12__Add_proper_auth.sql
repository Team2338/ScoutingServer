
CREATE SEQUENCE users_seq
	START WITH 1 INCREMENT BY 5;

CREATE TABLE users (
	user_id		bigint			NOT NULL,
	email		varchar(254)	NOT NULL,
	team_number	integer			NOT NULL,
	username	varchar(32)		NOT NULL,
	role		varchar(32)		NOT NULL,
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
	token_id		uuid	NOT NULL DEFAULT gen_random_uuid(),
	user_id			bigint	NOT NULL,
	time_created	timestamp(0) with time zone NOT NULL,
	CONSTRAINT tokens_pkey PRIMARY KEY (token_id),
	CONSTRAINT fk__tokens__user_id FOREIGN KEY (user_id)
		REFERENCES users (user_id)
		ON DELETE CASCADE
);
