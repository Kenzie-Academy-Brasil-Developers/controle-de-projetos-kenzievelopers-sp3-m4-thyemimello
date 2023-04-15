import { Request, Response } from "express";
import { QueryResult } from "pg";
import { client } from "../../database";
import { TDevelopersInfo, TDevelopersInfoRequest } from "../../interfaces/infosDevelopersInterface";
import format from "pg-format";

const createDevelopersInfos = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const developersInfoData: TDevelopersInfoRequest = req.body;
    developersInfoData.developerId = parseInt(req.params.id);
  
    const queryString: string = format(
      `
              INSERT INTO
                  developer_infos(%I)
              VALUES
                  (%L)
              RETURNING *;    
          `,
      Object.keys(developersInfoData),
      Object.values(developersInfoData)
    );
    const queryResult: QueryResult<TDevelopersInfo> = await client.query(
      queryString
    );

    
  
    return res.status(201).json(queryResult.rows[0]);
  };

  export {createDevelopersInfos}
  