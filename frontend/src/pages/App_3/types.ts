
export interface CountryPopularity {
  country_name: string;
  country_code: string;
  ratio: string;
  estimated_population: string;
}

export interface OriginData {
  country_name: string;
  country_code: string;
  meaning: string;
  ratio: string;
}

export interface PopularityResponse {
  countries: CountryPopularity[];
  origin?: OriginData | null;
}

export interface MapData {
  id: string;
  name: string;
}
