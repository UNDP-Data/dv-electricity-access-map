/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { Select, Slider } from 'antd';
import { format } from 'd3-format';
import styled from 'styled-components';
import sumBy from 'lodash.sumby';
import uniqBy from 'lodash.uniqby';
import Context from '../Context/Context';
import { LineChartForCountry } from './LineChartForCountry';
import { LineChartForDistrict } from './LineChartForDistrict';
import {
  AccessDataType,
  CountryProjectSummaryDataType,
  CountryTaxonomyDataType,
  CtxDataType,
} from '../Types';

interface Props {
  accessDataForDistrict: AccessDataType[];
  countryTaxonomy: CountryTaxonomyDataType[];
  countryProjectSummaryData: CountryProjectSummaryDataType[];
}

interface DataType {
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

const SideBarEl = styled.div`
  position: absolute;
  padding: 2rem;
  z-index: 5;
  margin: 1rem 0 0 1rem;
  background-color: rgba(255, 255, 255, 0.75);
  width: 25rem;
  max-height: 80vh;
  overflow: auto;
`;

export function SideBar(props: Props) {
  const { accessDataForDistrict, countryTaxonomy, countryProjectSummaryData } =
    props;
  const {
    selectedCountry,
    selectedDistrict,
    highlightThreshold,
    updateSelectedCountry,
    updateSelectedDistrict,
    updateHighlightThreshold,
  } = useContext(Context) as CtxDataType;
  const [data, setData] = useState<null | DataType>(null);
  const countryList = uniqBy(accessDataForDistrict, d =>
    d.adm2_id.substring(0, 3),
  ).map(
    d =>
      countryTaxonomy[
        countryTaxonomy.findIndex(
          c => c['Alpha-3 code-1'] === d.adm2_id.substring(0, 3),
        )
      ]['Country or Area'],
  );
  useEffect(() => {
    const filteredDataByHighlightThreshold = accessDataForDistrict.filter(
      d => (d.PopAccess2020 * 100) / d.TotPopulation <= highlightThreshold,
    );
    const filteredDataByCountry = selectedCountry
      ? filteredDataByHighlightThreshold.filter(
          d =>
            d.adm2_id.substring(0, 3) ===
            countryTaxonomy[
              countryTaxonomy.findIndex(
                el => el['Country or Area'] === selectedCountry,
              )
            ]['Alpha-3 code-1'],
        )
      : filteredDataByHighlightThreshold;
    const AllDatLowRWI = filteredDataByCountry.filter(d => d.RWI && d.RWI < 0);
    const accessDataSummed =
      filteredDataByCountry.length > 0
        ? {
            TotPopulation: sumBy(filteredDataByCountry, 'TotPopulation'),
            PopAccess2020: sumBy(filteredDataByCountry, 'PopAccess2020'),
            PopAccess2019: sumBy(filteredDataByCountry, 'PopAccess2019'),
            PopAccess2018: sumBy(filteredDataByCountry, 'PopAccess2018'),
            PopAccess2017: sumBy(filteredDataByCountry, 'PopAccess2017'),
            PopAccess2016: sumBy(filteredDataByCountry, 'PopAccess2016'),
            PopAccess2015: sumBy(filteredDataByCountry, 'PopAccess2015'),
            PopAccess2014: sumBy(filteredDataByCountry, 'PopAccess2014'),
            PopAccess2013: sumBy(filteredDataByCountry, 'PopAccess2013'),
            PopAccess2012: sumBy(filteredDataByCountry, 'PopAccess2012'),
            TotPopulationLowRWI: sumBy(AllDatLowRWI, 'TotPopulation'),
            PopAccess2020LowRWI: sumBy(AllDatLowRWI, 'PopAccess2020'),
            PopAccess2019LowRWI: sumBy(AllDatLowRWI, 'PopAccess2019'),
            PopAccess2018LowRWI: sumBy(AllDatLowRWI, 'PopAccess2018'),
            PopAccess2017LowRWI: sumBy(AllDatLowRWI, 'PopAccess2017'),
            PopAccess2016LowRWI: sumBy(AllDatLowRWI, 'PopAccess2016'),
            PopAccess2015LowRWI: sumBy(AllDatLowRWI, 'PopAccess2015'),
            PopAccess2014LowRWI: sumBy(AllDatLowRWI, 'PopAccess2014'),
            PopAccess2013LowRWI: sumBy(AllDatLowRWI, 'PopAccess2013'),
            PopAccess2012LowRWI: sumBy(AllDatLowRWI, 'PopAccess2012'),
          }
        : null;
    setData(accessDataSummed);
  }, [selectedCountry, selectedDistrict, highlightThreshold]);
  return (
    <SideBarEl className='undp-scrollbar'>
      {selectedDistrict ? (
        <button
          type='button'
          className='undp-button button-tertiary'
          onClick={() => {
            updateSelectedDistrict(undefined);
          }}
        >
          {`← Back to ${selectedCountry}`}
        </button>
      ) : selectedCountry ? (
        <button
          type='button'
          className='undp-button button-tertiary'
          onClick={() => {
            updateSelectedCountry(undefined);
          }}
        >
          ← Back to Global View
        </button>
      ) : null}
      <h3 className='undp-typography margin-bottom-04'>
        {selectedDistrict ? (
          <>
            {
              accessDataForDistrict[
                accessDataForDistrict.findIndex(
                  d => d.adm2_id === selectedDistrict,
                )
              ]?.adm2_name
            }{' '}
            <span className='small-font'>({selectedCountry})</span>
          </>
        ) : (
          selectedCountry || 'World'
        )}
      </h3>
      {!selectedCountry && !selectedDistrict ? (
        <div>
          <p className='label'>Select Country</p>
          <Select
            showSearch
            placeholder='Select a country'
            className='undp-select'
            onChange={d => {
              updateSelectedCountry(d);
            }}
          >
            {countryList.map((d, i) => (
              <Select.Option key={i} className='undp-select-option' value={d}>
                {d}
              </Select.Option>
            ))}
          </Select>
          <h6 className='undp-typography margin-bottom-02 margin-top-07'>
            {'Showing Region with Access <= '}
            <span className='bold'>{highlightThreshold}%</span>
          </h6>
          <Slider
            className='undp-slider'
            defaultValue={highlightThreshold}
            min={1}
            max={100}
            onAfterChange={d => {
              updateHighlightThreshold(d);
            }}
          />
          <hr className='undp-style margin-top-07 margin-bottom-07' />
          <p
            className='undp-typography margin-bottom-07'
            style={{ fontSize: '0.875rem' }}
          >
            Data is calculated for {countryList.length} countries.{' '}
            <span className='italics'>
              Click on a country to explore data for the country
            </span>
          </p>
          <div className='margin-bottom-07'>
            <h6 className='undp-typography margin-bottom-03'>
              Percent access to reliable energy services (2020)
            </h6>
            <h5 className='undp-typography bold'>
              {data
                ? `${((data.PopAccess2020 * 100) / data.TotPopulation).toFixed(
                    2,
                  )}%`
                : 'loading...'}
            </h5>
          </div>
          <div className='margin-bottom-07'>
            <h6 className='undp-typography margin-bottom-03'>
              No. Of People Without Access to Reliable Energy Services (2020)
            </h6>
            <h5 className='undp-typography bold margin-bottom-01'>
              {data
                ? format(',')(
                    Math.round(data.TotPopulation - data.PopAccess2020),
                  ).replaceAll(',', ' ')
                : 'loading...'}
            </h5>
            <p className='undp-typography small-font'>
              <span className='bold'>
                {data ? (
                  <>
                    {format(',')(
                      Math.round(
                        data.TotPopulationLowRWI - data.PopAccess2020LowRWI,
                      ),
                    ).replaceAll(',', ' ')}{' '}
                    (
                    {(
                      ((data.TotPopulationLowRWI - data.PopAccess2020LowRWI) *
                        100) /
                      (data.TotPopulation - data.PopAccess2020)
                    ).toFixed(1)}
                    % )
                  </>
                ) : (
                  'loading...'
                )}
              </span>{' '}
              belong to poor regions
            </p>
          </div>
          <h6 className='undp-typography'>TimeSeries Data</h6>
          {data ? <LineChartForCountry data={data} /> : 'NA'}
        </div>
      ) : null}
      {selectedCountry && !selectedDistrict ? (
        <div>
          <p className='label'>Select District</p>
          <Select
            showSearch
            placeholder='Select a District'
            className='undp-select'
            onChange={d => {
              updateSelectedDistrict(d.split(' | ')[0]);
            }}
          >
            {accessDataForDistrict
              .filter(
                d =>
                  d.adm2_id.substring(0, 3) ===
                  countryTaxonomy[
                    countryTaxonomy.findIndex(
                      el => el['Country or Area'] === selectedCountry,
                    )
                  ]['Alpha-3 code-1'],
              )
              .map((d, i) => (
                <Select.Option
                  key={i}
                  className='undp-select-option'
                  value={`${d.adm2_id} | ${d.adm2_name}`}
                >
                  {d.adm2_name}
                </Select.Option>
              ))}
          </Select>
          <h6 className='undp-typography margin-bottom-02 margin-top-07'>
            {'Showing Region with Access <= '}
            <span className='bold'>{highlightThreshold}%</span>
          </h6>
          <Slider
            className='undp-slider'
            defaultValue={highlightThreshold}
            min={1}
            max={100}
            onAfterChange={d => {
              updateHighlightThreshold(d);
            }}
          />
          <hr className='undp-style margin-top-07 margin-bottom-07' />
          <div className='margin-bottom-07'>
            <h6 className='undp-typography margin-bottom-03'>
              Percent With Access to Reliable Electricity Services (2020)
            </h6>
            <h5 className='undp-typography bold'>
              {data
                ? `${((data.PopAccess2020 * 100) / data.TotPopulation).toFixed(
                    2,
                  )}%`
                : 'loading...'}
            </h5>
          </div>
          <div className='margin-bottom-07'>
            <h6 className='undp-typography margin-bottom-03'>
              No. Of People Without Access to Reliable Electricity Services
              (2020)
            </h6>
            <h5 className='undp-typography bold margin-bottom-01'>
              {data
                ? format(',')(
                    Math.round(data.TotPopulation - data.PopAccess2020),
                  ).replaceAll(',', ' ')
                : 'loading...'}
            </h5>
            <p className='undp-typography small-font'>
              <span className='bold'>
                {data ? (
                  <>
                    {format(',')(
                      Math.round(
                        data.TotPopulationLowRWI - data.PopAccess2020LowRWI,
                      ),
                    ).replaceAll(',', ' ')}{' '}
                    (
                    {(
                      ((data.TotPopulationLowRWI - data.PopAccess2020LowRWI) *
                        100) /
                      (data.TotPopulation - data.PopAccess2020)
                    ).toFixed(1)}
                    % )
                  </>
                ) : (
                  'loading...'
                )}
              </span>{' '}
              belong to poor regions
            </p>
          </div>
          <div className='margin-bottom-07'>
            <h6 className='undp-typography'>TimeSeries Data</h6>
            <h5 className='undp-typography bold'>
              {data ? <LineChartForCountry data={data} /> : 'NA'}
            </h5>
          </div>
          <div>
            <hr className='undp-style margin-bottom-07' />
            <h6 className='undp-typography'>
              UNDP Active Projects Summary in {selectedCountry}
            </h6>
            <div className='flex-div flex-space-between flex-vert-align-center'>
              <p className='undp-typography'>No. of Projects</p>
              <p className='undp-typography bold'>
                {countryProjectSummaryData.findIndex(
                  d => d['Lead Country'] === selectedCountry,
                ) === -1
                  ? 'NA'
                  : countryProjectSummaryData[
                      countryProjectSummaryData.findIndex(
                        d => d['Lead Country'] === selectedCountry,
                      )
                    ]['Number of projects']}
              </p>
            </div>
            <div className='flex-div flex-space-between flex-vert-align-center'>
              <p className='undp-typography'>No. of People Benefitting</p>
              <p className='undp-typography bold'>
                {countryProjectSummaryData.findIndex(
                  d => d['Lead Country'] === selectedCountry,
                ) === -1
                  ? 'NA'
                  : !countryProjectSummaryData[
                      countryProjectSummaryData.findIndex(
                        d => d['Lead Country'] === selectedCountry,
                      )
                    ]['People directly benefiting']
                  ? 'NA'
                  : `${format(',')(
                      countryProjectSummaryData[
                        countryProjectSummaryData.findIndex(
                          d => d['Lead Country'] === selectedCountry,
                        )
                      ]['People directly benefiting'] as number,
                    ).replaceAll(',', ' ')}`}
              </p>
            </div>
          </div>
        </div>
      ) : null}
      {selectedDistrict ? (
        <div>
          <hr className='undp-style margin-top-07 margin-bottom-07' />
          <div className='margin-bottom-07'>
            <h6 className='undp-typography margin-bottom-03'>
              Percent Access to Reliable Electricity Services (2020)
            </h6>
            <h5 className='undp-typography bold'>
              {accessDataForDistrict.findIndex(
                (d: any) => d.adm2_id === selectedDistrict,
              ) !== -1
                ? `${
                    accessDataForDistrict[
                      accessDataForDistrict.findIndex(
                        d => d.adm2_id === selectedDistrict,
                      )
                    ].PopAccess2020
                      ? (
                          (accessDataForDistrict[
                            accessDataForDistrict.findIndex(
                              d => d.adm2_id === selectedDistrict,
                            )
                          ].PopAccess2020 *
                            100) /
                          accessDataForDistrict[
                            accessDataForDistrict.findIndex(
                              (d: any) => d.adm2_id === selectedDistrict,
                            )
                          ].TotPopulation
                        ).toFixed(1)
                      : 0
                  } %`
                : 'NA'}
            </h5>
          </div>
          <div className='margin-bottom-07'>
            <h6 className='undp-typography margin-bottom-03'>
              No. Of People Without Access to Reliable Energy Services (2020)
            </h6>
            <h5 className='undp-typography bold'>
              {accessDataForDistrict.findIndex(
                (d: any) => d.adm2_id === selectedDistrict,
              ) !== -1
                ? `${
                    accessDataForDistrict[
                      accessDataForDistrict.findIndex(
                        d => d.adm2_id === selectedDistrict,
                      )
                    ].PopAccess2020
                      ? format(',')(
                          Math.round(
                            accessDataForDistrict[
                              accessDataForDistrict.findIndex(
                                d => d.adm2_id === selectedDistrict,
                              )
                            ].TotPopulation -
                              accessDataForDistrict[
                                accessDataForDistrict.findIndex(
                                  d => d.adm2_id === selectedDistrict,
                                )
                              ].PopAccess2020,
                          ),
                        ).replaceAll(',', ' ')
                      : format(',')(
                          Math.round(
                            accessDataForDistrict[
                              accessDataForDistrict.findIndex(
                                d => d.adm2_id === selectedDistrict,
                              )
                            ].TotPopulation as number,
                          ),
                        ).replaceAll(',', ' ')
                  }`
                : 'NA'}
            </h5>
          </div>
          <h6 className='undp-typography'>TimeSeries Data</h6>
          <h5 className='undp-typography bold'>
            {accessDataForDistrict.findIndex(
              d => d.adm2_id === selectedDistrict,
            ) !== -1 ? (
              <LineChartForDistrict
                data={
                  accessDataForDistrict[
                    accessDataForDistrict.findIndex(
                      d => d.adm2_id === selectedDistrict,
                    )
                  ]
                }
              />
            ) : (
              'NA'
            )}
          </h5>
        </div>
      ) : null}
    </SideBarEl>
  );
}
