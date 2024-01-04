CREATE TABLE
    news (
        id VARCHAR(15) PRIMARY KEY NOT NULL,
        category VARCHAR(50),
        title TEXT,
        img_url TEXT,
        abstract TEXT,
        url TEXT,
        author VARCHAR(255)
        date VARCHAR(50)
    );

CREATE TABLE
    behaviours (
        id INT PRIMARY KEY NOT NULL,
        userid VARCHAR(15),
        timestamp VARCHAR(50),
        click_history TEXT,
        impressions TEXT
    );

ALTER TABLE news
ALTER COLUMN title_entities TYPE TEXT;

CREATE TABLE
    users (
        userid VARCHAR(15) PRIMARY KEY NOT NULL,
        username VARCHAR(50) NOT NULL,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        email   varchar(319) NOT NULL,
        password VARCHAR(255) NOT NULL,
        interest_areas  TEXT[],
        wide_interest BOOLEAN,
        topic_exclusions TEXT[],
        trending_news VARCHAR(50)
    );

select * from behaviours where userid = 'U7'; 

ALTER TABLE news1
ADD COLUMN date VARCHAR(50);

UPDATE behaviours1
SET impressions = 'N37-1 N1360-1 N2034-1 N1175-0'
WHERE id = 2;