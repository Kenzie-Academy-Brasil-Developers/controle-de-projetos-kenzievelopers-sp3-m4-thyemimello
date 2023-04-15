type TDevelopersInfo = {
    id: number;
    developerSince: Date;
    preferredOS: string;
    developerId: number;
  };

  type TDevelopersInfoRequest = Omit<TDevelopersInfo, "id">;

  export {TDevelopersInfo, TDevelopersInfoRequest}