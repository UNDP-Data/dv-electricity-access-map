/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components';
import { useContext, useEffect, useState } from 'react';
import { format } from 'd3-format';
import { Radio, Space, Checkbox } from 'antd';
import { queue } from 'd3-queue';
import { json } from 'd3-request';
import UNDPColorModule from 'undp-viz-colors';
import { MapEl } from './Map';
import { POP_RANGE, PCT_RANGE } from '../Constants';
import {
  AccessDataType,
  CountryProjectSummaryDataType,
  CountryTaxonomyDataType,
  CtxDataType,
  ProjectDataType,
} from '../Types';
import Context from '../Context/Context';
import { SideBar } from './SideBar';

const KeyEl = styled.div`
  padding: 1rem;
  position: absolute;
  z-index: 5;
  bottom: 0;
  right: 0;
  margin: 0 1rem 1rem 0;
  background-color: rgba(255, 255, 255, 0.75);
  div {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
`;

const LayerSelectorEl = styled.div`
  padding: 1rem;
  position: absolute;
  right: 0;
  margin: 1rem 1rem 0 0;
  z-index: 5;
  background-color: rgba(255, 255, 255, 0.75);
  float: right;
`;

export function MapContainer() {
  const { layer, updateLayer, updateShowProjects, updateHideLabels } =
    useContext(Context) as CtxDataType;
  const [accessDataForDistrict, setAccessDataForDistrict] = useState<
    undefined | AccessDataType[]
  >(undefined);
  const [countryProjectSummaryData, setCountryProjectSummaryData] = useState<
    undefined | CountryProjectSummaryDataType[]
  >(undefined);
  const [countryTaxonomy, setCountryTaxonomy] = useState<
    undefined | CountryTaxonomyDataType[]
  >(undefined);
  const [projectDataShape, setProjectDataShape] = useState<any>(undefined);
  const keyBarWid = 40;
  useEffect(() => {
    queue()
      .defer(
        json,
        'https://raw.githubusercontent.com/UNDP-Data/Electricity-Access-HREA-Map/master/src/Data/accessDataDistrict.json',
      )
      .defer(
        json,
        'https://raw.githubusercontent.com/UNDP-Data/country-taxonomy-from-azure/main/country_territory_groups.json',
      )
      .defer(
        json,
        'https://raw.githubusercontent.com/UNDP-Data/Electricity-Access-HREA-Map/master/src/Data/countryProjectSummary.json',
      )
      .defer(
        json,
        'https://raw.githubusercontent.com/UNDP-Data/Electricity-Access-HREA-Map/master/src/Data/projectData.json',
      )
      .await(
        (
          err: unknown,
          AccessDataForDistricts: AccessDataType[],
          CountryTaxonomy: CountryTaxonomyDataType[],
          CountryProjectSummaryData: CountryProjectSummaryDataType[],
          ProjectData: ProjectDataType[],
        ) => {
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          if (err) throw err;
          const projectDataGeoJson = ProjectData.map((project, i: number) => ({
            type: 'Feature',
            properties: {
              Title: project.Title,
            },
            geometry: {
              type: 'Point',
              coordinates: [project.Longitude, project.Latitude],
            },
            id: i,
          }));
          setProjectDataShape(projectDataGeoJson);
          setAccessDataForDistrict(AccessDataForDistricts);
          setCountryProjectSummaryData(CountryProjectSummaryData);
          setCountryTaxonomy(CountryTaxonomy);
        },
      );
  }, []);

  return (
    <div
      style={{
        height: window.location.href.includes('data.undp.org')
          ? '80rem'
          : 'calc(100vh - 80px)',
        position: 'relative',
      }}
    >
      {projectDataShape &&
      accessDataForDistrict &&
      countryTaxonomy &&
      countryProjectSummaryData ? (
        <SideBar
          accessDataForDistrict={accessDataForDistrict}
          countryTaxonomy={countryTaxonomy}
          countryProjectSummaryData={countryProjectSummaryData}
        />
      ) : null}
      <LayerSelectorEl>
        <p className='label'>Select A Layer</p>
        <Radio.Group
          onChange={e => {
            updateLayer(e.target.value);
          }}
          value={layer}
        >
          <Space direction='vertical'>
            <Radio className='undp-radio' value={1}>
              Access to Reliable Energy Services
            </Radio>
            <Radio className='undp-radio' value={2}>
              No. of People Without Reliable Energy Services
            </Radio>
          </Space>
        </Radio.Group>
        <hr className='undp-style margin-top-05 margin-bottom-05' />
        <h6 className='undp-typography margin-bottom-05'>Settings</h6>
        <Space direction='vertical'>
          <Checkbox
            className='undp-checkbox'
            onChange={e => {
              updateShowProjects(e.target.checked);
            }}
          >
            Show Active UNDP Projects
            <sup>[2]</sup>
          </Checkbox>
          <Checkbox
            className='undp-checkbox'
            onChange={e => {
              updateHideLabels(e.target.checked);
            }}
          >
            Hide Labels
          </Checkbox>
        </Space>
      </LayerSelectorEl>
      {projectDataShape && countryTaxonomy ? (
        <MapEl
          countryTaxonomy={countryTaxonomy}
          projectShapeData={projectDataShape}
        />
      ) : (
        <div
          className='flex-div flex-hor-align-center flex-vert-align-center'
          style={{
            height: window.location.href.includes('data.undp.org')
              ? '80rem'
              : 'calc(100vh - 80px)',
          }}
        >
          <div className='undp-loader' />
        </div>
      )}
      <KeyEl>
        <div>
          {layer === 1
            ? '%age Access to Reliable Electricity Services'
            : 'Population Without Access to Reliable Electricity Services'}
        </div>
        {layer === 1 ? (
          <svg
            height={25}
            width={UNDPColorModule.divergentColors.colorsx10.length * keyBarWid}
          >
            {UNDPColorModule.divergentColors.colorsx10.map(
              (_d: string, i: number) => (
                <rect
                  key={i}
                  x={i * keyBarWid}
                  height={10}
                  y={0}
                  width={keyBarWid}
                  fill={UNDPColorModule.divergentColors.colorsx10[9 - i]}
                />
              ),
            )}
            {PCT_RANGE.map((d: number, i: number) => (
              <text
                key={i}
                x={(i + 1) * keyBarWid}
                y={23}
                textAnchor='middle'
                fontSize={10}
              >
                {d}%
              </text>
            ))}
            <text x={440} y={23} textAnchor='end' fontSize={10}>
              100%
            </text>
            <text x={0} y={23} textAnchor='start' fontSize={10}>
              0%
            </text>
          </svg>
        ) : (
          <svg
            height={25}
            width={
              UNDPColorModule.sequentialColors.negativeColorsx06.length *
              keyBarWid
            }
          >
            {UNDPColorModule.sequentialColors.negativeColorsx06.map(
              (d: string, i: number) => (
                <rect
                  key={i}
                  x={i * keyBarWid}
                  height={10}
                  y={0}
                  width={keyBarWid}
                  fill={d}
                />
              ),
            )}
            {POP_RANGE.map((d: number, i: number) => (
              <text
                key={i}
                x={(i + 1) * keyBarWid}
                y={23}
                textAnchor='middle'
                fontSize={10}
              >
                {d < 1000
                  ? format(',')(d).replace(',', ' ')
                  : format('.1s')(d).replace('G', 'B')}
              </text>
            ))}
          </svg>
        )}
      </KeyEl>
    </div>
  );
}
