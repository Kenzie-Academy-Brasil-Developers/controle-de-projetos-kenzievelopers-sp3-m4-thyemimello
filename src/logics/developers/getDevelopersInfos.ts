import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { TProjects } from "../../interfaces/projectsInterfaces";
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
    LEFT JOIN developer_infos di ON de.id = di."developerId"
    WHERE 
     de.id = $1;  
    
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id]
    };

  const queryResult: QueryResult<TProjects> = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

export { getDevelopersInfos };
