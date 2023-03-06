export interface AccessDataType {
  adm2_id: string;
  TotPopulation: number;
  PopAccess2020: number;
  PopAccess2019: number;
  PopAccess2018: number;
  PopAccess2017: number;
  PopAccess2016: number;
  PopAccess2015: number;
  PopAccess2014: number;
  PopAccess2013: number;
  PopAccess2012: number;
  adm2_name: string;
  RWI?: number;
}

export interface CountryAccessDataType {
  TotPopulation: number;
  PopAccess2020: number;
  PopAccess2019: number;
  PopAccess2018: number;
  PopAccess2017: number;
  PopAccess2016: number;
  PopAccess2015: number;
  PopAccess2014: number;
  PopAccess2013: number;
  PopAccess2012: number;
  TotPopulationLowRWI: number;
  PopAccess2020LowRWI: number;
  PopAccess2019LowRWI: number;
  PopAccess2018LowRWI: number;
  PopAccess2017LowRWI: number;
  PopAccess2016LowRWI: number;
  PopAccess2015LowRWI: number;
  PopAccess2014LowRWI: number;
  PopAccess2013LowRWI: number;
  PopAccess2012LowRWI: number;
}

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

export interface CtxDataType {
  selectedCountry?: string;
  selectedDistrict?: string;
  layer: 1 | 2;
  showProjects: boolean;
  hideLabels: boolean;
  showPoorRegions: boolean;
  highlightThreshold: number;
  updateSelectedCountry: (_d?: string) => void;
  updateSelectedDistrict: (_d?: string) => void;
  updateLayer: (_d: 1 | 2) => void;
  updateShowProjects: (_d: boolean) => void;
  updateHideLabels: (_d: boolean) => void;
  updateShowPoorRegions: (_d: boolean) => void;
  updateHighlightThreshold: (_d: number) => void;
}
