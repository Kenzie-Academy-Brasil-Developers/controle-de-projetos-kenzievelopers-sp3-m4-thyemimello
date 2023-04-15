import { Request, Response} from "express";
import format from "pg-format";
import { QueryResult } from "pg";
import { client } from "../../database";

const deleteDeveloper = async (request: Request, response: Response) => {
    const id: number = +request.params.id;
   
      const queryString: string = format(
        `
        DELETE FROM
          developers
        WHERE
          id = %L
      `,
        id
      );
  
      const queryResult = await client.query(queryString);
  
      return response.status(204).send();
  
  };

  export {deleteDeveloper}
  