import { styled } from '@mui/system';
import React, { HTMLAttributes, useState } from 'react';
import { Typography } from '../../components/Typography';
import { useUserStore } from '../../globalState/user';
import axios from '../../utils/axios';
import Can from '../../components/Can';
import { CASLAction } from '../../utils/ability.util';
import { TenantProfile } from './components/TenantProfile';
import { PropertyView } from './components/PropertyView';

const state: IGridState = {
  loading: true,
  rows: [],
  totalRows: 0,
  rowsPerPageOptions: [5],
  pageSize: 5,
  page: 1,
  rowCount: 0,
  sort: 'created_at',
  asc: true,
  selectedIds: [],
  search: '',
  totalDocsUnfiltered: 0
};

export const StarredMatches = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const [list, setList] = useState<IGridState>({
    ...state
  });
  const { auth } = useUserStore();

  React.useEffect(() => {
    getMatches();
  }, []);

  const getMatches = async () => {
    const { search, asc, sort, pageSize, page } = list;
    const { data } = await axios(auth.access_token).get('/api/match?starred=true', {
      params: {
        page: page || undefined,
        pageSize: pageSize,
        sort: sort || undefined,
        asc: asc.toString() || undefined,
        status: search || undefined
      }
    });
    setList((prevList: IGridState) => ({
      ...prevList,
      rows: data.docs,
      totalRows: data.totalDocs,
      loading: false
    }));
  };

  return (
    <div className={`starred-matches ${className}`}>
      <Typography variant='body1'>Starred matches</Typography>

      <Can do={CASLAction.Read} on='StarredTenants'>
        <div className='tenants-tab'>
          <Typography variant='body5'>You will only see starred matches from your current search.</Typography>
          <div className='tenants'>
            {list.rows.map((match: any, tenantIndex) => {
              const { tenant } = match;
              return tenant ? <TenantProfile tenant={tenant} key={tenantIndex} /> : null;
            })}
          </div>
        </div>
      </Can>

      <Can do={CASLAction.Read} on='StarredProperties'>
        <div className='properties-tab'>
          <Typography variant='body5'>You will only see starred matches from your current search.</Typography>
          <div className='properties'>
            {list.rows.map((match: any, idx) => {
              const { property } = match;
              return property ? <PropertyView property={property} key={idx} /> : null;
            })}
          </div>
        </div>
      </Can>
    </div>
  );
})`
  &.starred-matches {
    display: grid;
    row-gap: 32px;

    .tab {
      width: 100px;
    }

    .tenants-tab {
      display: grid;
      row-gap: 32px;
      .tenants {
        display: flex;
        flex-wrap: wrap;
        column-gap: 24px;
        row-gap: 24px;
        .tenant {
          display: grid;
          justify-items: center;
          row-gap: 8px;
          align-content: flex-start;

          .profile-image {
            height: 208px;
            width: 208px;
          }

          .tenant-name {
            font-weight: 700;
            display: grid;
            grid-template-columns: max-content min-content;
            align-items: center;
            column-gap: 8px;
          }
        }
      }
    }

    .properties-tab {
      display: grid;
      row-gap: 32px;

      .properties {
        display: flex;
        flex-wrap: wrap;
        column-gap: 24px;
        row-gap: 24px;
        .starred-property {
          border-radius: 16px;
          display: flex;
          aspect-ratio: 1.35 / 1;
          height: 326px;
          position: relative;

          .property-background-image {
            position: absolute;
            border-radius: 16px;
          }

          .property-footer {
            background: rgba(38, 38, 38, 0.7);
            backdrop-filter: blur(10px);
            align-self: flex-end;
            width: 100%;
            border-radius: 0 0 16px 16px;
            padding: 16px;
            box-sizing: border-box;
            row-gap: 8px;
            display: flex;
            flex-direction: column;
            .property-title {
              color: white;
              font-weight: 700;
            }

            .details {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .match-percentage {
                background-color: #e5155a;
                border-radius: 8px;
                color: white;
                padding: 4px 8px;
                box-sizing: border-box;
                font-weight: 700;
              }
            }
          }
        }
      }
    }
  }
`;
