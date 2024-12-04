import { Howl } from 'howler';
import notificationSoundFile from '~/assets/sounds/notification.mp3'

const notificationSound = new Howl({
  src: [notificationSoundFile],
  volume: 1.0,
});

export const playNotificationSound = () => {
  console.log(notificationSoundFile);
  notificationSound.play();
};
