type TTechnologies = {
  id: number;
  name: string;
};

type TTechnogiesRequest = Omit<TTechnologies, "id">;

export { TTechnologies, TTechnogiesRequest };
