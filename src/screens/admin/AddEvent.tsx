import * as yup from 'yup';
import {
  View,
  Text,
  Pressable,
  TextInput,
  Platform,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowRight from '../../../assets/Icons/arrow_right.svg';
import TextWrapper from '../../components/TextWrapper';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CalenderSVG from '../../../assets/Icons/calender.svg';
import dayjs from 'dayjs';
import MultiselectDropdown from '../../components/MultiselectDropdown';
import { Club, ClubStatus } from '../../models/club';
import { useAuth } from '../../context/AuthContext';
import useSession from '../../hooks/useSession';
import { ClubApi } from '../../utils/api/crud/clubs';
import { ScrollView } from 'react-native-gesture-handler';
import { EventApi } from '../../utils/api/crud/events';
import { EventStatus } from '../../models/event';
import { useQueryClient } from '@tanstack/react-query';
import SelectDropdown from 'react-native-select-dropdown';
import { isAxiosError } from 'axios';
import { getAxiosError } from '../../utils/errors';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { API_URL } from '../../constants';
import clsx from 'clsx';

type EventForm = {
  eventName: string;
  eventDescription: string;
  startDate: Date;
  endDate: Date;
};

const EventFormSchema = yup.object().shape({
  eventName: yup.string().required('Event name is required'),
  eventDescription: yup.string().required('Event description is required'),
  startDate: yup
    .date()
    .required('Start date is required')
    .min(new Date(), 'Start date cannot be in the past'),
  endDate: yup
    .date()
    .required('End date is required')
    .min(new Date(), 'End date cannot be in the past')
    .min(yup.ref('startDate'), 'End date cannot be before start date'),
});

const AddEvent = ({ navigation }: any) => {
  const queryClient = useQueryClient();
  const {
    control,
    getValues,
    trigger,
    formState: { errors, isValid },
  } = useForm<EventForm>({
    resolver: yupResolver(EventFormSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });
  const authContext = useAuth();
  const session = useSession(authContext.authState);

  const [clubs, setClubs] = useState<Club[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!session) return;
    const fetchClubs = async () => {
      const res = await new ClubApi(session).find();
      setClubs(res.filter((i) => i.status === ClubStatus.ACTIVE));
    };
    fetchClubs();
  }, []);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedClubs, setSelectedClubs] = useState<Club[]>([]);
  const [clubsError, setClubsError] = useState<string | null>(null);
  const [dropDowanTextColor, setDropDownTextColor] = useState<string>('#AAAAAA');

  const [eventImageError, setEventImageError] = useState<string | null>(null);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const [error, setError] = useState<string | null>(null);

  const toggleStartDatePicker = () => {
    setShowStartDatePicker(!showStartDatePicker);
  };
  const toggleEndDatePicker = () => {
    setShowEndDatePicker(!showEndDatePicker);
  };

  const onSubmit = async (data: EventForm) => {
    setError(null);
    if (selectedClubs.length === 0) {
      setClubsError('Select at least one club');
      setIsSubmitting(false);
      return;
    }
    if (image === null) {
      setEventImageError('Please select an image');
      setIsSubmitting(false);
      return;
    }

    if (image.fileSize && image.fileSize > 5 * 1024 * 1024) {
      setEventImageError('Please select an image less than 5mb');
      setIsSubmitting(false);
      return;
    }

    let imageUrl: string | null = null;

    try {
      const res = await FileSystem.uploadAsync(API_URL + '/upload', image.uri, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (res.status !== 200) {
        setEventImageError('Could not upload image, please try again');
        setIsSubmitting(false);
        return;
      }
      const body: any = JSON.parse(res.body);
      imageUrl = body.imageUrl;
    } catch (e) {
      if (isAxiosError(e)) {
        setEventImageError(getAxiosError(e));
      } else {
        console.log(e);
        setEventImageError('Could not upload image, please try again');
      }
      setIsSubmitting(false);
      return;
    }

    if (!imageUrl) {
      setEventImageError('Could not upload image, please try again');
      setIsSubmitting(false);
      return;
    }

    try {
      const clubIds = selectedClubs.map((i) => i.id);
      const res = await new EventApi(session).create({
        clubIds,
        endTime: data.endDate,
        startTime: data.startDate,
        eventDescription: data.eventDescription,
        eventName: data.eventName,
        status: EventStatus.Active,
        imagePath: imageUrl,
      });

      if (res) {
        queryClient.refetchQueries(['events']);
        queryClient.invalidateQueries(['events']);
        navigation.goBack();
      }
      setIsSubmitting(false);
    } catch (e) {
      if (isAxiosError(e)) {
        setError(getAxiosError(e));
      }
      console.log(e);
      setIsSubmitting(false);
    }
  };

  const clickedOnAddImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      // re request
      clickedOnAddImage();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        selectionLimit: 1,
      });
      if (!result.canceled) {
        if (result.assets[0].type !== 'image') {
          setEventImageError('Please select an image');
          return;
        }
        setImage(result.assets[0]);
        setEventImageError(null);
      }
    }
  };

  return (
    <SafeAreaView className="w-full h-full">
      <ScrollView className="bg-brand-lighter w-full h-full py-8 px-6">
        <View className="w-full flex justify-center items-center relative flex-row">
          <Pressable
            className="absolute left-4 w-10 h-10 flex justify-center items-center"
            onPress={() => {
              navigation.goBack();
            }}>
            <ArrowRight
              width={18}
              height={18}
              color="#006E58"
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </Pressable>
          <TextWrapper className="text-2xl">Add Event</TextWrapper>
        </View>

        {error && <TextWrapper className="text-error mt-4">{error}</TextWrapper>}
        <View className="flex flex-col mt-4">
          <Controller
            control={control}
            name="eventName"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextWrapper className="text-base text-black ">Event Name</TextWrapper>
                <View className="h-2" />
                <TextInput
                  className="bg-white border-[1px] border-gray-300 text-black rounded-lg p-2 focus:border-gray-400"
                  cursorColor="green"
                  onBlur={onBlur}
                  placeholder="Event Name"
                  placeholderTextColor="#AAAAAA"
                  onChangeText={(value) => onChange(value)}
                  value={value}
                />
                <View className="h-2" />
                {errors.eventName && (
                  <TextWrapper className="text-error text-sm">
                    {errors.eventName.message}
                  </TextWrapper>
                )}
              </>
            )}
          />
          <View className="flex flex-col">
            <TextWrapper className="text-base text-black">Event Image</TextWrapper>
            <Pressable
              className="w-full bg-white-700 flex items-center justify-center flex-col p-4 border-[1px] border-gray-300 rounded-lg mt-2"
              onPress={() => {
                clickedOnAddImage();
              }}>
              {image === null ? (
                <>
                  <View className="w-16 h-16 border-2 border-brand-light/20 rounded-lg flex items-center justify-center">
                    <TextWrapper className="text-2xl text-brand-light/20">+</TextWrapper>
                  </View>
                  <TextWrapper className="text-gray mt-2">Click to Add an Image</TextWrapper>
                </>
              ) : (
                <Pressable
                  className="w-32 h-32"
                  onPress={() => {
                    clickedOnAddImage();
                  }}>
                  <ImageBackground
                    source={{ uri: image.uri }}
                    resizeMode="cover"
                    className="w-full h-full"
                    borderRadius={5}
                  />
                </Pressable>
              )}
            </Pressable>
            {eventImageError && (
              <TextWrapper className="text-sm text-red-500">{eventImageError}</TextWrapper>
            )}
          </View>
          <Controller
            control={control}
            name="eventDescription"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextWrapper className="text-base text-black mt-3">Event Description</TextWrapper>
                <View className="h-2" />
                <TextInput
                  className="bg-white border-[1px] border-gray-300 text-black rounded-lg p-2 focus:border-gray-400"
                  cursorColor="green"
                  onBlur={onBlur}
                  placeholder="Event Description"
                  placeholderTextColor="#AAAAAA"
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <View className="h-2" />
                {errors.eventName && (
                  <TextWrapper className="text-error text-sm">
                    {errors.eventName.message}
                  </TextWrapper>
                )}
              </>
            )}
          />
          <View className="z-20">
            <TextWrapper className="text-base text-black mt-3">Clubs</TextWrapper>
            <View className="h-2" />
            <SelectDropdown
              data={clubs.map((i) => i.clubName)}
              onSelect={(selectedItem, index) => {
                if (selectedClubs.find((i) => i.id === clubs[index].id)) {
                  // if already selected remove it
                  setSelectedClubs(selectedClubs.filter((i) => i.id !== clubs[index].id));
                  return;
                }
                setSelectedClubs([...selectedClubs, clubs[index]]);
                setDropDownTextColor('green');
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedClubs.map((i) => i.clubName).join(', ');
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              buttonStyle={{
                backgroundColor: '#fff',
                width: '100%',
                borderWidth: 1,
                borderRadius: 5,
                borderColor: '#AAAAAA',
              }}
              buttonTextStyle={{
                color: dropDowanTextColor,
                fontSize: 14,
                textAlign: 'left',
              }}
              dropdownStyle={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderRadius: 5,
                borderColor: '#006E58',
              }}
              defaultButtonText="Select Clubs"
            />
            <View className="h-2" />
            {clubsError && <TextWrapper className="text-error text-sm">{clubsError}</TextWrapper>}
          </View>
          <Controller
            control={control}
            name="startDate"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextWrapper className="text-base text-black mt-3">Start Date</TextWrapper>
                <View className="h-2" />
                <DateTimePickerModal
                  onCancel={toggleStartDatePicker}
                  isVisible={showStartDatePicker}
                  mode="datetime"
                  onConfirm={(date) => {
                    onChange(date);
                    toggleStartDatePicker();
                  }}
                  date={value}
                  minimumDate={new Date()}
                />
                <Pressable
                  onPress={toggleStartDatePicker}
                  className="flex flex-row justify-between items-center bg-white border-[1px] border-gray-300 text-black rounded-lg p-2 focus:border-gray-400">
                  <CalenderSVG width={20} height={20} />
                  <View className="w-2" />
                  <TextInput
                    className="flex-1 text-black"
                    cursorColor="green"
                    onBlur={onBlur}
                    placeholder="Start Date"
                    placeholderTextColor="#AAAAAA"
                    value={dayjs(value).format('DD MMM YYYY hh:mm A')}
                    editable={false}
                  />
                </Pressable>
                <View className="h-2" />
                {errors.startDate && (
                  <TextWrapper className="text-error text-sm">
                    {errors.startDate.message}
                  </TextWrapper>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="endDate"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextWrapper className="text-base text-black mt-3">End Date</TextWrapper>
                <View className="h-2" />
                <DateTimePickerModal
                  onCancel={toggleEndDatePicker}
                  isVisible={showEndDatePicker}
                  mode="datetime"
                  onConfirm={(date) => {
                    toggleEndDatePicker();
                    onChange(date);
                  }}
                  date={value}
                  minimumDate={getValues('endDate') ?? new Date()}
                />
                <Pressable
                  onPress={toggleEndDatePicker}
                  className="flex flex-row justify-between items-center bg-white border-[1px] border-gray-300 text-black rounded-lg p-2 focus:border-gray-400">
                  <CalenderSVG width={20} height={20} />
                  <View className="w-2" />
                  <TextInput
                    className="flex-1 text-black"
                    cursorColor="green"
                    onBlur={onBlur}
                    placeholder="End Date"
                    placeholderTextColor="#AAAAAA"
                    value={dayjs(value).format('DD MMM YYYY hh:mm A')}
                    editable={false}
                  />
                </Pressable>
                <View className="h-2" />
                {errors.endDate && (
                  <TextWrapper className="text-error text-sm">{errors.endDate.message}</TextWrapper>
                )}
              </>
            )}
          />
        </View>
        <View className="flex flex-row w-full justify-between items-center mt-10 mb-14">
          <Pressable
            className="bg-gray/40 px-6 py-2 rounded-lg"
            disabled={isSubmitting}
            onPress={() => {
              navigation.goBack();
            }}>
            <TextWrapper className="text-black text-base">Cancel</TextWrapper>
          </Pressable>
          <View className="w-4" />
          <Pressable
            className={clsx('bg-brand px-8 py-2 rounded-lg', {
              'bg-brand-dark': isSubmitting,
            })}
            disabled={isSubmitting}
            onPress={() => {
              trigger();
              if (isValid) {
                const vals = getValues();
                setIsSubmitting(true);
                onSubmit(vals);
              }
            }}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <TextWrapper className="text-white text-base">Add</TextWrapper>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddEvent;
