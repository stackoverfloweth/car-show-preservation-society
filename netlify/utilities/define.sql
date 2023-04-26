CREATE TABLE club (
  id BINARY(16) NOT NULL PRIMARY KEY,
  clubId varchar(36) generated always as
  (insert(
      insert(
        insert(
          insert(hex(id),9,0,'-'),
          14,0,'-'),
        19,0,'-'),
      24,0,'-')
  ) virtual,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NULL,
  contactUserId BINARY(16) NULL,
  stripeCustomerId BINARY(16) NULL,
  imageId BINARY(16) NULL,
  joinableByAnyone BOOLEAN NULL,
  joinableByApplication BOOLEAN NULL,
  deleted BOOLEAN NOT NULL DEFAULT 0
);

alter table club add unique(clubId);

CREATE TABLE clubImage (
    id BINARY(16) NOT NULL PRIMARY KEY,
    clubImageId varchar(36) generated always as
    (insert(
        insert(
          insert(
            insert(hex(id),9,0,'-'),
            14,0,'-'),
          19,0,'-'),
        24,0,'-')
    ) virtual,
    clubId BINARY(16) NOT NULL,
    FOREIGN KEY (clubId) REFERENCES club(id)
);