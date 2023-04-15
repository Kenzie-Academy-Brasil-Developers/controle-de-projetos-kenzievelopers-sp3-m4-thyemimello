import { Request, Response } from "express"
import { QueryResult } from "pg"
import { TProjects, TProjectsRequest } from "../../interfaces/projectsInterfaces"
import { client } from "../../database"
import format from "pg-format"

const deleteProject = async (request: Request, response: Response) => {
    const id: number = +request.params.id;
    try {
      const queryString: string = format(
        `
        DELETE FROM
          projects
        WHERE
          id = %L
      `,
        id
      );
  
      await client.query(queryString);
  
      return response.status(204).send();
    } catch (error: any) {
      return response.status(500).json({
        message: error.message,
      });
    }
  };
  
  export const createTechnology = async (
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
  
      const queryResult: QueryResult<TProjects> = await client.query(
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
      console.log(technologyQueryResult.rows);
  
      return response.status(201).json(technologyQueryResult.rows[0]);
    } catch (error: any) {
      response.status(500).json({
        message: error.message,
      });
    }
  };

  export {deleteProject}