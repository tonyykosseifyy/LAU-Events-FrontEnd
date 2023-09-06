import {
  View,
  FlatList,
  Pressable,
  Modal,
  Platform,
  Linking,
  Share,
  ScrollView,
} from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import TextWrapper from '../../components/TextWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import DashboardSVG from '../../../assets/Icons/dashboard.svg';
import LogoutSVG from '../../../assets/Icons/logout.svg';
import clsx from 'clsx';
import ExcelSvg from '../../../assets/Icons/excel.svg';
import RawSvg from '../../../assets/Icons/raw.svg';
import { EventApi } from '../../utils/api/crud/events';
import useSession from '../../hooks/useSession';
import DashboardApi from '../../utils/api/dashboard';
import { DashboardData, FlatDataStat } from '../../models/dashboard';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { getAxiosError } from '../../utils/errors';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import * as Sharing from 'expo-sharing';
import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';

const Dashboard = ({ navigation }: any) => {
  const authContext = useAuth();
  const session = useSession(authContext.authState);

  const { data: dashboardData, refetch } = useQuery<DashboardData, Error>(
    ['dashboard', session],
    async () => {
      const dashboardApi = new DashboardApi(session);

      try {
        const res = await dashboardApi.getDashboardData();
        Object.keys(res).forEach((key) => {
          if (res[key as keyof DashboardData] === null) res[key as keyof DashboardData] = 0;
        });
        return res;
      } catch (e) {
        if (isAxiosError(e)) {
          if (e.status === 404 || e.status === 401) {
            authContext.signOut();
          }
        }
        return {
          eventCount: 0,
          acceptanceRate: 0,
          clubCount: 0,
          declineRate: 0,
        };
      }
    },
    {
      enabled: !!session,
      cacheTime: 1000 * 10,
      refetchInterval: 1000 * 10,
    }
  );
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

  const downloadDataCSV = async () => {
    const dashboardApi = new DashboardApi(session);
    try {
      const res = await dashboardApi.getAllData();
      // go over each DataStat in res and flatten it
      const flattenedData: FlatDataStat[] = res.map((dataStat) => {
        return {
          dateRegistered: dataStat.user.createdAt,
          studentMajor: dataStat.user.major,
          eventDescription: dataStat.event.eventDescription,
          acceptedDate: dataStat.event.acceptedDate,
          acceptedTime: dataStat.event.acceptedTime,
          declinedDate: dataStat.event.declinedDate,
          declinedTime: dataStat.event.declinedTime,
          rescheduledDate: dataStat.event.rescheduledDate,
          rescheduledTime: dataStat.event.rescheduledTime,
        };
      });

      const workbook = XLSX.utils.book_new();

      const worksheet = XLSX.utils.json_to_sheet(flattenedData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'DataStats');

      // Generate the Excel file data
      const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });
      const fileName = `DataStats-${dayjs().format('YYYY-MM-DDTHH:mm:ss')}.xlsx`;
      const excelFilePath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(excelFilePath, excelData, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Open the file using a platform-specific method (example for React Native)
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Sharing.shareAsync(excelFilePath);
      }
    } catch (e) {
      if (isAxiosError(e)) {
        console.log(getAxiosError(e));
      }
    }
  };

  const downloadDataRaw = async () => {
    const dashboardApi = new DashboardApi(session);
    try {
      const res = await dashboardApi.getAllData();
      const jsonData = JSON.stringify(res, null, 2);
      const fileName = `DataStats-${dayjs().format('YYYY-MM-DDTHH:mm:ss')}.json`;
      const jsonFilePath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(jsonFilePath, jsonData, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Open the file using a platform-specific method (example for React Native)
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Sharing.shareAsync(jsonFilePath);
      }
    } catch (e) {
      if (isAxiosError(e)) {
        console.log(getAxiosError(e));
      }
    }
  };

  const [modalVisible, setModalVisible] = useState(false);

  const responseListener = useRef<any>();

  useEffect(() => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;

      if (!data) {
        return;
      }

      // navigate to event details
      if (data.eventId) {
        if (authContext.authState.authenticated) {
          navigation.navigate('EventDetails', { eventId: data.eventId });
        } else {
          navigation.navigate('Signin');
        }
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  return (
    <SafeAreaView className="bg-brand-lighter w-full h-full py-4 px-6">
      <View className="h-fit w-full">
        <FlatList
          data={dataSource}
          className="w-full"
          horizontal={false}
          ListHeaderComponent={() => {
            return (
              <>
                <View className="flex flex-row w-full justify-between items-center">
                  <TextWrapper className="text-2xl text-black">Dashboard</TextWrapper>
                  <Pressable
                    className="w-10 h-10 flex justify-center items-center"
                    onPress={() => {
                      navigation.navigate('Logout');
                    }}>
                    <LogoutSVG width={20} height={20} color="#006E58" />
                  </Pressable>
                </View>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <View className="w-full h-full flex justify-center items-center bg-brand/20">
                    <View className="bg-brand-lighter w-5/6 h-72 rounded-lg py-4 px-6 flex flex-col justify-between">
                      <View className="flex flex-col">
                        <View className="flex flex-row justify-between items-center w-full">
                          <TextWrapper className="text-xl text-black">
                            ⚠️ Are you sure you want to{' '}
                            <TextWrapper className="text-error">delete all</TextWrapper> the events
                            in the database? ⚠️
                          </TextWrapper>
                        </View>
                      </View>
                      <View className="flex flex-row w-full justify-end items-center">
                        <Pressable
                          className="bg-gray/40 px-6 py-2 rounded-lg"
                          onPress={() => {
                            setModalVisible(false);
                          }}>
                          <TextWrapper className="text-black text-base">Cancel</TextWrapper>
                        </Pressable>
                        <View className="w-4" />
                        <Pressable
                          className="bg-error px-8 py-2 rounded-lg"
                          onPress={() => {
                            const eventApi = new EventApi(useSession(authContext.authState));
                            eventApi.deleteAll();
                            refetch();
                            setModalVisible(false);
                          }}>
                          <TextWrapper className="text-white text-base">DELETE ALL</TextWrapper>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Modal>
              </>
            );
          }}
          ListFooterComponent={() => {
            return (
              <>
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
                <View className="w-full mt-2 flex justify-end flex-row">
                  <Pressable
                    className="bg-error/20 px-6 py-2 rounded-lg"
                    onPress={() => {
                      setModalVisible(true);
                    }}>
                    <TextWrapper className="text-black text-base">Reset All</TextWrapper>
                  </Pressable>
                </View>
              </>
            );
          }}
          renderItem={({ item, index }) => (
            <View
              className={clsx(
                'flex flex-1 justify-between aspect-square flex-col rounded-2xl shadow-md p-4 m-3',
                index % 3 === 0 ? 'bg-brand' : 'bg-brand-dark'
              )}
              key={index}>
              <TextWrapper className="text-white text-xl">{item.title}</TextWrapper>
              <TextWrapper className="text-white text-2xl mt-2 text-right place-items-end">
                {dashboardData && dashboardData.hasOwnProperty(item.key)
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
    </SafeAreaView>
  );
};

export default Dashboard;
