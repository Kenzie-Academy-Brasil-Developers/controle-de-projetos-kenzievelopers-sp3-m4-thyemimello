type TProjects = {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endData: Date | null;
  developerId?: number;
};

type TProjectsRequest = Omit<TProjects, "id">;

export { TProjects, TProjectsRequest };
