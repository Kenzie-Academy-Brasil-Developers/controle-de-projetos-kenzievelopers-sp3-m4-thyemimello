import { Request, Response } from "express"
import { QueryConfig, QueryResult } from "pg"
import { TProjects, TProjectsRequest } from "../../interfaces/projectsInterfaces"
import { client } from "../../database"
import format from "pg-format"
import { TDevelopers } from "../../interfaces/developersInterfaces"

const createProjects = async (req: Request, res: Response): Promise<Response> => {
    const projectsData: TProjectsRequest = req.body

    const queryStringUser: string = `
    SELECT
        *
    FROM
        developers
    WHERE
        id = $1;    
    `;
  const queryConfig: QueryConfig = {
    text: queryStringUser,
    values: [projectsData.developerId],
  };

  const queryResultUser: QueryResult<TDevelopers> = await client.query(queryConfig);

  if (queryResultUser.rowCount === 0) {
    return res.status(404).json({
      message: "Developer not found",
    });
  }

    const queryString: string = format(
        `
        INSERT INTO
            projects(%I)
        VALUES 
            (%L)
        RETURNING *;       
        `,
        Object.keys(projectsData),
        Object.values(projectsData)
    )

const queryResult: QueryResult<TProjects> = await client.query(queryString)

return res.status(201).json(queryResult.rows[0])
}

export {createProjects}