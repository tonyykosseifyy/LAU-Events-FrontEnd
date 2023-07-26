import { Session } from '../../types/auth';
import { AuthState } from '../context/AuthContext';

const useSession = (authState: AuthState): Session | null => {
  if (!authState.authenticated || !authState.user) {
    return null;
  }
  const session: Session = {
    accessToken: authState.user?.accessToken,
    refreshToken: authState.user?.refreshToken,
  };
  return session;
};

export default useSession;
