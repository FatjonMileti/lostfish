import React from 'react';
import { styled } from '@mui/system';
import { Header } from '../HomeLoggedIn/Header';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { useGlobalState } from '../../globalState';
import { GridColDef, GridValueGetterParams, GridRenderCellParams } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import { Visibility } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { Footer } from '../Home/Footer';
import { CreateProperty } from './components/CreateProperty';
import { Backdrop } from '../../components/Backdrop';
import axios from '../../utils/axios';
import { Tab, Tabs } from '../../components/Tab';
import { Property } from './Property';

import { NewProperty } from './NewProperty';
import { EditProperty } from './EditProperty';

const state: IGridState = {
  loading: true,
  rows: [],
  totalRows: 0,
  rowsPerPageOptions: [10, 20, 50],
  pageSize: 10,
  page: 1,
  rowCount: 0,
  sort: 'created_at',
  asc: false,
  selectedIds: [],
  search: 'published'
};
export const Properties = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const [list, setList] = React.useState<IGridState>({
    ...state
  });
  const [isOnCreate, setIsOnCreate] = React.useState(false);

  const [showNewPropertyModal, setShowNewPropertyModal] = React.useState<boolean>(false);
  const [showEditPropertyModal, setShowEditPropertyModal] = React.useState<boolean>(false);
  const [editPropertyId, setEditPropertyId] = React.useState<string | undefined>(undefined);

  const navigate = useNavigate();

  const tabIndex = ['published', 'draft'].indexOf(list.search || '');
  const setTabIndex = (i: number) => setList((list) => ({ ...list, search: ['published', 'draft'][i] }));

  const {
    user: [{ auth }]
  } = useGlobalState();

  React.useEffect(() => {
    getAssets();
  }, [tabIndex]);

  const getAssets = async () => {
    const { search, asc, sort, pageSize, page } = list;

    let query: string = `?page=${page}`;
    if (pageSize) {
      query += `&pageSize=${pageSize}`;
    }
    if (sort) {
      query += `&sort=${sort}&asc=${asc.toString()}`;
    }
    if (search) {
      query += `&status=${search}`;
    }
    const { data } = await axios(auth.access_token).get(`/api/asset${query}`);
    setList((prevList: any) => ({
      ...prevList,
      // @ts-ignore
      rows: data.docs.map(({ _id, ...rest }) => ({ id: _id, ...rest })),
      totalRows: data.totalDocs,
      loading: false
    }));
  };

  const viewDetails = (id: string) => {
    navigate(`/properties/${id}`);
  };

  return (
    <div className={`properties-page ${className}`}>
      <Header />
      <Backdrop open={list.loading}></Backdrop>
      <NewProperty showStore={[showNewPropertyModal, setShowNewPropertyModal]} />
      <EditProperty
        propertyId={editPropertyId}
        showStore={[showEditPropertyModal, setShowEditPropertyModal]}
      />

      <div className='container'>
        {!list.loading && list.totalRows === 0 && (
          <div className='no-properties'>
            <Typography variant='body2'>You currently have no properties in your portfolio</Typography>
            <Button
              size='large'
              className='add-property-button'
              startIcon={<Icon icon='plus' size={16} />}
              onClick={() => setShowNewPropertyModal(true)}>
              Add Property
            </Button>
          </div>
        )}

        {!list.loading && list.rows.length > 0 && (
          <>
            <div className='manage-properties-bar'>
              <Typography variant='body2'>Manage your properties</Typography>

              <Button
                variant='secondary'
                size='large'
                className='add-property-button'
                startIcon={<Icon icon='plus' size={16} />}
                onClick={() => setShowNewPropertyModal(true)}>
                Add Property
              </Button>
            </div>

            <Tabs value={tabIndex} onChange={setTabIndex} className='status-tabs'>
              <Tab label='Published' />
              <Tab label='Drafts' />
            </Tabs>

            <div className='properties-list'>
              {list.rows.map((p, pIndex) => (
                <Property
                  key={pIndex}
                  name={p.name}
                  status={p.status_string}
                  viewDetails={() => {
                    // viewDetails(p.id)
                    setEditPropertyId(p.id);
                    setShowEditPropertyModal(true);
                  }}
                  image={
                    p?.property_images?.[0]
                      ? `${process.env.REACT_APP_BACK_END_URL}/url-to-file/${p.property_images[0]?.filename}`
                      : undefined
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* <CreateProperty closeCreateScreen={() => setIsOnCreate(!isOnCreate)} /> */}

      <Footer />
    </div>
  );
})`
  &.properties-page {
    background: linear-gradient(141.18deg, #cdf0ea 10.08%, #f9f9f9 98.58%);
    min-height: 100vh;

    display: grid;
    grid-template-rows: min-content auto min-content;

    .container {
      padding: 24px 36px 48px 36px;

      .manage-properties-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .status-tabs {
        margin-top: 52px;
      }

      .properties-list {
        margin-top: 32px;
        display: flex;
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
