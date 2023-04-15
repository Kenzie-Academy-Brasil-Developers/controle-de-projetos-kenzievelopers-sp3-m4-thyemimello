import { Request, Response, NextFunction } from "express";
import { QueryConfig, QueryResult } from "pg";
import {
  TDevelopers, TDevelopersRequest,

} from "../../interfaces/developersInterfaces";
import { client } from "../../database";


const ensureEmailDevelopersExist = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const projectData: TDevelopers = request.body;

  const queryString: string = `
  SELECT * FROM
      developers
  WHERE
      email = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [projectData.email],
  };

  const queryResult: QueryResult<TDevelopersRequest> = await client.query(
    queryConfig
  );

  if (queryResult.rowCount === 1) {
    return response.status(409).json({
      error: "Email already exists!",
    });
  }

  return next();
};

const ensureDevelopersExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let id: number = parseInt(req.params.id);

  const queryString: string = `
    SELECT
        *
    FROM
        developers
    WHERE
        id = $1;    
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TDevelopers> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      message: "Developer not found",
    });
  }

  res.locals.developers = queryResult.rows[0];

  return next();
};


export { ensureDevelopersExistsMiddleware, ensureEmailDevelopersExist};
