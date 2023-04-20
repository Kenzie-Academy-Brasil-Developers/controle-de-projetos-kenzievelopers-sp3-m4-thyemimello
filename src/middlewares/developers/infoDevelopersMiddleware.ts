import { Request, Response, NextFunction } from "express";
import { QueryConfig, QueryResult } from "pg";
import {
  TDevelopers,
  TDevelopersRequest,
  TUpdateDeveloperRequest,
} from "../../interfaces/developersInterfaces";
import { client } from "../../database";
import format from "pg-format";
import { TDevelopersInfoRequest } from "../../interfaces/infosDevelopersInterface";

const ensureDeveloperInfoNotExists = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const id: number = +request.params.id;

  const {developerSince, preferredOS} = request.body

  try {
    const queryString: string = format(
      `
    SELECT
      de.*,
      di."developerSince",
      di."preferredOS"
    FROM developers de
    LEFT JOIN developer_infos di ON de.id = di."developerId"
    WHERE 
    de.id = %s;  
      `,
      id
    );

    const queryResult: QueryResult<TDevelopersInfoRequest> =
      await client.query(queryString);
      if (queryResult.rows[0].developerSince || queryResult.rows[0].preferredOS) {
    
      return response
        .status(409)
        .json({ message: "Developer infos already exists." });
    }

    next();
  } catch (error: any) {
    return response.status(500).json({
      message: ("deu erro"),
    });
  }
};

export { ensureDeveloperInfoNotExists };
