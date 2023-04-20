import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../../database";
import format from "pg-format";
import { TProjects } from "../../interfaces/projectsInterfaces";
import { TDevelopers } from "../../interfaces/developersInterfaces";

const updateProject = async (request: Request, response: Response) => {
  const id: number = +request.params.id;

  const body = request.body;

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
    values: [body.developerId],
  };

  const queryResultUser: QueryResult<TDevelopers> = await client.query(
    queryConfig
  );

  if (queryResultUser.rowCount === 0) {
    return response.status(404).json({
      message: "Developer not found",
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
    Object.keys(body),
    Object.values(body),
    id
  );

  const queryResult: QueryResult<TProjects> = await client.query(queryString);

  return response.status(200).json(queryResult.rows[0]);
};

export { updateProject };
