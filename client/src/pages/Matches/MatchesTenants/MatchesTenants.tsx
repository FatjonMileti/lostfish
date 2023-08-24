import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';

import { Typography } from '../../../components/Typography';
import { Avatar } from '../../../components/Avatar';
import axios from '../../../utils/axios';
import { useUserStore } from '../../../globalState/user';
import { ImproveTrustScoreModal } from '../ImproveTrustScoreModal';
import { Backdrop } from '../../../components/Backdrop';
import { Button } from '../../../components/Button';
import { ViewProfile } from './ViewProfile';
import { AddedTenants } from './MatchedTenants.AddedMatches';
import { SuggestedTenants } from './MatchedTenats.SuggestedMatches';
import classNames from 'classnames';
import { mapTenant } from './serializers';

export interface TenantType {
  id: string;
  criteria: any;
  property: any;
  chosen: boolean;
  starred: boolean;
  unread_messages: number;
  matchId?: string;
}

interface MatchesTenantsProps extends HTMLAttributes<HTMLDivElement> {}

export const MatchesTenants = styled(({ className }: MatchesTenantsProps) => {
  const [loadingTenants, setLoadingTenants] = React.useState(false);
  const [tenants, setTenants] = React.useState<TenantType[]>([]);
  const [improveTrustScoreModalVisibility, setImproveTrustScoreModalVisibility] = React.useState(false);

  const [matchedView, setMatchedView] = React.useState<boolean>(false);

  const { auth } = useUserStore();

  const [criteriaToView, setCriteriaToView] = React.useState<TenantType | null>(null);

  const [checkedTenants, setCheckedTenants] = React.useState<any[]>([]);

  React.useEffect(() => {
    getCheckedTenants();
  }, [tenants]);

  const getTenants = async () => {
    try {
      setLoadingTenants(true);
      const { data } = await axios(auth.access_token).get('/api/suggestion/tenant');
      setTenants(data.docs.map(mapTenant));
    } catch (err) {
      throw err;
    } finally {
      setLoadingTenants(false);
    }
  };

  const addOrUpdateTenantMatch = async (
    tenantId: string,
    chosen: boolean = false,
    starred: boolean = false,
    propertyId: string
  ) => {
    const matchId =
      tenants.find((t) => {
        return t.criteria.tenantId === tenantId && t.property._id === propertyId;
      })?.matchId || false;

    const response = matchId
      ? await axios(auth.access_token).put(`/api/match/${matchId}`, { chosen, starred })
      : await axios(auth.access_token).post('/api/match/tenant', {
          tenant: tenantId,
          chosen,
          starred,
          property: propertyId
        });

    if (response.status === 200 || response.status === 201) {
      setTenants((prevArray) =>
        prevArray.map((obj) =>
          obj.criteria.tenantId === tenantId && obj.property._id === propertyId
            ? { ...obj, chosen, starred, matchId: response.data._id }
            : obj
        )
      );
      if (criteriaToView && criteriaToView?.criteria.tenantId === tenantId) {
        setCriteriaToView((prevState) => {
          return prevState ? { ...prevState, chosen, starred } : null;
        });
      }
    } else if (response.status === 204) {
      setTenants((prevArray) =>
        prevArray.map((obj) =>
          obj.criteria.tenantId === tenantId && obj.property._id === propertyId
            ? { ...obj, chosen: false, starred: false, matchId: undefined }
            : obj
        )
      );
    }
  };

  const starTenant = async (tenantId: string, chosen: boolean, starred: boolean, propertyId: string) => {
    await addOrUpdateTenantMatch(tenantId, chosen, starred, propertyId);
  };

  const checkTenant = async (tenantId: string, chosen: boolean, starred: boolean, propertyId: string) => {
    await addOrUpdateTenantMatch(tenantId, chosen, starred, propertyId);
  };

  const removeTenantMatch = async (matchId: string) => {
    try {
      await axios(auth.access_token).delete(`/api/match/${matchId}`);

      if (matchId) {
        setTenants((prevArray) =>
          prevArray.map((obj) =>
            obj.matchId === matchId ? { ...obj, chosen: false, starred: false, matchId: undefined } : obj
          )
        );
      }
    } catch (err) {
      throw err;
    } finally {
    }
  };

  const getCheckedTenants = async () => {
    try {
      const { data } = await axios(auth.access_token).get('/api/match', { params: { chosen: true } });
      setCheckedTenants(data.docs.map(mapTenant));
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className={`${className}`}>
      <Backdrop open={loadingTenants}></Backdrop>
      <ImproveTrustScoreModal
        open={improveTrustScoreModalVisibility}
        closeModal={() => setImproveTrustScoreModalVisibility(false)}
      />
      {criteriaToView && (
        <ViewProfile criteria={criteriaToView.criteria} closeViewProfile={() => setCriteriaToView(null)} />
      )}

      {!matchedView ? (
        <SuggestedTenants
          tenants={tenants}
          getTenants={getTenants}
          removeTenantMatch={removeTenantMatch}
          matchedView={matchedView}
          setMatchedView={setMatchedView}
          setTenantToView={setCriteriaToView}
          starTenant={starTenant}
          checkTenant={checkTenant}
          showSwitchToMatchedViewSwitch={checkedTenants.length > 0}
          improveTrustScore={() => setImproveTrustScoreModalVisibility(true)}
        />
      ) : (
        <AddedTenants
          tenants={checkedTenants}
          setTenants={setCheckedTenants}
          removeTenantMatch={removeTenantMatch}
          getCheckedTenants={getCheckedTenants}
          matchedView={matchedView}
          setMatchedView={setMatchedView}
          setTenantToView={setCriteriaToView}
        />
      )}
    </div>
  );
})`
  & {
    display: grid;
    row-gap: 48px;
    grid-template-rows: min-content auto;

    .page-title-section {
      display: flex;
      column-gap: 24px;
      justify-content: space-between;
      align-items: center;

      .matching-with {
        color: #184d6d;
        border-bottom: 1px solid #184d6d;
      }

      .sub-title {
        margin-top: 8px;
      }

      .switch-to-matched-view-button-wrapper {
        display: flex;
        column-gap: 16px;
        align-items: center;

        label {
          font-family: Roobert, serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: 20px;
          color: #646464;
        }
      }
    }
  }
`;

interface MatchedSlideProps extends HTMLMotionProps<'div'> {
  avatar?: string;
  active?: boolean;
  onViewProfileClick: () => void;
  setActiveSlide: () => void;
  name: string;
  percentage: number;
}

export const MatchedSlide = styled(
  ({
    className,
    avatar,
    active = false,
    onViewProfileClick,
    setActiveSlide,
    name,
    percentage,
    ...rest
  }: MatchedSlideProps) => {
    return (
      <motion.div className={classNames('match-property-slide', className, { active })} {...rest}>
        <Avatar image={avatar} className={`${active ? 'active' : ''}`} onClick={setActiveSlide} />

        <motion.div
          className='action-buttons'
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ ease: 'easeOut', duration: 0.5 }}>
          <div className='tenant-details'>
            <Typography variant='body4' className='tenant-name'>
              {name}
            </Typography>
            <Typography variant='body4' className='tenant-dot'>
              •
            </Typography>
            <Typography variant='body4' className='tenant-match-percentage'>
              {percentage ?? '34'}%
            </Typography>
          </div>
          <Button
            size='small'
            variant='secondary'
            className='view-profile-button'
            onClick={onViewProfileClick}>
            View profile
          </Button>
        </motion.div>
      </motion.div>
    );
  }
)`
  &.match-property-slide {
    display: grid;
    row-gap: 16px;
    width: 372px;
    height: auto;
    flex-shrink: 0;
    align-content: space-between;
    opacity: 0.5;

    &.active {
      z-index: 1;
      opacity: 1;
    }

    .avatar {
      position: relative;
      width: 372px;
      height: 372px;
      overflow: hidden;
      flex-shrink: 0;
      cursor: pointer;
      box-sizing: border-box;

      &.active {
        box-shadow: 0 7.7px 23.2px 0 rgba(0, 0, 0, 0.25);
      }
    }

    .action-buttons {
      display: flex;
      align-items: center;

      .tenant-details {
        display: flex;
        column-gap: 8px;
        padding: 20px 32px;
        font-weight: 700;
        align-items: center;

        .tenant-dot,
        .tenant-match-percentage {
          color: #c4b1a3;
        }
      }

      .view-profile-button {
        flex-shrink: 0;
      }
    }
  }
`;
