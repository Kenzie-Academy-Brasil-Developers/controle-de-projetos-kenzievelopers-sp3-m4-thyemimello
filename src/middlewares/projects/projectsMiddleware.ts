import { Request, Response, NextFunction } from "express";
import { QueryConfig, QueryResult } from "pg";
import {
    TProjects,
      } from "../../interfaces/projectsInterfaces";
  import { client } from "../../database";

const ensureProjectsExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let id: number = parseInt(req.params.id);

  const queryString: string = `
    SELECT
        *
    FROM
        projects
    WHERE
        id = $1;    
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TProjects> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      message: "Projects not found",
    });
  }

  res.locals.developers = queryResult.rows[0];

  return next();
};

export {ensureProjectsExistsMiddleware}