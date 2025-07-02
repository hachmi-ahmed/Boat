CREATE SCHEMA IF NOT EXISTS boatDb;

CREATE TABLE boatDb.app_user
(
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    email              VARCHAR(50)  NOT NULL UNIQUE,
    first_name         VARCHAR(50)  NOT NULL,
    last_name          VARCHAR(50)  NOT NULL,
    password           VARCHAR(512) NOT NULL,
    role               VARCHAR(50)  NOT NULL,
    created_by         VARCHAR(100) NOT NULL DEFAULT 'system',
    created_date       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by   VARCHAR(100),
    last_modified_date TIMESTAMP             DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE boatDb.boat
(
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    name               VARCHAR(50)  NOT NULL,
    description        VARCHAR(300) NOT NULL,
    image_url          VARCHAR(200) NOT NULL,
    user_id            BIGINT       NOT NULL,
    created_by         VARCHAR(20)  NOT NULL DEFAULT 'system',
    created_date       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by   VARCHAR(20),
    last_modified_date TIMESTAMP             DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_boat_user FOREIGN KEY (user_id)
        REFERENCES boatDb.app_user (id)
);

CREATE TABLE boatDb.message
(
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    fr   VARCHAR(512) NOT NULL,
    en   VARCHAR(512) NOT NULL
);

CREATE TABLE boatDb.refresh_token
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    token       TEXT                     NOT NULL,
    username    VARCHAR(255)             NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked     BOOLEAN                  NOT NULL DEFAULT FALSE
);
