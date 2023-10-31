import React from 'react';
import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';

import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Backdrop } from '../../components/Backdrop';

import { Header } from '../HomeLoggedIn/Header';
import { Footer } from '../Home/Footer';
import axios from '../../utils/axios';
import { Property } from './Property/Property';

import { NewProperty } from './NewProperty/NewProperty';
import { useUserStore } from '../../globalState/user';
import { useLocation } from 'react-router-dom';
import propertiesBackground from '../Home/home-background.png';
import { Tab, Tabs } from '../../components/Tab';
import { Role } from '../../enums';
import { TenantsMatchingHeader } from '../Matches/MatchesTenants/TenantsMatchingHeader';
import { PropertiesMatchingHeader } from '../Matches/MatchesProperties/PropertiesMatchingHeader';
import { useProfileStore } from '../../globalState/profile';

const state: IGridState = {
  loading: true,
  rows: [],
  totalRows: 0,
  rowsPerPageOptions: [10, 20, 50],
  pageSize: 20,
  page: 1,
  rowCount: 0,
  sort: 'updated_at',
  asc: false,
  selectedIds: [],
  search: '',
  totalDocsUnfiltered: 0
};
export const Properties = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const [list, setList] = React.useState<IGridState>({
    ...state
  });

  const [showNewPropertyModal, setShowNewPropertyModal] = React.useState<boolean>(false);
  const [editPropertyId, setEditPropertyId] = React.useState<string | undefined>(undefined);

  const [statusTab, setStatusTab] = React.useState(0);

  const { auth } = useUserStore();

  const queryParams = new URLSearchParams(useLocation().search);

  const profileStore = useProfileStore();

  React.useEffect(() => {
    setList((list) => ({
      ...list,
      search: { '0': undefined, '1': 'published', '2': 'rented' }[statusTab]
    }));
  }, [statusTab]);

  React.useEffect(() => {
    getAssets();
    if (queryParams.get('newProperty')) {
      setShowNewPropertyModal(true);
    }
  }, [list.search]);

  const getAssets = async () => {
    setList((prevList: any) => ({
      ...prevList,
      loading: true
    }));
    try {
      const { search, asc, sort, pageSize, page } = list;

      const { data } = await axios(auth.access_token).get('/api/asset', {
        params: {
          page: page || undefined,
          pageSize: pageSize,
          sort: sort || undefined,
          asc: asc.toString() || undefined,
          status: search || undefined
        }
      });

      setList((prevList: any) => ({
        ...prevList,
        rows: data.docs,
        totalRows: data.totalDocs,
        loading: false,
        totalDocsUnfiltered: data.totalDocsUnfiltered
      }));
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className={`properties-page ${className}`}>
      <Header
        middleContent={
          <>
            {profileStore.role === Role.Landlord && <TenantsMatchingHeader />}
            {profileStore.role === Role.Client && <PropertiesMatchingHeader />}
          </>
        }
      />
      <Backdrop open={list.loading}></Backdrop>
      {showNewPropertyModal && (
        <NewProperty
          showStore={[showNewPropertyModal, setShowNewPropertyModal]}
          propertyId={editPropertyId}
          setEditPropertyId={setEditPropertyId}
          afterSave={() => getAssets()}
          afterDelete={() => getAssets()}
        />
      )}

      <div className='container'>
        {!list.loading && list.rows.length === 0 && list.totalDocsUnfiltered === 0 && (
          <div className='no-properties'>
            <Typography variant='body2'>You currently have no properties in your portfolio</Typography>
            <Button
              size='large'
              className='add-property-button'
              startIcon={<Icon icon='plus' size={16} />}
              onClick={() => {
                setEditPropertyId(undefined);
                setShowNewPropertyModal(true);
              }}>
              Add Property
            </Button>
          </div>
        )}

        {!list.loading && list?.totalDocsUnfiltered !== 0 && (
          <>
            <div className='manage-properties-bar'>
              <div className='texts'>
                <Typography variant='body2'>My Properties</Typography>
                <Typography variant='body5'>
                  Here you can find all your conversations with your matches or Lostfish representatives
                </Typography>
              </div>

              <Button
                variant='secondary'
                size='large'
                className='add-property-button'
                startIcon={<Icon icon='plus' size={16} />}
                onClick={() => {
                  setEditPropertyId(undefined);
                  setShowNewPropertyModal(true);
                }}>
                Add Property
              </Button>
            </div>

            <div className='filter-properties-tabs'>
              <Tabs value={statusTab} onChange={setStatusTab}>
                <Tab label='All' />
                <Tab label='Published' />
                <Tab label='Under rental' />
              </Tabs>
            </div>

            <div className='properties-list'>
              {list.rows.map((p, pIndex: number) => (
                <Property
                  key={pIndex}
                  name={p.title}
                  status={p.status_string}
                  description={p.description}
                  location={p.area_of_interest}
                  area={p.floor_size}
                  areaUnit={p.floor_size_unit}
                  budget={p.budget}
                  roomsDetails={p.room_details}
                  propertyType={p.property_type}
                  parkingSpot={p.parking_spot}
                  epcRating={p.epc_rating}
                  viewDetails={() => {
                    setEditPropertyId(p._id);
                    setShowNewPropertyModal(true);
                  }}
                  images={p.property_images.length > 0 ? p.property_images : []}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
})`
  &.properties-page {
    min-height: 100vh;

    position: relative;
    display: grid;
    grid-template-rows: min-content auto min-content;
    z-index: 1;

    &::before {
      content: '';
      position: absolute;
      top: -150px;
      left: 0;
      width: 100%;
      height: 100vh;
      background: url(${propertiesBackground}), lightgray 50% / cover no-repeat;
      opacity: 0.05;
      background-position-y: top;
      background-size: auto;
      z-index: -1;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: linear-gradient(180deg, #fffbf3 18.95%, #fff 100%), #fff;

      background-position-y: top;
      background-size: auto;
      z-index: -2;
    }

    .container {
      padding: 24px 36px 64px 36px;
      min-height: calc(100vh - 112px);
      box-sizing: border-box;
      display: grid;
      row-gap: 32px;
      align-content: flex-start;
      position: relative;

      .manage-properties-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .texts {
          display: grid;
          row-gap: 12px;
        }

        .add-property-button {
        }
      }

      .filter-properties-tabs {
        .tabs {
          background-color: white;
          border-radius: 32px;
          border: 1px solid #e7e7e7;
          column-gap: 0;

          .tab {
            border-radius: 32px;
            background-color: white;
            padding: 12px 24px;
            width: 148px;
            .typography {
              color: #0d2a38;
            }
            &.active {
              background: #eee0d3;
              .typography {
                color: black;
              }
            }
          }
        }
      }

      .properties-list {
        display: grid;
        grid-template-columns: 1fr;
        flex-wrap: wrap;
        column-gap: 24px;
        row-gap: 32px;

        justify-content: center;
      }
    }

    .no-properties {
      position: absolute;
      inset: 0;
      display: grid;
      justify-items: center;
      align-content: center;
      height: 100%;

      .add-property-button {
        margin-top: 32px;
      }
    }
  }
`;
