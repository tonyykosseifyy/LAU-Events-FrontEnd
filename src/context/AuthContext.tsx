import * as SecureStore from 'expo-secure-store';
import jwt_decode from 'jwt-decode';
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthApi } from '../utils/api/auth/auth.api';
import { User } from '../models/user';

interface AuthContextProps {
  signIn: (opts: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
  user?: User | null;
  isLoggingIn: boolean;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      signIn: async () => {},
      signOut: () => {},
      user: undefined,
      isLoggingIn: false,
    };
  }
  return context;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>();

  const credentialsSignIn = useMemo(
    () =>
      async ({ email, password }: { email: string; password: string }) => {
        const {
          accessToken,
          refreshToken,
          email: userEmail,
          id,
        } = await new AuthApi().login(email, password);

        await SecureStore.setItemAsync(
          'user',
          JSON.stringify({ accessToken, refreshToken, id, userEmail })
        );
        setUser({ accessToken, refreshToken, id, email: userEmail });
      },
    []
  );

  const refresh = useMemo(
    () => async (u: User) => {
      const { accessToken } = await new AuthApi().refresh(u.refreshToken);
      await SecureStore.setItemAsync(
        'user',
        JSON.stringify({ accessToken, refreshToken: u.refreshToken, id: u.id })
      );
      setUser({
        ...u,
        accessToken,
      });
    },
    []
  );

  useEffect(() => {
    // Load user
    SecureStore.getItemAsync('user').then((r) => {
      if (!r) {
        setUser(null);
        return;
      }
      const u = JSON.parse(r) as User;
      setUser(u);
    });
  }, []);

  useEffect(() => {
    // handle jwt expiry
    if (!user) return;

    let handle: NodeJS.Timeout | null = null;
    const { exp } = jwt_decode(user.accessToken) as { exp: number };
    if (+new Date() - exp * 1000 > 0) {
      refresh(user);
    } else {
      handle = setTimeout(
        () => {
          refresh(user);
        },
        exp * 1000 - +new Date() + 1
      );
    }

    return () => {
      if (handle) clearTimeout(handle);
    };
  }, [refresh, user]);

  return (
    <AuthContext.Provider
      value={{
        signIn: credentialsSignIn,
        signOut: async () => {
          await SecureStore.deleteItemAsync('user');
          setUser(null);
        },
        user,
        isLoggingIn: user !== undefined,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
