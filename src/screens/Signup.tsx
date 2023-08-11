import * as yup from 'yup';
import {
  View,
  Image,
  Pressable,
  Button,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import TextWrapper from '../components/TextWrapper';
import { yupResolver } from '@hookform/resolvers/yup';
import LogoNoText from '../../assets/logo_no_text.svg';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Controller, Form, useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { isAxiosError, unWrapAuthError } from '../utils/errors';
import { AxiosError } from 'axios';
import { API_URL } from '@env';
import SelectDropdown from 'react-native-select-dropdown';
import { LAU_MAJORS } from '../constants';
import { UserRole } from '../models/user';
import clsx from 'clsx';

type SignUpForm = {
  email: string;
  password: string;
  major: string;
};

const SignUpFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required')
    .matches(/^([a-zA-Z0-9_\-\.]+)@lau\.edu(\.lb)?$/, 'Invalid LAU email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  // major should be of type LauMajor
  major: yup.string().required('Major is required'),
});

const Signup = ({ navigation }: any) => {
  const { authState, signUp } = useAuth();
  const {
    control,
    getValues,
    trigger,
    formState: { errors, isValid },
  } = useForm<SignUpForm>({
    resolver: yupResolver(SignUpFormSchema),
  });

  const [signupError, setSignupError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [dropDownTextColor, setDropDownTextColor] = useState<string>('#AAAAAA');
  useEffect(() => {
    // only if it set to false then we go to verification
    // if it was null, we go to signin page
    if (authState.isVerified === false) {
      navigation.navigate('Verification');
      return;
    }

    if (authState.user && authState.user.role === UserRole.ADMIN) {
      navigation.navigate('AdminHome');
    } else if (authState.user && authState.user.role === UserRole.USER) {
      navigation.navigate('UserHome');
    }
  }, [authState]);

  const onSubmit = async (data: SignUpForm) => {
    setSignupError(null);
    setIsSubmitting(true);
    try {
      await signUp(data);
      setIsSubmitting(false);
      navigation.navigate('Verification');
    } catch (e) {
      if (isAxiosError(e)) {
        setSignupError(unWrapAuthError(e as AxiosError));
      } else {
        setSignupError('Something went wrong, please try again!');
      }
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="h-full w-full">
      <ScrollView className="flex w-full flex-col bg-brand-lighter px-6 pr-10 py-12">
        <LogoNoText width={250} height={93}></LogoNoText>
        <View>
          <TextWrapper className="text-2xl text-black">Welcome to LAU</TextWrapper>
          <View className="flex items-start gap-2 flex-row">
            <TextWrapper className="text-2xl text-black">Events</TextWrapper>
            <TextWrapper className="text-2xl text-brand">explorer!</TextWrapper>
          </View>
        </View>
        <TextWrapper className="text-gray mt-8">
          Please use your LAU e-mail and a new password.
        </TextWrapper>

        {signupError && (
          <TextWrapper className="text-error text-sm mt-3">{signupError}</TextWrapper>
        )}
        <View className="flex flex-col w-full mt-8">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  placeholder="Email"
                  className="border-b-[1px] border-gray w-full mt-5"
                  onBlur={onBlur}
                  cursorColor="green"
                  onChangeText={(value) => onChange(value)}
                  value={value}
                />
                {errors.email && (
                  <TextWrapper className="text-error text-sm">{errors.email.message}</TextWrapper>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  placeholder="Password"
                  onBlur={onBlur}
                  className="border-b-[1px] border-gray w-full mt-9"
                  cursorColor="green"
                  textContentType="password"
                  secureTextEntry={true}
                  scrollEnabled={true}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                />
                {errors.password && (
                  <TextWrapper className="text-error text-sm">
                    {errors.password.message}
                  </TextWrapper>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="major"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <SelectDropdown
                  data={LAU_MAJORS}
                  buttonStyle={{
                    width: '100%',
                    backgroundColor: '#EAF2EF',
                    borderColor: '#AAAAAA',
                    borderBottomWidth: 1,
                    marginTop: 24,
                    marginHorizontal: 0,
                    paddingHorizontal: 0,
                  }}
                  onSelect={(selectedItem, index) => {
                    onChange(selectedItem);
                    setDropDownTextColor('green');
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  defaultButtonText="Select your major"
                  buttonTextStyle={{
                    color: dropDownTextColor,
                    fontSize: 14,
                    textAlign: 'left',
                    marginHorizontal: 0,
                    paddingHorizontal: 0,
                  }}
                  rowTextStyle={{
                    textAlign: 'left',
                  }}
                  selectedRowTextStyle={{
                    color: 'green',
                  }}
                  showsVerticalScrollIndicator={true}
                  dropdownStyle={{
                    backgroundColor: '#EAF2EF',
                    borderColor: '#AAAAAA',
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 8,
                  }}
                />
                {errors.major && (
                  <TextWrapper className="text-error text-sm">{errors.major.message}</TextWrapper>
                )}
              </>
            )}
          />
        </View>
        <View className="w-full flex flex-row items-center justify-between mt-12 z-10">
          <TextWrapper className="text-black text-2xl">Sign up</TextWrapper>
          <TouchableHighlight
            className={clsx('bg-brand rounded-full w-16 h-16 flex items-center justify-center', {
              'bg-gray cursor-not-allowed': isSubmitting,
            })}
            disabled={isSubmitting}
            onPress={() => {
              trigger();
              if (isValid) {
                const { email, password, major } = getValues();
                onSubmit({ email, password, major });
              }
            }}>
            <Image source={require('../../assets/arrow-right.png')}></Image>
          </TouchableHighlight>
        </View>
        <View className="w-full flex flex-row items-center justify-between mt-5">
          <TextWrapper className="text-gray text-sm">Already have an account?</TextWrapper>
          <TextWrapper
            className="text-gray text-sm underline"
            onPress={() => {
              if (isSubmitting) return;
              navigation.navigate('Signin');
            }}>
            Sign in
          </TextWrapper>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
