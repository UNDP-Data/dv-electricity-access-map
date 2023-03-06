import { createContext } from 'react';
import { CtxDataType } from '../Types';

const Context = createContext<CtxDataType>({
  selectedCountry: undefined,
  selectedDistrict: undefined,
  layer: 1,
  showProjects: false,
  hideLabels: false,
  showPoorRegions: false,
  highlightThreshold: 100,
  updateSelectedCountry: (_d?: string) => {},
  updateSelectedDistrict: (_d?: string) => {},
  updateLayer: (_d: 1 | 2) => {},
  updateShowProjects: (_d: boolean) => {},
  updateHideLabels: (_d: boolean) => {},
  updateShowPoorRegions: (_d: boolean) => {},
  updateHighlightThreshold: (_d: number) => {},
});

export default Context;
