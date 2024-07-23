import React from 'react';
import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { SegmentControl, Typography } from '../../components';
import { Button } from '../../components';
import { Icon } from '../../components';
import { ShowGlobalLoading } from '../../components';
import { Label } from '../../components';

import axios from '../../utils/axios';
import { useUserStore } from '../../globalState/user';

import { Property } from './Property/Property';

import { EditPropertyModal } from './NewProperty/EditPropertyModal';
import { AddPropertyModal } from './NewProperty/AddPropertyModal';
import { HeaderLoggedIn } from '../PagesComponents/HeaderLoggedIn/HeaderLoggedIn.tsx';
import { Footer } from '../Home/Footer.tsx';

enum ActiveTab {
  Published = 'published',
  Draft = 'draft'
}

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

  const [activeTab, setActiveTab] = React.useState(ActiveTab.Published);

  const { auth } = useUserStore();

  const queryParams = new URLSearchParams(useLocation().search);
  const navigate = useNavigate();

  React.useEffect(() => {
    setList((list) => ({
      ...list,
      search: activeTab
    }));
  }, [activeTab]);

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
      {list.loading && <ShowGlobalLoading />}

      <div className='header-and-content-wrapper'>
        <HeaderLoggedIn />

        {!list.loading && list.rows.length === 0 && list.totalDocsUnfiltered === 0 && (
          <div className='no-properties'>
            <Typography variant='body2'>You currently have no properties in your portfolio</Typography>
            <Button
              size='large'
              className='add-property-button'
              startIcon={<Icon icon='plus' size={16} />}
              onClick={() => {
                setShowNewPropertyModal(true);
              }}>
              Add Property
            </Button>
          </div>
        )}

        {!list.loading && list?.totalDocsUnfiltered !== 0 && (
          <div className='page-body-wrapper'>
            <div className='properties-header'>
              <Typography variant='body1' className='page-title'>
                My Properties
              </Typography>
              <div className='tabs-wrapper'>
                <SegmentControl
                  label='Published'
                  active={activeTab === ActiveTab.Published}
                  onClick={() => setActiveTab(ActiveTab.Published)}
                />
                <SegmentControl
                  label='Drafts'
                  active={activeTab === ActiveTab.Draft}
                  onClick={() => setActiveTab(ActiveTab.Draft)}
                />
              </div>
              <Label
                size='large'
                onClick={() => {
                  setShowNewPropertyModal(true);
                }}>
                <Icon icon='plus' size={24} />
                Add Property
              </Label>
            </div>

            <div className='properties-list'>
              {list.rows.map((p, pIndex: number) => (
                <Property
                  propertyId={p._id}
                  key={pIndex}
                  name={p.title}
                  status={p.status_string}
                  location={p.area_of_interest}
                  budget={p.budget}
                  roomsDetails={p.room_details}
                  viewDetails={() => {
                    setEditPropertyId(p._id);
                  }}
                  afterPublish={() => {
                    navigate('/');
                  }}
                  images={p.property_images || []}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {editPropertyId && (
        <EditPropertyModal
          showStore={[!!editPropertyId, () => setEditPropertyId(undefined)]}
          propertyId={editPropertyId}
          afterSaveAsDraft={() => {
            setEditPropertyId(undefined);
            getAssets();
          }}
          afterDelete={() => getAssets()}
          onBack={() => setEditPropertyId(undefined)}
          afterStartMatching={() => {
            setEditPropertyId(undefined);
            navigate('/');
          }}
        />
      )}

      <AddPropertyModal
        showStore={[showNewPropertyModal, setShowNewPropertyModal]}
        afterSave={() => {
          setShowNewPropertyModal(false);
          getAssets();
        }}
        onBack={() => setEditPropertyId(undefined)}
      />

      <Footer />
    </div>
  );
})`
  &.properties-page {
    display: grid;
    align-content: flex-start;
    position: relative;
    grid-template-rows: min-content auto;
    height: 100%;

    .header-and-content-wrapper {
      min-height: 100vh;
      display: grid;
      grid-template-rows: min-content auto;
      box-sizing: border-box;
    }

    .page-body-wrapper {
      display: grid;
      grid-template-rows: min-content auto;

      .properties-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 36px;
        gap: 16px;

        .page-title {
          color: #0d2a38;
          font-weight: 600;
          line-height: 56px;
        }

        .tabs-wrapper {
          display: flex;
          gap: 8px;
        }
      }

      .properties-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
        padding: 24px 36px 48px 36px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 51.5%);
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
