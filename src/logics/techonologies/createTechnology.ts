import format from "pg-format";
import {Request, Response} from "express"
import { client } from "../../database";
import { QueryResult } from "pg";
import { TTechnologies } from "../../interfaces/technologiesInterfaces";

const createTechnology = async (
    request: Request,
    response: Response
  ) => {
    const id = +request.params.id;
  
    const newData = {
      name: request.body.name,
    };
  
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
  
    try {
      let queryString: string = format(
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
        queryString
      );
  
      const technologyId: number = +queryResult.rows[0].id;
      const currentDate = new Date();
  
      queryString = format(
        `
      INSERT INTO
          projects_technologies ("addedin", "projectId", "technologyId")
      VALUES
          (%L, %L, %L)
      RETURNING *;
      `,
        currentDate,
        id,
        technologyId
      );
  
      let technologyQueryResult = await client.query(queryString);
  
      queryString = format(
        `
      SELECT 
        technologies.id as "technologyId",
        technologies.name as "technologyName",
        projects.id as "projectId",
        projects.name as "projectName",
        projects.description as "projectDescription",
        projects."estimatedTime" as "projectEstimatedTime",
        projects.repository as "projectRepository",
        projects."startDate" as "projectStartDate",
        projects."endDate" as "projectEndDate"
      FROM 
          projects_technologies 
      FULL JOIN 
          projects ON projects_technologies."projectId" = projects.id
      LEFT JOIN
          technologies ON projects_technologies."technologyId" = technologies.id
      WHERE 
        projects.id = %L AND technologies.id = %s ;
      `,
        id,
        technologyId
      );
  
      technologyQueryResult = await client.query(queryString);
     
  
      return response.status(201).json(technologyQueryResult.rows[0]);
    } catch (error: any) {
      response.status(500).json({
        message: error.message,
      });
    }
  };

  export {createTechnology}