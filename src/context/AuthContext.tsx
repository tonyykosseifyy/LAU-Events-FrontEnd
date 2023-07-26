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

const SECURE_STORE_USER_KEY = 'user';

interface AuthState {
  user: User | null;
  authenticated: boolean | null;
}

interface AuthContextProps {
  signIn: (opts: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
  authState: AuthState;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      signIn: async () => {},
      signOut: () => {},
      authState: {
        user: null,
        authenticated: null,
      },
    };
  }
  return context;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    authenticated: null,
  });

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
          SECURE_STORE_USER_KEY,
          JSON.stringify({ accessToken, refreshToken, id, email: userEmail })
        );
        setAuthState({
          user: { accessToken, refreshToken, id, email: userEmail },
          authenticated: true,
        });
      },
    []
  );

  const refresh = useMemo(
    () => async (state: AuthState) => {
      if (!state.user) return;

      const { accessToken } = await new AuthApi().refresh(state.user.refreshToken);

      await SecureStore.setItemAsync(
        SECURE_STORE_USER_KEY,
        JSON.stringify({
          accessToken,
          refreshToken: state.user.refreshToken,
          id: state.user.id,
          email: state.user.email,
        })
      );
      setAuthState({
        user: {
          accessToken,
          refreshToken: state.user.refreshToken,
          id: state.user.id,
          email: state.user.email,
        },
        authenticated: true,
      });
    },
    []
  );

  useEffect(() => {
    // Load user
    SecureStore.getItemAsync(SECURE_STORE_USER_KEY).then((r) => {
      if (!r) {
        setAuthState({
          user: null,
          authenticated: false,
        });

        return;
      }
      const u = JSON.parse(r) as User;
      setAuthState({
        user: u,
        authenticated: true,
      });
    });
  }, []);

  useEffect(() => {
    // handle jwt expiry
    if (!authState.user) return;

    let handle: NodeJS.Timeout | null = null;
    const { exp } = jwt_decode(authState.user.accessToken) as { exp: number };

    if (+new Date() - exp * 1000 > 0) {
      refresh(authState);
    } else {
      handle = setTimeout(
        () => {
          refresh(authState);
        },
        exp * 1000 - +new Date() + 1
      );
    }

    return () => {
      if (handle) clearTimeout(handle);
    };
  }, [refresh, authState]);

  return (
    <AuthContext.Provider
      value={{
        signIn: credentialsSignIn,
        signOut: async () => {
          await SecureStore.deleteItemAsync(SECURE_STORE_USER_KEY);
          setAuthState({
            user: null,
            authenticated: false,
          });
        },
        authState,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
