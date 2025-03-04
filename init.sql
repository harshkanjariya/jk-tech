CREATE TABLE users
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100),
    email       VARCHAR(100) UNIQUE NOT NULL,
    provider    VARCHAR(50),
    provider_id VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE posts
(
    id         SERIAL PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    content    TEXT         NOT NULL,
    author_id  UUID         NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


INSERT INTO users (name, email, provider, provider_id)
VALUES ('Test User', 'testuser@gmail.com', 'google', '123456789');

INSERT INTO posts (user_id, title, body)
VALUES (1, 'First Post', 'This is a test components.');
