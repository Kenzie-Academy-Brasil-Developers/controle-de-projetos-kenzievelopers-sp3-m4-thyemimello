import { Request, Response } from "express"
import { QueryResult } from "pg"
import { TProjects, TProjectsRequest } from "../../interfaces/projectsInterfaces"
import { client } from "../../database"
import format from "pg-format"

const createProjects = async (req: Request, res: Response): Promise<Response> => {
    const projectsData: TProjectsRequest = req.body

    const queryString: string = format(
        `
        INSERT INTO
            projects(%I)
        VALUES 
            (%L)
        RETURNING *;       
        `,
        Object.keys(projectsData),
        Object.values(projectsData)
    )

const queryResult: QueryResult<TProjects> = await client.query(queryString)

return res.status(201).json(queryResult.rows[0])
}

export {createProjects}