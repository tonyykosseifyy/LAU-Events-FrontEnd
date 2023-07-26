import { View, FlatList } from 'react-native';
import React, { useEffect } from 'react';
import TextWrapper from '../../components/TextWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import DashboardSVG from '../../../assets/Icons/dashboard.svg';
import clsx from 'clsx';
import ExcelSvg from '../../../assets/Icons/excel.svg';
import RawSvg from '../../../assets/Icons/raw.svg';
import { EventApi } from '../../utils/api/crud/events';
import useSession from '../../hooks/useSession';
import { ClubApi } from '../../utils/api/crud/clubs';
import { EventStatus } from '../../models/event';

interface DashboardDataSource {
  title: string;
  value: number;
  isPercentage: boolean | undefined;
}

const Dashboard = () => {
  const authContext = useAuth();

  const [numberOfEvents, setNumberOfEvents] = React.useState<number>(0);
  const [numberOfClubs, setNumberOfClubs] = React.useState<number>(0);
  const [acceptanceRate, setAcceptanceRate] = React.useState<number>(0);
  const [declineRate, setDeclineRate] = React.useState<number>(0);

  useEffect(() => {
    const getDashboardData = async () => {
      if (!authContext?.authState.user?.accessToken) return;
      const session = useSession(authContext.authState);

      const eventApi = new EventApi(session);
      const clubApi = new ClubApi(session);

      try {
        const events = await eventApi.find();
        const clubs = await clubApi.find();

        setNumberOfEvents(events.length);
        setNumberOfClubs(clubs.length);

        setAcceptanceRate(74);
        setDeclineRate(10);
      } catch (e) {
        console.log(e);
        authContext.signOut();
      }
    };
    getDashboardData();
  }, []);

  const [dataSource, setDataSource] = React.useState<DashboardDataSource[]>([
    {
      title: 'Events',
      value: numberOfEvents,
      isPercentage: false,
    },
    {
      title: 'Clubs',
      value: numberOfClubs,
      isPercentage: false,
    },
    {
      title: 'Acceptance Rate',
      value: acceptanceRate,
      isPercentage: true,
    },
    {
      title: 'Decline Rate',
      value: declineRate,
      isPercentage: true,
    },
  ]);

  const downloadDataCSV = () => {};

  const downloadDataRaw = () => {};

  return (
    <SafeAreaView className="bg-brand-lighter w-full h-full py-10 px-6">
      <View className="flex flex-row w-full justify-between items-center">
        <TextWrapper className="text-2xl text-black">Dashboard</TextWrapper>
        <DashboardSVG width={20} height={20} color="#006E58" />
      </View>
      <View className="h-fit w-full mt-14">
        <FlatList
          data={dataSource}
          className="w-full"
          renderItem={({ item, index }) => (
            <View
              className={clsx(
                'flex flex-1 justify-between aspect-square flex-col rounded-2xl shadow-md p-4 m-3',
                index % 3 === 0 ? 'bg-brand' : 'bg-brand-dark'
              )}
              key={index}>
              <TextWrapper className="text-white text-xl">{item.title}</TextWrapper>
              <TextWrapper className="text-white text-2xl mt-2 text-right place-items-end">
                {item.value}
                {item.isPercentage ? '%' : ''}
              </TextWrapper>
            </View>
          )}
          //Setting the number of column
          numColumns={2}
          keyExtractor={(item, index) => index + ''}
        />
      </View>
      <View className="mt-5 flex">
        <TextWrapper className="text-xl">Download Data</TextWrapper>
        <View className="flex mt-5 flex-row">
          <ExcelSvg width={35} height={35}></ExcelSvg>
          <TextWrapper
            className="text-xl ml-2 underline"
            onPress={() => {
              downloadDataCSV();
            }}>
            CSV format
          </TextWrapper>
        </View>
        <View className="flex mt-5 flex-row">
          <RawSvg width={35} height={35}></RawSvg>
          <TextWrapper
            className="text-xl ml-2 underline"
            onPress={() => {
              downloadDataRaw();
            }}>
            Raw format
          </TextWrapper>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
