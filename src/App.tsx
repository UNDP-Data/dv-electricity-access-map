import { useReducer } from 'react';
import { Header } from './Components/Header';
import { MapContainer } from './Components/MapContainer';
import Context from './Context/Context';
import Reducer from './Context/Reducer';
import { AccessDataType } from './Types';

function App() {
  const initialState = {
    selectedCountry: undefined,
    selectedDistrict: undefined,
    layer: 1,
    showProjects: false,
    hideLabels: false,
    showPoorRegions: false,
    highlightThreshold: 100,
  };

  const [state, dispatch] = useReducer(Reducer, initialState);

  const updateSelectedCountry = (d?: string) => {
    dispatch({
      type: 'UPDATE_SELECTED_COUNTRY',
      payload: d,
    });
  };

  const updateSelectedDistrict = (d?: string) => {
    dispatch({
      type: 'UPDATE_SELECTED_DISTRICT',
      payload: d,
    });
  };

  const updateLayer = (d: 1 | 2) => {
    dispatch({
      type: 'UPDATE_LAYER',
      payload: d,
    });
  };

  const updateShowProjects = (d: boolean) => {
    dispatch({
      type: 'UPDATE_SHOW_PROJECTS',
      payload: d,
    });
  };

  const updateHideLabels = (d: boolean) => {
    dispatch({
      type: 'UPDATE_HIDE_LABELS',
      payload: d,
    });
  };

  const updateShowPoorRegions = (d: boolean) => {
    dispatch({
      type: 'UPDATE_SHOW_POOR_REGION',
      payload: d,
    });
  };

  const updateHighlightThreshold = (d: number) => {
    dispatch({
      type: 'UPDATE_HIGHLIGHT_THRESHOLD',
      payload: d,
    });
  };
  const updateAccessData = (d: AccessDataType) => {
    dispatch({
      type: 'UPDATE_ACCESS_DATA',
      payload: d,
    });
  };
  return (
    <div className='undp-container'>
      {window.location.href.includes('data.undp.org') ? null : <Header />}
      <Context.Provider
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        value={{
          ...state,
          updateSelectedCountry,
          updateSelectedDistrict,
          updateLayer,
          updateShowProjects,
          updateHideLabels,
          updateShowPoorRegions,
          updateHighlightThreshold,
          updateAccessData,
        }}
      >
        <MapContainer />
      </Context.Provider>
    </div>
  );
}

export default App;
