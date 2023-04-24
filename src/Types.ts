export interface CountryTaxonomyDataType {
  'Alpha-3 code-1': string;
  'Country or Area': string;
  'Group 1': string;
  'Group 2': string;
  LDC: boolean;
  LLDC: boolean;
  'Latitude (average)': number;
  'Longitude (average)': number;
  SIDS: boolean;
  'Income group': string;
}
export interface ProjectDataType {
  Title: string;
  Latitude: number;
  Longitude: number;
}

export interface CountryProjectSummaryDataType {
  'Lead Country': string;
  'People directly benefiting': number;
  Expenses: number;
  'Number of projects': number;
}

export interface AccessYearlyData {
  year: number;
  value: number;
}

export interface AccessDataType {
  latCenter: number;
  longCenter: number;
  country: string;
  rwi: number;
  population: number;
  adm2_id: string;
  adm2_name: string;
  popAccess: AccessYearlyData[];
}

export interface CountrySummedDataType {
  population: number;
  noOfDistrictsWithRWI: number;
  noOfDistricts: number;
  totalPopulationWithRWIData: number;
  populationLowRWI: number;
  popAccess: AccessYearlyData[];
  popAccessLowRWI: AccessYearlyData[];
}

export interface CtxDataType {
  selectedCountry?: string;
  selectedDistrict?: string;
  layer: 1 | 2;
  showProjects: boolean;
  hideLabels: boolean;
  showPoorRegions: boolean;
  highlightThreshold: number;
  accessData?: AccessDataType[];
  updateSelectedCountry: (_d?: string) => void;
  updateSelectedDistrict: (_d?: string) => void;
  updateLayer: (_d: 1 | 2) => void;
  updateShowProjects: (_d: boolean) => void;
  updateHideLabels: (_d: boolean) => void;
  updateShowPoorRegions: (_d: boolean) => void;
  updateHighlightThreshold: (_d: number) => void;
  updateAccessData: (_d: AccessDataType[]) => void;
}
