import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import useSession from '../../hooks/useSession';
import { EventApi } from '../../utils/api/crud/events';
import { Event } from '../../models/event';

const EventDetails = ({ route, navigation }: any) => {
  const { eventId } = route.params;
  const authContext = useAuth();
  const session = useSession(authContext.authState);

  const [event, setEvent] = useState<Event | null>(null);
  useEffect(() => {
    if (!session || !eventId) {
      authContext.signOut();
      return;
    }

    try {
      const getEvent = async () => {
        const res = await new EventApi(session).findOneWithDetails(eventId);
        setEvent(res);
      };
      getEvent();
    } catch (e) {
      console.log(e);
      authContext.signOut();
    }
  }, []);

  console.log(event);
  return (
    <View>
      <Text>EventDetails</Text>
    </View>
  );
};

export default EventDetails;
