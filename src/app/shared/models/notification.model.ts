export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'Info' | 'Warning' | 'Error' | 'Success';
  isRead: boolean;
  recipientId: string;
  link?: string;
  createdAt: Date;
}
