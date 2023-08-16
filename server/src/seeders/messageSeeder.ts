import RoomSchema from '../api/Chat/schemas/room.schema';
import userService from '../api/User/user.service';
import MessageSchema from '../api/Chat/schemas/message.schema';

export const seedRoom = async (): Promise<void> => {
  try {
    const landlord = await userService.findOne({ email: 'Landlord@lostfish.com' });
    const tenant = await userService.findOne({ email: 'Tenant@lostfish.com' });

    if (landlord && tenant) {
      await RoomSchema.deleteMany({});
      await MessageSchema.deleteMany({});
      await RoomSchema.create({ author: landlord._id, participant: tenant._id });
      console.log(` Room seeded successfully.`);
    }
  } catch (error) {
    console.error('Error seeding Room:', error);
  }
};
