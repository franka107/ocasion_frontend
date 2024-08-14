
export interface Notification{
  id: string;
  message: string;
  tag: NotificationTag;
  createdAt: string;
}


export enum NotificationTag {
  Event = "EVENT",
}
