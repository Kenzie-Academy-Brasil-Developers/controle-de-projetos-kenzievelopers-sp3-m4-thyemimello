import { Request, Response } from "express"
import { QueryResult } from "pg"
import { client } from "../../database"
import format from "pg-format"
import { TProjects } from "../../interfaces/projectsInterfaces"

const updateProject = async (request: Request, response: Response) => {
    const id: number = +request.params.id;
  
    const body = request.body;
    const allowedKeys = ["endDate", "estimatedTime"];
    let newData: any = {};
  
    for (const key in body) {
      if (allowedKeys.includes(key)) {
        newData[key] = body[key];
      }
    }
  
    if (!newData.endDate && !newData.estimatedTime) {
      return response.status(400).json({
        message: "At least one of those keys must be send.",
        keys: ["endDate", "estimatedTime"],
      });
    }
  
      const queryString: string = format(
        `
        UPDATE
          projects
        SET
          (%I) = ROW(%L)
        WHERE
          id = %s
        RETURNING *;
      `,
        Object.keys(newData),
        Object.values(newData),
        id
      );
  
      const queryResult: QueryResult<TProjects> = await client.query(
        queryString
      );
  
      return response.status(200).json(queryResult.rows[0]);
 
  };
  
  export {updateProject}