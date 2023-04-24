import { Request, Response } from "express";
import { QueryResult } from "pg";
import format from "pg-format";
import { client } from "../../database";
import { TTechnologies } from "../../interfaces/technologiesInterfaces"

const createTechnology = async (
  request: Request,
  response: Response
) => {
  const id = +request.params.id;
  const newData = {name: request.body.name};

  if (!newData.name) {
    return response.status(400).json({ message: "Must pass name" });
  }

  const options = [
    "JavaScript",
    "Python",
    "React",
    "Express.js",
    "HTML",
    "CSS",
    "Django",
    "PostgreSQL",
    "MongoDB",
  ];

  const verifyName = options.includes(newData.name);

  if (!verifyName) {
    return response.status(400).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }


   const queryStringTec: string = format(
      `
        SELECT
            *
        FROM
            "technologies"
        WHERE 
            name = %L ;
        `,
      Object.values(newData)
    );

    const queryResult: QueryResult<TTechnologies> = await client.query(
        queryStringTec
    );

    const technologyId: number = +queryResult.rows[0].id;
    const currentDate = new Date();

   const queryStringPro = format(
      `
    INSERT INTO
        projects_technologies ("addedln", "projectId", "technologyId")
    VALUES
        (%L, %L, %L)
    RETURNING *;
    `,
      currentDate,
      id,
      technologyId
    );

    let technologyQueryResult = await client.query(queryStringPro);

   const queryString = format(
      `
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
      pj."endData" as "projectEndDate"
    FROM 
      projects_technologies  pt
    FULL JOIN
      projects pj ON pt."projectId" = pj."id"
    LEFT JOIN
      technologies te ON pt."technologyId" = te."id";
    WHERE 
      projects.id = %L AND technologies.id = %s ;
    `,
      id,
      technologyId
    );

    technologyQueryResult = await client.query(queryString);


    return response.status(201).json(technologyQueryResult.rows[0]);
 
};

export {createTechnology}