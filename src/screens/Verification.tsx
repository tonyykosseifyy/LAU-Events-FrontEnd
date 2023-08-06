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
import React, { useEffect } from 'react';
import TextWrapper from '../components/TextWrapper';
import { yupResolver } from '@hookform/resolvers/yup';
import LogoNoText from '../../assets/logo_no_text.svg';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Controller, Form, useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { isAxiosError, unWrapAuthError } from '../utils/errors';
import { AxiosError } from 'axios';
import { UserRole } from '../models/user';

type VerificationForm = {
  code: string;
};

const VerificationFormSchema = yup.object().shape({
  code: yup.string().required('Code is required').length(6, 'Invalid code format'),
});

const Verification = ({ navigation }: any) => {
  const { authState, verify } = useAuth();

  const {
    control,
    getValues,
    trigger,
    formState: { errors, isValid },
  } = useForm<VerificationForm>({
    resolver: yupResolver(VerificationFormSchema),
  });

  const [verifyError, setVerifyError] = React.useState<string | null>(null);

  useEffect(() => {
    if (authState.user && authState.user.role === UserRole.ADMIN) {
      navigation.navigate('AdminHome');
    } else if (authState.user && authState.user.role === UserRole.USER) {
      navigation.navigate('Home');
    }
    if (!authState.isVerified || authState.isVerified === true) {
      navigation.navigate('Signin');
    }
  }, [authState]);

  const onSubmit = async (data: VerificationForm) => {
    setVerifyError(null);
    try {
      await verify(data.code);
    } catch (e) {
      if (isAxiosError(e)) {
        console.log(e.response?.data);
        setVerifyError(unWrapAuthError(e as AxiosError));
      }
    }
  };
  return (
    <SafeAreaView className="h-full w-full">
      <ScrollView className="flex w-full flex-col bg-brand-lighter px-6 pr-10 py-12">
        <LogoNoText width={250} height={93}></LogoNoText>
        <View>
          <TextWrapper className="text-2xl text-black">Please Verify Your Account</TextWrapper>
        </View>
        <TextWrapper className="text-gray pt-16">
          We have sent you a verification code to your email. Please enter it below.
        </TextWrapper>

        {verifyError && (
          <TextWrapper className="text-error text-sm mt-3">{verifyError}</TextWrapper>
        )}
        <View className="flex flex-col w-full items-start justify-start mt-20">
          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  placeholder="Code"
                  className="border-b-[1px] border-gray w-full mt-5"
                  onBlur={onBlur}
                  cursorColor="green"
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  keyboardType="number-pad"
                />
                {errors.code && (
                  <TextWrapper className="text-error text-sm">{errors.code.message}</TextWrapper>
                )}
              </>
            )}
          />
        </View>
        <View className="w-full flex flex-row items-center justify-between mt-20 z-10">
          <TextWrapper className="text-black text-2xl">Verify</TextWrapper>
          <TouchableHighlight
            className="bg-brand rounded-full w-16 h-16 flex items-center justify-center"
            onPress={() => {
              trigger();
              if (isValid) {
                const { code } = getValues();
                onSubmit({ code });
              }
            }}>
            <Image source={require('../../assets/arrow-right.png')}></Image>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Verification;
