// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_SELECTED_COUNTRY':
      return { ...state, selectedCountry: action.payload };
    case 'UPDATE_SELECTED_DISTRICT':
      return { ...state, selectedDistrict: action.payload };
    case 'UPDATE_LAYER':
      return { ...state, layer: action.payload };
    case 'UPDATE_SHOW_PROJECTS':
      return { ...state, showProjects: action.payload };
    case 'UPDATE_HIDE_LABELS':
      return { ...state, hideLabels: action.payload };
    case 'UPDATE_SHOW_POOR_REGION':
      return { ...state, showPoorRegions: action.payload };
    case 'UPDATE_HIGHLIGHT_THRESHOLD':
      return { ...state, highlightThreshold: action.payload };
    default:
      return { ...state };
  }
};
