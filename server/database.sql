CREATE TABLE
    news (
        id VARCHAR(15) PRIMARY KEY NOT NULL,
        category VARCHAR(50),
        subcategory VARCHAR(50),
        title TEXT,
        abstract TEXT,
        url TEXT,
        title_entities TEXT,
        abstract_entities TEXT
    );

CREATE TABLE
    behaviours (
        id INT PRIMARY KEY NOT NULL,
        userid VARCHAR(50),
        timestamp VARCHAR(50),
        click_history TEXT,
        impressions TEXT
    );

ALTER TABLE news
ALTER COLUMN title_entities TYPE TEXT;