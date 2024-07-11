import { styled } from '@mui/system';
import { useProfileStore } from '../../globalState/profile.tsx';
import { submenus, tenantSubmenu } from '../../pages/MyAccount/MyAccount.tsx';
import { Popover, PopoverProps } from '../Popover.tsx';
import { NavLink, useNavigate } from 'react-router-dom';
import { AccountItem } from '../AccountItem.tsx';
import classNames from 'classnames';
import request from '../../utils/axios.ts';
import { useUserStore } from '../../globalState/user.tsx';

interface AccountMenuPopoverProps extends PopoverProps {}

export const AccountMenuPopover = styled(
  ({ anchorEl, open, onClose, id, className }: AccountMenuPopoverProps) => {
    const profileStore = useProfileStore();
    const menuItems = profileStore.role === 'Tenant' ? tenantSubmenu : submenus;
    const userStore = useUserStore();
    const navigate = useNavigate();

    const logOut = async () => {
      try {
        await request(userStore.auth.access_token).post('/api/account/logout', {
          refresh_token: userStore.auth.refresh_token
        });
      } catch (err) {
      } finally {
        userStore.set((user: any) => ({ ...user, auth: null, userDetails: null, ability: null }));
        profileStore.reset();
        navigate('/');
      }
    };

    return (
      <Popover
        className={classNames('account-menu-popover', className)}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        classes={{ paper: 'menu-container' }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{ vertical: -30, horizontal: 320 }}>
        <div> </div>
        <div className='menu-list'>
          {menuItems.map(({ icon, text, link }, menuItemIndex) => (
            <NavLink end to={`/my-account${link}`} key={menuItemIndex}>
              {({ isActive }) => <AccountItem active={isActive} label={text} icon={icon} />}
            </NavLink>
          ))}
        </div>
        <div className='line' />
        <div className='logout-wrapper'>
          <AccountItem className='sign-out' label='Sign out' icon='sign-out' onClick={logOut} />
        </div>
      </Popover>
    );
  }
)`
  &.account-menu-popover {
    .menu-container {
      border-radius: 16px;
      box-shadow: 0px 4px 32px 0px rgba(13, 42, 56, 0.1);

      display: flex;
      width: 324px;
      padding: 24px 16px;
      flex-direction: column;
      align-items: flex-start;
      gap: 24px;

      .menu-list {
        display: flex;
        flex-direction: column;
        align-self: stretch;
        width: 100%;

        > a {
          text-decoration: none;
        }
      }

      .line {
        height: 1px;
        align-self: stretch;
        background: #e7e7e7;
      }

      .logout-wrapper {
        width: 100%;
        .sign-out {
          color: #b4263b;
        }
      }
    }
  }
`;
