import * as SecureStore from 'expo-secure-store';
import jwt_decode from 'jwt-decode';
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthApi, LoginResponse, SignUpResposne } from '../utils/api/auth/auth.api';
import { User, UserRole } from '../models/user';
import useSession from '../hooks/useSession';
import { AppState } from 'react-native';
import registerForPushNotificationsAsync from '../utils/notifications';

const SECURE_STORE_USER_KEY = 'user';

export interface AuthState {
  user: User | null;
  authenticated: boolean | null;
  isVerified: boolean | null;
}

interface AuthContextProps {
  signIn: (opts: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
  signUp: (opts: { email: string; password: string; major: string }) => Promise<void>;
  verify: (code: string) => Promise<void>;
  authState: AuthState;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      signIn: async () => {},
      signOut: () => {},
      signUp: async () => {},
      verify: async () => {},
      authState: {
        user: null,
        authenticated: null,
        isVerified: null,
      },
    };
  }
  return context;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    authenticated: null,
    isVerified: null,
  });

  const appState = useRef(AppState.currentState);

  const credentialsSignIn = useMemo(
    () =>
      async ({ email, password }: { email: string; password: string }) => {
        try {
          const res = await new AuthApi().login(email, password);

          const {
            accessToken,
            refreshToken,
            id,
            email: userEmail,
            major,
            createdAt,
          } = res as LoginResponse;
          // decode the jwt to get the isAdmin flag
          const role: UserRole = (jwt_decode(accessToken) as { role: UserRole }).role;

          await SecureStore.setItemAsync(
            SECURE_STORE_USER_KEY,
            JSON.stringify({
              accessToken,
              refreshToken,
              id,
              email: userEmail,
              role,
              major,
              createdAt,
            })
          );
          setAuthState({
            user: { accessToken, refreshToken, id, email: userEmail, role, major, createdAt },
            authenticated: true,
            isVerified: true,
          });
        } catch (e) {
          throw e;
        }
      },
    []
  );

  const signUp = useMemo(
    () =>
      async ({ email, password, major }: { email: string; password: string; major: string }) => {
        try {
          const notificationToken = await registerForPushNotificationsAsync();
          const res = await new AuthApi().signup(email, password, major, notificationToken);
          const { message, userId } = res;
          await SecureStore.setItemAsync(
            SECURE_STORE_USER_KEY,
            JSON.stringify({ accessToken: null, refreshToken: null, id: userId, email: email })
          );
          setAuthState({
            user: {
              accessToken: undefined,
              refreshToken: undefined,
              id: userId.toString(),
              email: email,
              major: '',
              createdAt: '',
            },
            authenticated: false,
            isVerified: false,
          });
        } catch (e) {
          throw e;
        }
        return;
      },
    []
  );

  const refresh = useMemo(
    () => async (state: AuthState) => {
      if (!state.user || !state.user.accessToken || !state.user.refreshToken) return;

      try {
        const { accessToken } = await new AuthApi().refresh(state.user.refreshToken);

        const role: UserRole = (jwt_decode(accessToken) as { role: UserRole }).role;

        await SecureStore.setItemAsync(
          SECURE_STORE_USER_KEY,
          JSON.stringify({
            accessToken,
            refreshToken: state.user.refreshToken,
            id: state.user.id,
            email: state.user.email,
            role: role,
            major: state.user.major,
            createdAt: state.user.createdAt,
          })
        );
        setAuthState({
          user: {
            accessToken,
            refreshToken: state.user.refreshToken,
            id: state.user.id,
            email: state.user.email,
            role: state.user.role,
            major: state.user.major,
            createdAt: state.user.createdAt,
          },
          authenticated: true,
          isVerified: true,
        });
      } catch (e) {
        console.log(e);
        setAuthState({
          user: null,
          authenticated: false,
          isVerified: null,
        });
      }
    },
    []
  );

  const verify = useMemo(
    () => async (code: string) => {
      // this should exists because we need the userId to send the verification request
      const storedUser = await SecureStore.getItemAsync(SECURE_STORE_USER_KEY);
      if (!storedUser) return;
      const user = JSON.parse(storedUser) as User;

      try {
        const { accessToken, email, refreshToken, id, createdAt, major } =
          await new AuthApi().verify(code, user.id.toString());

        const role: UserRole = (jwt_decode(accessToken) as { role: UserRole }).role;

        await SecureStore.setItemAsync(
          SECURE_STORE_USER_KEY,
          JSON.stringify({
            accessToken,
            refreshToken: refreshToken,
            id: id,
            email: email,
            role: role,
            major: major,
            createdAt: createdAt,
          })
        );
        setAuthState({
          user: {
            accessToken,
            refreshToken: refreshToken,
            id: id,
            email: email,
            role: role,
            major,
            createdAt,
          },
          authenticated: true,
          isVerified: true,
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    []
  );

  useEffect(() => {
    // Load user
    SecureStore.getItemAsync(SECURE_STORE_USER_KEY)
      .then((r) => {
        if (!r) {
          setAuthState({
            user: null,
            authenticated: false,
            isVerified: null,
          });

          return;
        }
        const u = JSON.parse(r) as User;
        if (!u || !u.accessToken || !u.refreshToken) {
          setAuthState({
            user: {
              accessToken: u?.accessToken ?? undefined,
              refreshToken: u?.refreshToken ?? undefined,
              id: u?.id ?? null,
              email: u?.email ?? null,
              role: u?.role ?? undefined,
              major: u?.major ?? null,
              createdAt: u?.createdAt ?? null,
            },
            authenticated: false,
            isVerified: authState.isVerified ?? null,
          });
          return;
        }

        setAuthState({
          user: u,
          authenticated: true,
          isVerified: true,
        });
      })
      .catch((e) => {
        console.log(e);
        setAuthState({
          user: null,
          authenticated: false,
          isVerified: null,
        });
      });
  }, []);

  useEffect(() => {
    // handle jwt expiry
    console.log('AuthContext', authState);
    if (!authState.user || !authState.user.accessToken) return;
    let handle: NodeJS.Timeout | null = null;
    const { exp } = jwt_decode(authState.user.accessToken) as { exp: number };

    if (+new Date() - exp * 1000 > 0) {
      refresh(authState);
    } else {
      handle = setTimeout(
        () => {
          refresh(authState);
        },
        // refresh 1 second before expiry
        exp * 1000 - +new Date() + 1
      );
    }
    return () => {
      if (handle) clearTimeout(handle);
    };
  }, [refresh, authState]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (!authState.user || !authState.user.accessToken) return;
        refresh(authState);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: credentialsSignIn,
        signUp,
        signOut: async () => {
          try {
            await new AuthApi(useSession(authState)).signOut();
          } catch (e) {
            console.log(e);
          }
          await SecureStore.deleteItemAsync(SECURE_STORE_USER_KEY);
          setAuthState({
            user: null,
            authenticated: false,
            isVerified: null,
          });
        },
        verify: verify,
        authState,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
