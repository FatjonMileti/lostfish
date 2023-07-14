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
import { NewProperty } from './NewProperty';
import { useUserStore } from '../../globalState/user';

const state: IGridState = {
  loading: true,
  rows: [],
  totalRows: 0,
  rowsPerPageOptions: [10, 20, 50],
  pageSize: 9,
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

  const { auth } = useUserStore();

  React.useEffect(() => {
    getAssets();
  }, []);

  const getAssets = async () => {
    try {
      const { search, asc, sort, pageSize, page } = list;

      const { data } = await axios(auth.access_token).get('/api/asset', {
        params: {
          page: page || undefined,
          pageSize: 9,
          sort: sort || undefined,
          asc: asc.toString() || undefined,
          status: search || undefined
        }
      });

      setList((prevList: any) => ({
        ...prevList,
        // @ts-ignore
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
      <Header />
      <Backdrop open={list.loading}></Backdrop>
      {showNewPropertyModal && (
        <NewProperty
          showStore={[showNewPropertyModal, setShowNewPropertyModal]}
          propertyId={editPropertyId}
          setEditPropertyId={setEditPropertyId}
          fetchAssets={() => getAssets()}
        />
      )}

      <div className='container'>
        {!list.loading && list.rows.length === 0 && (
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

        {!list.loading && list.rows.length > 0 && (
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
                size='medium'
                className='add-property-button'
                startIcon={<Icon icon='plus' size={16} />}
                onClick={() => {
                  setEditPropertyId(undefined);
                  setShowNewPropertyModal(true);
                }}>
                Add Property
              </Button>
            </div>

            <div className='properties-list'>
              {list.rows.map((p, pIndex) => (
                <Property
                  key={pIndex}
                  name={p.name}
                  status={p.status_string}
                  viewDetails={() => {
                    // viewDetails(p.id)
                    setEditPropertyId(p._id);
                    setShowNewPropertyModal(true);
                  }}
                  image={
                    p?.property_images?.[0]
                      ? `${process.env.REACT_APP_BACK_END_URL}/api/asset/${p._id}/image/${p.property_images[0]?.filename}`
                      : undefined
                  }
                  images={
                    p.property_images.length > 0
                      ? p.property_images.map(
                          (i: any) =>
                            `${process.env.REACT_APP_BACK_END_URL}/api/asset/${p._id}/image/${i?.filename}`
                        )
                      : []
                  }
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
    background: linear-gradient(180deg, #fffbf3 18.95%, #fff 100%), #fff;
    min-height: 100vh;

    display: grid;
    grid-template-rows: min-content auto min-content;
    row-gap: 32px;

    .container {
      padding: 24px 36px 48px 36px;

      .manage-properties-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .texts {
          display: grid;
          row-gap: 12px;
        }
      }

      .status-tabs {
        margin-top: 52px;
      }

      .properties-list {
        margin-top: 32px;
        display: grid;
        grid-template-columns: 1fr;
        flex-wrap: wrap;
        column-gap: 24px;
        row-gap: 24px;

        justify-content: center;
      }
    }

    .no-properties {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;

      .add-property-button {
        margin-top: 32px;
      }
    }
  }
`;
