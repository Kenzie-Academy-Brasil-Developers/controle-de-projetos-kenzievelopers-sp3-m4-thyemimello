import {Request, Response} from "express";
import { QueryResult } from "pg";
import format from "pg-format";
import { TTechnologies } from "../../interfaces/technologiesInterfaces";
import { client } from "../../database";

const deleteTechnology = async (
    request: Request,
    response: Response
  ) => {
    const id: number = +request.params.id;
    const name: string = request.params.name;
  
    try {
      let queryString: string = format(
        `
          SELECT
              *
          FROM
              "technologies"
          WHERE 
              name = %L 
          `,
        name
      );
      const queryResult: QueryResult<TTechnologies> = await client.query(
        queryString
      );
      const technologyId: number = +queryResult.rows[0].id;
  
      queryString = format(
        `
          SELECT
              *
          FROM
              projects_technologies
          WHERE 
            projects_technologies."projectId" = %L AND projects_technologies."technologyId" = %L;
          `,
        id,
        technologyId
      );
      if (!(await client.query(queryString)).rowCount) {
        return response.status(404).json({
          message: `Technology ${name} not found on this Project.`,
        });
      }
  
      queryString = format(
        `
      DELETE FROM 
          projects_technologies
      WHERE 
        projects_technologies."projectId" = %L AND projects_technologies."technologyId" = %L;
      `,
        id,
        technologyId
      );
      await client.query(queryString);
  
      return response.status(204).json();
    } catch (error: any) {
      response.status(500).json({
        message: error.message,
      });
    }
  };
  
  export { deleteTechnology}