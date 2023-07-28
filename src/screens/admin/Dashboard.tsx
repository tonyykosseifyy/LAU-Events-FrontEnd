import { View, FlatList } from 'react-native';
import React, { useEffect, useMemo } from 'react';
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
import DashboardApi from '../../utils/api/dashboard';
import { DashboardData } from '../../models/dashboard';

interface DashboardDataSource {
  title: string;
  value: number;
  isPercentage: boolean | undefined;
}

const Dashboard = () => {
  const authContext = useAuth();

  const [dashboardData, setDashboardData] = React.useState<DashboardData>({
    eventCount: 0,
    clubCount: 0,
    acceptanceRate: 0,
    declineRate: 0,
  });

  useEffect(() => {
    const getDashboardData = async () => {
      if (!authContext?.authState.user?.accessToken) return;
      const session = useSession(authContext.authState);

      const dashboardApi = new DashboardApi(session);
      try {
        const res: any = await dashboardApi.getDashboardData();

        if (!res) return;
        // go over all entries in res, if any is null set it to 0
        Object.keys(res).forEach((key) => {
          if (res[key] === null) res[key] = 0;
        });

        setDashboardData(res);
      } catch (e) {
        console.log(e);
        authContext.signOut();
      }
    };
    getDashboardData();
  }, []);

  const dataSource = useMemo(() => {
    return [
      {
        title: 'Events',
        key: 'eventCount',
        isPercentage: false,
      },
      {
        title: 'Clubs',
        key: 'clubCount',
        isPercentage: false,
      },
      {
        title: 'Acceptance Rate',
        key: 'acceptanceRate',
        isPercentage: true,
      },
      {
        title: 'Decline Rate',
        key: 'declineRate',
        isPercentage: true,
      },
    ];
  }, [dashboardData]);

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
                {dashboardData.hasOwnProperty(item.key)
                  ? dashboardData[item.key as keyof DashboardData]
                  : 0}
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
