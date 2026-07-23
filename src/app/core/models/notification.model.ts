import { NotificationAction } from "../enums/NotificationAction";
import { NotificationAppearance } from "../enums/NotificationAppearance";
import { NotificationType } from "../enums/NotificationType";

export interface NotificationData {

    message: string;

    appearance: NotificationAppearance;

    type: NotificationType;

    action?: NotificationAction | null;

}