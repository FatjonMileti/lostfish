import { IRoom } from '../messages.interface';
import { useProfileStore } from '../../../globalState/profile';
import { Role } from '../../../enums';
import { MatchDetailsProperty } from './MatchDetails.Property';
import { MatchDetailsTenant } from './MatchDetails.Tenant';

interface MatchDetailsProps {
  room: IRoom;
}

export const MatchDetails = ({ room }: MatchDetailsProps) => {
  const profileStore = useProfileStore();
  return (
    <>
      {profileStore.role === Role.Tenant && <MatchDetailsProperty room={room} />}
      {profileStore.role === Role.Landlord && <MatchDetailsTenant room={room} />}
    </>
  );
};
