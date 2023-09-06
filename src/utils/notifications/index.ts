import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export default async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS !== 'web') {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: 'a9536565-bf98-4842-a7b9-07b3a85f11f3',
      })
    ).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      showBadge: true,
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#006E58',
    });
  }

  return token;
}
