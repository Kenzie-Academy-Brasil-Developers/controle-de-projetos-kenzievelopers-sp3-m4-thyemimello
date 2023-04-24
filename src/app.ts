import express, { Application } from "express";
import "dotenv/config";
import { startDatabase } from "./database";
import { createDevelopers } from "./logics/developers/postDevelopersLogics";
import {
  ensureDevelopersExistsMiddleware,
  ensureEmailDevelopersExist,
} from "./middlewares/developers/developersMiddleware";
import { getDevelopersInfos } from "./logics/developers/getDevelopersInfos";
import { createProjects } from "./logics/projects/postProjects";
import { updateDeveloper } from "./logics/developers/updateDevelopers";
import { deleteDeveloper } from "./logics/developers/deleteDevelopers";
import { createDevelopersInfos } from "./logics/developers/postInfoDevelopers";
import { ensureDeveloperInfoNotExists } from "./middlewares/developers/infoDevelopersMiddleware";
import { createTechnology } from "./logics/techonologies/postTechonologies";
import { ensureProjectsExistsMiddleware } from "./middlewares/projects/projectsMiddleware";
import { updateProject } from "./logics/projects/updateProject";
import { deleteProject } from "./logics/projects/deleteProjects";
import { deleteTechnology } from "./logics/techonologies/deleteTechonologies";
import { getProjects } from "./logics/projects/getprojectsId";

const app: Application = express();
app.use(express.json());

app.post("/developers", ensureEmailDevelopersExist, createDevelopers);
app.post(
  "/developers/:id/infos",
  ensureDevelopersExistsMiddleware,
  ensureDeveloperInfoNotExists,
  createDevelopersInfos
);
app.get(
  "/developers/:id",
  ensureDevelopersExistsMiddleware,
  getDevelopersInfos
);
app.patch(
  "/developers/:id",
  ensureDevelopersExistsMiddleware,
  ensureEmailDevelopersExist,
  updateDeveloper
);
app.delete(
  "/developers/:id",
  ensureDevelopersExistsMiddleware,
  deleteDeveloper
);

app.post("/projects", createProjects);
app.get("/projects/:id", ensureProjectsExistsMiddleware, getProjects);
app.patch("/projects/:id", ensureProjectsExistsMiddleware, updateProject);
app.delete("/projects/:id", ensureProjectsExistsMiddleware, deleteProject);
app.post("/projects/:id", ensureProjectsExistsMiddleware, createTechnology);
app.delete("/projects/:id", ensureProjectsExistsMiddleware, deleteTechnology);

app.post("/projects/:id/technologies", ensureProjectsExistsMiddleware, createTechnology)
app.delete("/projects/:id/technologies/:name", ensureProjectsExistsMiddleware, deleteTechnology)


export default app;
