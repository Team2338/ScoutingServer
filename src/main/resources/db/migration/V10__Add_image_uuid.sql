-- Add UUID column to image content, filling in existing values
ALTER TABLE image_content
	ADD COLUMN image_id uuid NOT NULL DEFAULT gen_random_uuid()
;

-- Add UUID foreign key column to image metadata, but leave it empty for now
ALTER TABLE image_info
	ADD COLUMN image_uuid uuid
;

-- Update the image metadata with foreign keys from the image content table
UPDATE image_info
	SET image_info.image_uuid = content.image_id
	FROM image_info INNER JOIN (SELECT id, image_id FROM image_content) content
		ON image_info.image_id = content.id
;

-- Remove old column and constrain the new uuid column
ALTER TABLE image_info
	DROP COLUMN image_id,
	ALTER COLUMN image_uuid SET NOT NULL
;

-- Remove the old ID column for content
ALTER TABLE image_content
	DROP COLUMN secret_code,
	DROP CONSTRAINT image_content,
	DROP COLUMN id
;

-- Rename the uuid column to the original ID name
ALTER TABLE image_content
	RENAME COLUMN image_id to id
;

-- Add the primary key back in
ALTER TABLE image_content
	ADD CONSTRAINT image_content_pkey PRIMARY KEY (id)
;

DROP SEQUENCE image_content_seq;
