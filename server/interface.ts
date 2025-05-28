export interface Character {
  _id: string;
  name: string;
  wikiUrl: string;
  race: string;
  birth: string | null;
  gender: string;
  death: string | null;
  hair: string | null;
  height: string | null;
  realm: string | null;
  spouse: string | null;
}

export interface Quote {
  _id: string;
  dialog: string;
  movie: string;
  character: string;
  id: string;
}
export interface Movie {
  _id: string;
  name: string;
  runtimeInMinutes: number;
  budgetInMillions: number;
  boxOfficeRevenueInMillions: number;
  academyAwardNominations: number;
  academyAwardWins: number;
  rottenTomatoesScore: number;
}
