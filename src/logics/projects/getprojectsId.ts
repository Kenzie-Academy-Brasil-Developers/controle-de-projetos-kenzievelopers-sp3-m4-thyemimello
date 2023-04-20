import { Request, Response } from "express";
import { QueryResult } from "pg";
import {
  TProjects,
} from "../../interfaces/projectsInterfaces";
import { client } from "../../database";

const getProjects = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    SELECT
        pj.*,
        pj.id as "projectID",
        pj."name" as "projectName",
        pj."description" as "projectDescription",
        pj."estimatedTime" as "projectEstimatedTime",
        pj."repository" as "projectRepository",
        pj."startDate" as "projectStartDate",
        pj."endDate" as "projectEndDate",
        pj."developerId" as "projectDeveloperID",
        te."id" as "technologyID",
        te."name" as "technologyName"
    FROM
        projects pj 
    LEFT JOIN 
        projects_technologies pt ON pt."projectId" = pj."id" 
    LEFT JOIN
        technologies te ON pt."technologyId" = te."id";
    `;
  const queryResult: QueryResult<TProjects> = await client.query(queryString);

  return res.json(queryResult.rows);
};

export { getProjects };
