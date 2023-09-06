import * as yup from 'yup';
import { View, Image, TouchableHighlight, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import TextWrapper from '../components/TextWrapper';
import { yupResolver } from '@hookform/resolvers/yup';
import LogoNoText from '../../assets/logo_no_text.svg';
import EyeOpenSVG from '../../assets/Icons/eye_open.svg';
import EyeClosedSVG from '../../assets/Icons/eye_closed.svg';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Controller, Form, useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { isAxiosError, unWrapAuthError } from '../utils/errors';
import { AxiosError } from 'axios';
import { UserRole } from '../models/user';
import clsx from 'clsx';

type SignInForm = {
  email: string;
  password: string;
};

const SignInFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required')
    .matches(/^([a-zA-Z0-9_\-\.]+)@lau\.edu(\.lb)?$/, 'Invalid LAU email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

const Signin = ({ navigation }: any) => {
  const { authState, signIn } = useAuth();
  const {
    control,
    getValues,
    trigger,
    formState: { errors, isValid },
  } = useForm<SignInForm>({
    resolver: yupResolver(SignInFormSchema),
  });

  const [signinError, setSigninError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

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

  const onSubmit = async (data: SignInForm) => {
    setSigninError(null);
    setIsSubmitting(true);
    try {
      await signIn(data);
      setIsSubmitting(false);
    } catch (e) {
      if (isAxiosError(e)) {
        setSigninError(unWrapAuthError(e as AxiosError));
      } else {
        setSigninError('Something went wrong');
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
        <TextWrapper className="text-gray pt-16">
          Please use your LAU e-mail and password to sign in.
        </TextWrapper>

        {signinError && (
          <TextWrapper className="text-error text-sm mt-3">{signinError}</TextWrapper>
        )}
        <View className="flex flex-col w-full items-start justify-start mt-20">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#AAAAAA"
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
                <View className="flex flex-row items-center justify-center border-b-[1px] border-gray mt-9 ">
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#AAAAAA"
                    onBlur={onBlur}
                    className="flex-1"
                    cursorColor="green"
                    textContentType="password"
                    secureTextEntry={!showPassword}
                    scrollEnabled={true}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="w-8 h-8  flex items-center justify-center">
                    {showPassword ? (
                      <EyeOpenSVG width={24} height={24} color="#AAAAAA" />
                    ) : (
                      <EyeClosedSVG width={24} height={24} color="#AAAAAA" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <TextWrapper className="text-error text-sm">
                    {errors.password.message}
                  </TextWrapper>
                )}
              </>
            )}
          />
        </View>
        <View className="w-full flex flex-row items-center justify-between mt-12 z-10">
          <TextWrapper className="text-black text-2xl">Sign in</TextWrapper>
          <TouchableHighlight
            className={clsx('bg-brand rounded-full w-16 h-16 flex items-center justify-center', {
              'bg-brand-dark cursor-not-allowed': isSubmitting,
            })}
            disabled={isSubmitting}
            onPress={() => {
              trigger();
              if (isValid) {
                const { email, password } = getValues();
                onSubmit({ email: email.toLowerCase(), password });
              }
            }}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Image source={require('../../assets/arrow-right.png')}></Image>
            )}
          </TouchableHighlight>
        </View>
        <View className="w-full flex flex-row items-center justify-between mt-5">
          <TextWrapper className="text-gray text-sm">Don't have an account?</TextWrapper>
          <TextWrapper
            className="text-gray text-sm underline"
            onPress={() => {
              navigation.navigate('Signup');
            }}>
            Register Now
          </TextWrapper>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;
