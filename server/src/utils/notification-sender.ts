import Notification from '../api/Notification/notification.schema';
import { NotificationInput } from '../api/Notification/notification.interface';

const notifyUser = async (props: NotificationInput) => {
  await new Notification(props).save();
};

export default {
  notifyUser
};
