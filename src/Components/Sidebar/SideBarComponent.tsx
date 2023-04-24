/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { Checkbox, Select, Slider } from 'antd';
import { format } from 'd3-format';
import sumBy from 'lodash.sumby';
import uniqBy from 'lodash.uniqby';
import Context from '../../Context/Context';
import { LineChartForCountry } from '../LineChartForCountry';
import { LineChartForDistrict } from '../LineChartForDistrict';
import {
  AccessDataType,
  CountryProjectSummaryDataType,
  CountrySummedDataType,
  CountryTaxonomyDataType,
  CtxDataType,
} from '../../Types';

interface Props {
  accessData: AccessDataType[];
  countryTaxonomy: CountryTaxonomyDataType[];
  countryProjectSummaryData: CountryProjectSummaryDataType[];
}

export function SideBarComponent(props: Props) {
  const { countryTaxonomy, countryProjectSummaryData, accessData } = props;
  const {
    selectedCountry,
    selectedDistrict,
    highlightThreshold,
    updateSelectedCountry,
    updateSelectedDistrict,
    updateHighlightThreshold,
    updateShowPoorRegions,
  } = useContext(Context) as CtxDataType;
  const [data, setData] = useState<null | CountrySummedDataType>(null);
  const countryList = uniqBy(accessData, d => d.country).map(
    d =>
      countryTaxonomy[
        countryTaxonomy.findIndex(c => c['Alpha-3 code-1'] === d.country)
      ]['Country or Area'],
  );
  useEffect(() => {
    const filteredDataByHighlightThreshold = accessData.filter(
      d =>
        (d.popAccess[d.popAccess.findIndex(el => el.year === 2020)].value *
          100) /
          d.population <=
        highlightThreshold,
    );
    const filteredDataByCountry = selectedCountry
      ? filteredDataByHighlightThreshold.filter(
          d =>
            d.country ===
            countryTaxonomy[
              countryTaxonomy.findIndex(
                el => el['Country or Area'] === selectedCountry,
              )
            ]['Alpha-3 code-1'],
        )
      : filteredDataByHighlightThreshold;
    const AllDatLowRWI = filteredDataByCountry.filter(d => d.rwi && d.rwi < 0);
    const accessDataSummed =
      filteredDataByCountry.length > 0
        ? {
            population: sumBy(filteredDataByCountry, d => d.population),
            noOfDistricts: filteredDataByCountry.length,
            noOfDistrictsWithRWI: filteredDataByCountry.filter(
              d => d.rwi !== null && d.rwi !== undefined,
            ).length,
            totalPopulationWithRWIData: sumBy(
              filteredDataByCountry.filter(
                d => d.rwi !== null && d.rwi !== undefined,
              ),
              el => el.population,
            ),
            popAccess: [
              {
                year: 2012,
                value: sumBy(
                  filteredDataByCountry,
                  el => el.popAccess[0].value,
                ),
              },
              {
                year: 2013,
                value: sumBy(
                  filteredDataByCountry,
                  el => el.popAccess[1].value,
                ),
              },
              {
                year: 2014,
                value: sumBy(
                  filteredDataByCountry,
                  el => el.popAccess[2].value,
                ),
              },
              {
                year: 2015,
                value: sumBy(
                  filteredDataByCountry,
                  el => el.popAccess[3].value,
                ),
              },
              {
                year: 2016,
                value: sumBy(
                  filteredDataByCountry,
                  el => el.popAccess[4].value,
                ),
              },
              {
                year: 2017,
                value: sumBy(
                  filteredDataByCountry,
                  el => el.popAccess[5].value,
                ),
              },
              {
                year: 2018,
                value: sumBy(
                  filteredDataByCountry,
                  el => el.popAccess[6].value,
                ),
              },
              {
                year: 2019,
                value: sumBy(
                  filteredDataByCountry,
                  el => el.popAccess[7].value,
                ),
              },
              {
                year: 2020,
                value: sumBy(
                  filteredDataByCountry,
                  el => el.popAccess[8].value,
                ),
              },
            ],
            populationLowRWI: sumBy(AllDatLowRWI, d => d.population),
            popAccessLowRWI: [
              {
                year: 2012,
                value: sumBy(AllDatLowRWI, el => el.popAccess[0].value),
              },
              {
                year: 2013,
                value: sumBy(AllDatLowRWI, el => el.popAccess[1].value),
              },
              {
                year: 2014,
                value: sumBy(AllDatLowRWI, el => el.popAccess[2].value),
              },
              {
                year: 2015,
                value: sumBy(AllDatLowRWI, el => el.popAccess[3].value),
              },
              {
                year: 2016,
                value: sumBy(AllDatLowRWI, el => el.popAccess[4].value),
              },
              {
                year: 2017,
                value: sumBy(AllDatLowRWI, el => el.popAccess[5].value),
              },
              {
                year: 2018,
                value: sumBy(AllDatLowRWI, el => el.popAccess[6].value),
              },
              {
                year: 2019,
                value: sumBy(AllDatLowRWI, el => el.popAccess[7].value),
              },
              {
                year: 2020,
                value: sumBy(AllDatLowRWI, el => el.popAccess[8].value),
              },
            ],
          }
        : null;
    setData(accessDataSummed);
  }, [selectedCountry, selectedDistrict, highlightThreshold, accessData]);
  return (
    <>
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
              accessData[
                accessData.findIndex(d => d.adm2_id === selectedDistrict)
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
          <Checkbox
            className='undp-checkbox margin-top-05'
            onChange={e => {
              updateShowPoorRegions(e.target.checked);
            }}
          >
            Show Poor Regions Only*
          </Checkbox>
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
                ? `${(
                    (data.popAccess[8].value * 100) /
                    data.population
                  ).toFixed(2)}%`
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
                    Math.round(data.population - data.popAccess[8].value),
                  ).replaceAll(',', ' ')
                : 'loading...'}
            </h5>
            <p className='undp-typography small-font margin-bottom-02'>
              <span className='bold'>
                {data ? (
                  <>
                    {format(',')(
                      Math.round(
                        data.populationLowRWI - data.popAccessLowRWI[8].value,
                      ),
                    ).replaceAll(',', ' ')}{' '}
                    (
                    {(
                      ((data.populationLowRWI - data.popAccessLowRWI[8].value) *
                        100) /
                      (data.population - data.popAccess[8].value)
                    ).toFixed(1)}
                    % )
                  </>
                ) : (
                  'loading...'
                )}
              </span>{' '}
              belong to poor regions*
            </p>
            {data ? (
              <p className='undp-typography small-font italics'>
                {data.noOfDistrictsWithRWI} out of {data.noOfDistricts} have RWI
                data which covers{' '}
                {(
                  (data.totalPopulationWithRWIData * 100) /
                  data.population
                ).toFixed(1)}
                % population
              </p>
            ) : null}
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
            {accessData
              .filter(
                d =>
                  d.country ===
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
          <Checkbox
            className='undp-checkbox margin-top-05'
            onChange={e => {
              updateShowPoorRegions(e.target.checked);
            }}
          >
            Show Poor Regions Only*
          </Checkbox>
          <hr className='undp-style margin-top-07 margin-bottom-07' />
          <div className='margin-bottom-07'>
            <h6 className='undp-typography margin-bottom-03'>
              Percent With Access to Reliable Electricity Services (2020)
            </h6>
            <h5 className='undp-typography bold'>
              {data
                ? `${(
                    (data.popAccess[8].value * 100) /
                    data.population
                  ).toFixed(2)}%`
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
                    Math.round(data.population - data.popAccess[8].value),
                  ).replaceAll(',', ' ')
                : 'loading...'}
            </h5>
            <p className='undp-typography small-font margin-bottom-02'>
              <span className='bold'>
                {data ? (
                  <>
                    {format(',')(
                      Math.round(
                        data.populationLowRWI - data.popAccessLowRWI[8].value,
                      ),
                    ).replaceAll(',', ' ')}{' '}
                    (
                    {(
                      ((data.populationLowRWI - data.popAccessLowRWI[8].value) *
                        100) /
                      (data.population - data.popAccess[8].value)
                    ).toFixed(1)}
                    % )
                  </>
                ) : (
                  'loading...'
                )}
              </span>{' '}
              belong to poor regions
            </p>
            {data ? (
              <p className='undp-typography small-font italics'>
                {data.noOfDistrictsWithRWI} out of {data.noOfDistricts} have RWI
                data which covers{' '}
                {(
                  (data.totalPopulationWithRWIData * 100) /
                  data.population
                ).toFixed(1)}
                % population
              </p>
            ) : null}
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
              {accessData.findIndex(
                (d: any) => d.adm2_id === selectedDistrict,
              ) !== -1
                ? `${
                    accessData[
                      accessData.findIndex(d => d.adm2_id === selectedDistrict)
                    ].popAccess[
                      accessData[
                        accessData.findIndex(
                          d => d.adm2_id === selectedDistrict,
                        )
                      ].popAccess.findIndex(el => el.year === 2020)
                    ].value
                      ? (
                          (accessData[
                            accessData.findIndex(
                              d => d.adm2_id === selectedDistrict,
                            )
                          ].popAccess[
                            accessData[
                              accessData.findIndex(
                                d => d.adm2_id === selectedDistrict,
                              )
                            ].popAccess.findIndex(el => el.year === 2020)
                          ].value *
                            100) /
                          accessData[
                            accessData.findIndex(
                              (d: any) => d.adm2_id === selectedDistrict,
                            )
                          ].population
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
              {accessData.findIndex(
                (d: any) => d.adm2_id === selectedDistrict,
              ) !== -1
                ? `${
                    accessData[
                      accessData.findIndex(d => d.adm2_id === selectedDistrict)
                    ].popAccess[
                      accessData[
                        accessData.findIndex(
                          d => d.adm2_id === selectedDistrict,
                        )
                      ].popAccess.findIndex(el => el.year === 2020)
                    ].value
                      ? format(',')(
                          Math.round(
                            accessData[
                              accessData.findIndex(
                                d => d.adm2_id === selectedDistrict,
                              )
                            ].population -
                              accessData[
                                accessData.findIndex(
                                  d => d.adm2_id === selectedDistrict,
                                )
                              ].popAccess[
                                accessData[
                                  accessData.findIndex(
                                    d => d.adm2_id === selectedDistrict,
                                  )
                                ].popAccess.findIndex(el => el.year === 2020)
                              ].value,
                          ),
                        ).replaceAll(',', ' ')
                      : format(',')(
                          Math.round(
                            accessData[
                              accessData.findIndex(
                                d => d.adm2_id === selectedDistrict,
                              )
                            ].population as number,
                          ),
                        ).replaceAll(',', ' ')
                  }`
                : 'NA'}
            </h5>
          </div>
          <h6 className='undp-typography'>TimeSeries Data</h6>
          <h5 className='undp-typography bold'>
            {accessData.findIndex(d => d.adm2_id === selectedDistrict) !==
            -1 ? (
              <LineChartForDistrict
                data={
                  accessData[
                    accessData.findIndex(d => d.adm2_id === selectedDistrict)
                  ]
                }
              />
            ) : (
              'NA'
            )}
          </h5>
        </div>
      ) : null}
    </>
  );
}
