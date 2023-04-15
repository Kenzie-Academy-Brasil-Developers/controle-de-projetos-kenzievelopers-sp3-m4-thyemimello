import { Request, Response} from "express";
import format from "pg-format";
import { QueryResult } from "pg";
import { client } from "../../database";
import { TUpdateDeveloperRequest } from "../../interfaces/developersInterfaces";

const updateDeveloper = async (request: Request, response: Response) => {
    const id: number = +request.params.id;
    const allowedKeys = ["name", "email"];
    const body = request.body;
    let newData: any = {};
  
    for (const key in body) {
      if (allowedKeys.includes(key)) {
        newData[key] = body[key];
      }
    }
  
    if (!newData.name && !newData.email) {
      return response.status(400).json({
        message: "At least one of those keys must be send.",
        keys: ["name", "email"],
      });
    }
  
   const queryString: string = format(
        `
      UPDATE
        developers
      SET
        (%I) = ROW(%L)
      WHERE
        id = %s
      RETURNING *;
    `,
        Object.keys(newData),
        Object.values(newData),
        id
      );
  
      const queryResult: QueryResult<TUpdateDeveloperRequest> = await client.query(
        queryString
      );
      return response.json(queryResult.rows[0]);
  
  };

  export { updateDeveloper}