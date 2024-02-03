CREATE SEQUENCE auth_seq
	START WITH 1 -- Cannot set initial value dynamically; must update later
	INCREMENT BY 1
;
SELECT setval('auth_seq', (SELECT nextval('hibernate_sequence'))); -- Update initial value

CREATE SEQUENCE matches_seq
	START WITH 1
	INCREMENT BY 1
;
SELECT setval('matches_seq', (SELECT nextval('hibernate_sequence')));

CREATE SEQUENCE objectives_seq
	START WITH 1
	INCREMENT BY 1
;
SELECT setval('objectives_seq', (SELECT nextval('hibernate_sequence')));

CREATE SEQUENCE image_info_seq
	START WITH 1
	INCREMENT BY 1
;
SELECT setval('image_info_seq', (SELECT nextval('hibernate_sequence')));

CREATE SEQUENCE image_content_seq
	START WITH 1
	INCREMENT BY 1
;
SELECT setval('image_content_seq', (SELECT nextval('hibernate_sequence')));
