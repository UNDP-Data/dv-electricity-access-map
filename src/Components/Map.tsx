/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibreGl from 'maplibre-gl';
import { Tooltip } from './Tooltip';
import { CountryTaxonomyDataType, CtxDataType } from '../Types';
import Context from '../Context/Context';
import { ProjectTooltip } from './ProjectTooltip';

interface HoverDataProps {
  district?: string;
  country: string;
  pctValue?: number;
  popValue?: number;
  xPosition: number;
  yPosition: number;
}

interface Props {
  countryTaxonomy: CountryTaxonomyDataType[];
  projectShapeData: any;
}
interface ProjectDataProps {
  text: string;
  xPosition: number;
  yPosition: number;
}

export function MapEl(props: Props) {
  const { countryTaxonomy, projectShapeData } = props;
  const projectDataGeoJson = {
    type: 'FeatureCollection',
    features: projectShapeData,
  };
  const {
    hideLabels,
    selectedCountry,
    updateSelectedCountry,
    selectedDistrict,
    updateSelectedDistrict,
    highlightThreshold,
    showProjects,
    layer,
  } = useContext(Context) as CtxDataType;
  const [hoverData, setHoverData] = useState<null | HoverDataProps>(null);
  const [projectHoverData, setProjectHoverData] =
    useState<null | ProjectDataProps>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<HTMLDivElement>(null);

  const colorScale = UNDPColorModule.divergentColors.colorsx10;
  const zoom = 1.25;

  useEffect(() => {
    if (map.current) return;
    // initiate map and add base layer
    (map as any).current = new maplibreGl.Map({
      container: mapContainer.current as any,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'https://basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
            ],
            tileSize: 256,
            attribution:
              'Map tiles by <a target="_top" rel="noopener" href="https://carto.com/">CartoDB</a>',
          },
          'raster-labels': {
            type: 'raster',
            tiles: [
              'https://basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
            ],
            tileSize: 256,
          },
          admin2: {
            type: 'vector',
            tiles: [
              'https://undpngddlsgeohubdev01.blob.core.windows.net/admin/adm2_polygons/{z}/{x}/{y}.pbf',
            ],
            attribution: 'UNDP GeoHub',
            promoteId: 'adm2_id',
          },
          admin0: {
            type: 'vector',
            tiles: [
              'https://undpngddlsgeohubdev01.blob.core.windows.net/admin/adm0_polygons/{z}/{x}/{y}.pbf',
            ],
            attribution: 'UNDP GeoHub',
            promoteId: 'adm0_id',
          },
          projectData: {
            type: 'geojson',
            data: projectDataGeoJson,
          },
        },
        layers: [
          {
            id: 'labels',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: 'raster-labels',
            type: 'raster',
            source: 'raster-labels',
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: 'admin2-electricity-access-population',
            type: 'fill',
            source: 'admin2',
            'source-layer': 'adm2_polygons',
            layout: {
              visibility: 'none',
            },
            filter: ['has', 'hrea_2020'],
            paint: {
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'pop_no_hrea_2020'],
                0,
                UNDPColorModule.sequentialColors.negativeColorsx06[0],
                99.99,
                UNDPColorModule.sequentialColors.negativeColorsx06[0],
                100,
                UNDPColorModule.sequentialColors.negativeColorsx06[1],
                999.99,
                UNDPColorModule.sequentialColors.negativeColorsx06[1],
                1000,
                UNDPColorModule.sequentialColors.negativeColorsx06[2],
                99999.99,
                UNDPColorModule.sequentialColors.negativeColorsx06[2],
                100000,
                UNDPColorModule.sequentialColors.negativeColorsx06[3],
                499999.99,
                UNDPColorModule.sequentialColors.negativeColorsx06[3],
                500000,
                UNDPColorModule.sequentialColors.negativeColorsx06[4],
                999999.99,
                UNDPColorModule.sequentialColors.negativeColorsx06[4],
                1000000,
                UNDPColorModule.sequentialColors.negativeColorsx06[5],
                1000000000,
                UNDPColorModule.sequentialColors.negativeColorsx06[5],
              ],
              'fill-opacity': 1,
              'fill-outline-color': 'hsla(0, 0%, 100%, 0.1)',
            },
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: 'admin2-electricity-access',
            type: 'fill',
            source: 'admin2',
            'source-layer': 'adm2_polygons',
            filter: ['has', 'hrea_2020'],
            paint: {
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', `hrea_2020`],
                0,
                colorScale[9],
                0.0999,
                colorScale[9],
                0.1,
                colorScale[8],
                0.1999,
                colorScale[8],
                0.2,
                colorScale[7],
                0.2999,
                colorScale[7],
                0.3,
                colorScale[6],
                0.3999,
                colorScale[6],
                0.4,
                colorScale[5],
                0.4999,
                colorScale[5],
                0.5,
                colorScale[4],
                0.5999,
                colorScale[4],
                0.6,
                colorScale[3],
                0.6999,
                colorScale[3],
                0.7,
                colorScale[2],
                0.7999,
                colorScale[2],
                0.8,
                colorScale[1],
                0.8999,
                colorScale[1],
                0.9,
                colorScale[0],
                1,
                colorScale[0],
              ],
              'fill-opacity': 1,
              'fill-outline-color': 'hsla(0, 0%, 100%, 0.1)',
            },
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: 'admin2-electricity-access-overlay',
            type: 'fill',
            source: 'admin2',
            'source-layer': 'adm2_polygons',
            filter: ['all', ['has', 'hrea_2020'], ['==', 'adm0_name', '']],
            paint: {
              'fill-color': '#000',
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.25,
                0,
              ],
            },
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: 'admin0-layer',
            type: 'fill',
            source: 'admin0',
            'source-layer': 'adm0_polygons',
            filter: ['has', 'hrea_2020'],
            paint: {
              'fill-color': '#000',
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.25,
                0,
              ],
              'fill-outline-color': 'hsla(0, 0%, 100%, 1)',
            },
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: 'admin2-overlay',
            type: 'fill',
            source: 'admin2',
            'source-layer': 'adm2_polygons',
            filter: ['all', ['has', 'hrea_2020'], ['==', 'adm0_name', '']],
            paint: {
              'fill-color': '#fff',
              'fill-opacity': 0.5,
              'fill-outline-color': 'hsla(0, 0%, 100%, 0)',
            },
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: 'projectData-circles',
            type: 'circle',
            source: 'projectData',
            layout: {
              visibility: 'none',
            },
            paint: {
              'circle-color': '#fff',
              'circle-opacity': 1,
              'circle-radius': 5,
              'circle-stroke-color': UNDPColorModule.graphMainColor,
              'circle-stroke-width': 1,
            },
          },
        ],
      },
      center: [25, 5],
      zoom,
    });

    (map as any).current.on('load', () => {
      let districtHoveredStateId: string | null = null;
      let countryHoveredStateId: string | null = null;
      // mouse over effect on district layer
      (map as any).current.on(
        'click',
        'admin2-electricity-access-overlay',
        (e: any) => {
          (map as any).current.getCanvas().style.cursor = 'pointer';
          if (e.features.length > 0) {
            updateSelectedDistrict(e.features[0].id);
          }
        },
      );
      (map as any).current.on('click', 'admin0-layer', (e: any) => {
        (map as any).current.getCanvas().style.cursor = 'pointer';
        if (e.features.length > 0) {
          // eslint-disable-next-line no-underscore-dangle
          updateSelectedCountry(e.features[0].properties.adm0_name);
          updateSelectedDistrict(undefined);
        }
      });
      (map as any).current.on('mousemove', 'admin0-layer', (e: any) => {
        (map as any).current.getCanvas().style.cursor = 'pointer';
        if (e.features.length > 0) {
          if (countryHoveredStateId) {
            (map as any).current.setFeatureState(
              {
                source: 'admin0',
                id: countryHoveredStateId,
                sourceLayer: 'adm0_polygons',
              },
              { hover: false },
            );
          }
          countryHoveredStateId = e.features[0].id;
          if (e.features[0].properties.pop_no_hrea_2020 !== undefined) {
            setHoverData({
              district: undefined,
              country: e.features[0].properties.adm0_name,
              pctValue: e.features[0].properties.hrea_2020 * 100,
              popValue: e.features[0].properties.pop_no_hrea_2020,
              xPosition: e.originalEvent.clientX,
              yPosition: e.originalEvent.clientY,
            });
            (map as any).current.setFeatureState(
              {
                source: 'admin0',
                id: countryHoveredStateId,
                sourceLayer: 'adm0_polygons',
              },
              { hover: true },
            );
          }
        }
      });
      (map as any).current.on('mouseleave', 'admin0-layer', () => {
        if (countryHoveredStateId) {
          setHoverData(null);
          (map as any).current.setFeatureState(
            {
              source: 'admin0',
              id: countryHoveredStateId,
              sourceLayer: 'adm0_polygons',
            },
            { hover: false },
          );
        }
        countryHoveredStateId = null;
      });
      (map as any).current.on(
        'mousemove',
        'admin2-electricity-access-overlay',
        (e: any) => {
          (map as any).current.getCanvas().style.cursor = 'pointer';
          if (e.features.length > 0) {
            if (districtHoveredStateId) {
              (map as any).current.setFeatureState(
                {
                  source: 'admin2',
                  id: districtHoveredStateId,
                  sourceLayer: 'adm2_polygons',
                },
                { hover: false },
              );
            }
            districtHoveredStateId = e.features[0].id;
            if (e.features[0].properties.pop_no_hrea_2020 !== undefined) {
              setHoverData({
                district:
                  e.features[0].properties.adm2_name !== ' ' &&
                  e.features[0].properties.adm2_name !== '' &&
                  e.features[0].properties.adm2_name
                    ? e.features[0].properties.adm2_name
                    : e.features[0].properties.adm1_name,
                country: e.features[0].properties.adm0_name,
                pctValue: e.features[0].properties.hrea_2020 * 100,
                popValue: e.features[0].properties.pop_no_hrea_2020,
                xPosition: e.originalEvent.clientX,
                yPosition: e.originalEvent.clientY,
              });
              (map as any).current.setFeatureState(
                {
                  source: 'admin2',
                  id: districtHoveredStateId,
                  sourceLayer: 'adm2_polygons',
                },
                { hover: true },
              );
            }
          }
        },
      );
      (map as any).current.on(
        'mouseleave',
        'admin2-electricity-access-overlay',
        () => {
          if (districtHoveredStateId) {
            setHoverData(null);
            (map as any).current.setFeatureState(
              {
                source: 'admin2',
                id: districtHoveredStateId,
                sourceLayer: 'adm2_polygons',
              },
              { hover: false },
            );
          }
          districtHoveredStateId = null;
        },
      );
      (map as any).current.on('mousemove', 'projectData-circles', (e: any) => {
        (map as any).current.getCanvas().style.cursor = 'pointer';
        if (e.features.length > 0) {
          setProjectHoverData({
            text: e.features[0].properties.Title,
            xPosition: e.originalEvent.clientX,
            yPosition: e.originalEvent.clientY,
          });
          if (countryHoveredStateId) {
            (map as any).current.setFeatureState(
              {
                source: 'admin0',
                id: countryHoveredStateId,
                sourceLayer: 'adm0_polygons',
              },
              { hover: false },
            );
          }
          if (districtHoveredStateId) {
            (map as any).current.setFeatureState(
              {
                source: 'admin2',
                id: districtHoveredStateId,
                sourceLayer: 'adm2_polygons',
              },
              { hover: false },
            );
          }
          districtHoveredStateId = null;
          countryHoveredStateId = null;
          setHoverData(null);
        }
      });

      (map as any).current.on('mouseleave', 'projectData-circles', () => {
        (map as any).current.getCanvas().style.cursor = 'default';
        setProjectHoverData(null);
      });
    });
  }, []);

  useEffect(() => {
    if (map.current) {
      if ((map as any).current.getLayer('raster-labels')) {
        if (hideLabels) {
          (map as any).current.setLayoutProperty(
            'raster-labels',
            'visibility',
            'none',
          );
        } else {
          (map as any).current.setLayoutProperty(
            'raster-labels',
            'visibility',
            'visible',
          );
        }
      }
    }
  }, [hideLabels]);

  useEffect(() => {
    if (map.current) {
      if (
        (map as any).current.getLayer('admin2-electricity-access') &&
        (map as any).current.getLayer('admin2-electricity-access-population')
      ) {
        if (layer === 1) {
          (map as any).current.setLayoutProperty(
            'admin2-electricity-access',
            'visibility',
            'visible',
          );
          (map as any).current.setLayoutProperty(
            'admin2-electricity-access-population',
            'visibility',
            'none',
          );
        } else {
          (map as any).current.setLayoutProperty(
            'admin2-electricity-access',
            'visibility',
            'none',
          );
          (map as any).current.setLayoutProperty(
            'admin2-electricity-access-population',
            'visibility',
            'visible',
          );
        }
      }
    }
  }, [layer]);

  useEffect(() => {
    if (map.current) {
      if (
        (map as any).current.getLayer('admin2-electricity-access') &&
        (map as any).current.getLayer('admin2-overlay')
      ) {
        if (selectedCountry) {
          const indx = countryTaxonomy.findIndex(
            d => d['Country or Area'] === selectedCountry,
          );
          (map as any).current.setFilter('admin2-overlay', [
            'all',
            ['has', 'hrea_2020'],
            [
              '!=',
              selectedDistrict ? 'adm2_id' : 'adm0_name',
              selectedDistrict || countryTaxonomy[indx]['Country or Area'],
            ],
          ]);
          (map as any).current.flyTo({
            center: [
              countryTaxonomy[indx]['Longitude (average)'],
              countryTaxonomy[indx]['Latitude (average)'],
            ],
            zoom: 5,
          });
          (map as any).current.setFilter('admin2-electricity-access-overlay', [
            'all',
            ['has', 'hrea_2020'],
            ['==', 'adm0_name', countryTaxonomy[indx]['Country or Area']],
          ]);
          (map as any).current.setFilter('admin0-layer', [
            'all',
            ['has', 'hrea_2020'],
            ['!=', 'adm0_name', countryTaxonomy[indx]['Country or Area']],
          ]);
        } else {
          (map as any).current.setFilter('admin2-overlay', [
            'all',
            ['has', 'hrea_2020'],
            ['==', 'adm0_name', ''],
          ]);
          (map as any).current.flyTo({
            center: [25, 5],
            zoom,
          });
          (map as any).current.setFilter('admin2-electricity-access-overlay', [
            'all',
            ['has', 'hrea_2020'],
            ['==', 'adm0_name', ''],
          ]);
          (map as any).current.setFilter('admin0-layer', [
            'all',
            ['has', 'hrea_2020'],
            ['!=', 'adm0_name', ''],
          ]);
        }
      }
    }
  }, [selectedCountry, selectedDistrict]);

  useEffect(() => {
    if (map.current) {
      if (
        (map as any).current.getLayer('admin2-electricity-access') &&
        (map as any).current.getLayer('admin2-electricity-access-population')
      ) {
        (map as any).current.setFilter('admin2-electricity-access', [
          'all',
          ['has', 'hrea_2020'],
          ['<', 'hrea_2020', highlightThreshold / 100 + 0.001],
        ]);
        (map as any).current.setFilter('admin2-electricity-access-population', [
          'all',
          ['has', 'hrea_2020'],
          ['<', 'hrea_2020', highlightThreshold / 100 + 0.001],
        ]);
      }
    }
  }, [highlightThreshold]);

  useEffect(() => {
    if (map.current) {
      if ((map as any).current.getLayer('projectData-circles')) {
        (map as any).current.setLayoutProperty(
          'projectData-circles',
          'visibility',
          showProjects ? 'visible' : 'none',
        );
      }
    }
  }, [showProjects]);

  return (
    <>
      <div
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        ref={mapContainer}
      />
      {hoverData ? (
        <Tooltip
          city={hoverData.district}
          country={hoverData.country}
          popValue={hoverData.popValue}
          pctValue={hoverData.pctValue}
          xPosition={hoverData.xPosition}
          yPosition={hoverData.yPosition}
        />
      ) : null}
      {projectHoverData ? (
        <ProjectTooltip
          text={projectHoverData.text}
          xPosition={projectHoverData.xPosition}
          yPosition={projectHoverData.yPosition}
        />
      ) : null}
    </>
  );
}
