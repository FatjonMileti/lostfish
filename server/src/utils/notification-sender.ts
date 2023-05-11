import Notification from '../data/notification';
import { NotificationInput } from '../data/interfaces/notification.interface';

const notifyUser = async (props: NotificationInput) => {
  await new Notification(props).save();
};

export default {
  notifyUser
};
