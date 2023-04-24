import { Request, Response } from "express";
import {
  TDevelopers,
  TDevelopersRequest,
  TUpdateDeveloperRequest,
} from "../../interfaces/developersInterfaces";
import format from "pg-format";
import { QueryResult } from "pg";
import { client } from "../../database";
import { TDevelopersInfo, TDevelopersInfoRequest } from "../../interfaces/infosDevelopersInterface";

const createDevelopers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developersData: TDevelopersRequest = req.body;

  const queryString: string = format(
    `
           INSERT INTO
                developers (%I) 
           VALUES
                (%L)     
           RETURNING *;

        `,
    Object.keys(developersData),
    Object.values(developersData)
  );


  const queryResult: QueryResult<TDevelopers> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};







export { createDevelopers };
