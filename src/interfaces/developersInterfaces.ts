type TDevelopers = {
    id: number
  name: string;
  email: string;
};



type TDevelopersRequest = Omit<TDevelopers, "id">;


type TUpdateDeveloperRequest = {
    name?: string;
    email?: string;
    developerInfoId: number | null;
  }

  type TDevelopersData = Omit<TUpdateDeveloperRequest, "developerInfoId">; 
  

export {
  TDevelopers,
  TDevelopersRequest,
  TUpdateDeveloperRequest,
  TDevelopersData
 };
