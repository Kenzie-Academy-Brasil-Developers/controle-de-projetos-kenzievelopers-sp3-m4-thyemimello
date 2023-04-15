import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import {
  TProjects,
} from "../../interfaces/projectsInterfaces";
import { client } from "../../database";

const getDevelopersInfos = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    SELECT
        de.*,
        di."developerSince",
        di."preferredOS"
    FROM developers de
    JOIN developer_infos di ON de."id" = di."developerId"
    `;
  const queryResult: QueryResult<TProjects> = await client.query(queryString);

  return res.json(queryResult.rows);
};

export { getDevelopersInfos };
