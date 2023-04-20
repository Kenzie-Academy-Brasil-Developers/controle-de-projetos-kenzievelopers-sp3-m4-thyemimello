-- Active: 1677169316233@@127.0.0.1@5432@techonologics@public
CREATE TYPE "OS" AS ENUM ('Windows', 'Linux', 'MacOS');
CREATE TABLE IF NOT EXISTS developers(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS developer_infos(
    "id" SERIAL PRIMARY KEY,
    "developerSince" DATE NOT NULL,
    "preferredOS" "OS" NOT NULL,
    "developerId" INTEGER NOT NULL UNIQUE,
    FOREIGN KEY ("developerId") REFERENCES developers ("id") ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS projects(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "estimatedTime" VARCHAR(20) NOT NULL,
    "repository" VARCHAR(120) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "developerId" INTEGER,
    FOREIGN KEY ("developerId") REFERENCES developers ("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS technologies(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(30) NOT NULL
);

INSERT INTO 
technologies ("name")
VALUES
('JavaScript'), ('Python'), ('React'), ('Express.js'), ('HTML'), 
('CSS'), ('Django'), ('PostgreSQL'), ('MongoDB');

CREATE TABLE IF NOT EXISTS projects_technologies(
    "id" SERIAL PRIMARY KEY,
    "addedIn" DATE NOT NULL,
    "technologyId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    FOREIGN KEY ("technologyId") REFERENCES "technologies" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE
);

SELECT
    de.*,
    di."developerSince",
    di."preferredOS"
FROM developers de
    JOIN developer_infos di ON de."id" = di."developerId"


SELECT
    pj.*,
    pj.id as "projectID",
    pj."name" as "projectName",
    pj."description" as "projectDescription",
    pj."estimatedTime" as "projectEstimatedTime",
    pj."repository" as "projectRepository",
    pj."startDate" as "projectStartDate",
    pj."endDate" as "projectEndDate",
    pj."developerId" as "projectDeveloperID",
    te."id" as "technologyID",
    te."name" as "technologyName"
FROM
    projects pj 
    LEFT JOIN 
        projects_technologies pt ON pt."projectId" = pj."id" 
    LEFT JOIN
        technologies te ON pt."technologyId" = te."id";

SELECT
    te.*,
    te."id" as "technologyId",
    te."name" as "technologyName",
    pj."id" as "projectId",
    pj."name" as "projectName",
    pj."description" as "projectDescription",
    pj."estimatedTime" as "projectEstimatedTime",
    pj."repository" as "projectRepository",
    pj."startDate" as "projectStartDate",
    pj."endDate" as "projectEndDate"
FROM 
    projects_technologies  pt
FULL JOIN
    projects pj ON pt."projectId" = pj."id"
LEFT JOIN
    technologies te ON pt."technologyId" = te."id";