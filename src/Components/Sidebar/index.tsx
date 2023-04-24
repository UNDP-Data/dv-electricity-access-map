/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import styled from 'styled-components';
import Context from '../../Context/Context';
import {
  CountryProjectSummaryDataType,
  CountryTaxonomyDataType,
  CtxDataType,
} from '../../Types';
import { SideBarComponent } from './SideBarComponent';

interface Props {
  countryTaxonomy: CountryTaxonomyDataType[];
  countryProjectSummaryData: CountryProjectSummaryDataType[];
}

const SideBarEl = styled.div`
  position: absolute;
  padding: 2rem;
  z-index: 5;
  margin: 1rem 0 0 1rem;
  background-color: rgba(255, 255, 255, 0.75);
  width: 25rem;
  max-height: calc(100vh - 11rem);
  overflow: auto;
`;

export function SideBar(props: Props) {
  const { countryTaxonomy, countryProjectSummaryData } = props;
  const { accessData } = useContext(Context) as CtxDataType;
  return (
    <SideBarEl className='undp-scrollbar'>
      {accessData ? (
        <SideBarComponent
          countryTaxonomy={countryTaxonomy}
          accessData={accessData}
          countryProjectSummaryData={countryProjectSummaryData}
        />
      ) : (
        <div
          className='flex-div flex-hor-align-center flex-vert-align-center'
          style={{
            height: '10rem',
          }}
        >
          <div className='undp-loader' />
        </div>
      )}
    </SideBarEl>
  );
}
