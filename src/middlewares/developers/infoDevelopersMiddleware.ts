import { Request, Response, NextFunction } from "express";
import { QueryConfig, QueryResult } from "pg";
import {
  TDevelopers,
  TDevelopersRequest,
  TUpdateDeveloperRequest,
} from "../../interfaces/developersInterfaces";
import { client } from "../../database";
import format from "pg-format";


  
  const ensureDeveloperInfoNotExists = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id: number = +request.params.id;
  
    try {
      const queryString: string = format(
        `
        SELECT 
          *
        FROM
          developers
        WHERE
          id = %s;
      `,
        id
      );
  
      const queryResult: QueryResult<TUpdateDeveloperRequest> = await client.query(
        queryString
      );
  
      if (queryResult.rows[0].developerInfoId) {
        return response
          .status(409)
          .json({ message: "Developer infos already exists." });
      }
  
      next();
    } catch (error: any) {
      return response.status(500).json({
        message: error.message,
      });
    }
  };

  export {ensureDeveloperInfoNotExists}