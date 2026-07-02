import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  type User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser,
  reauthenticateWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  reauthenticateWithGoogle: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  // Firebase mutates auth.currentUser in place on updateProfile/reload — it
  // doesn't fire onAuthStateChanged, so consumers of `user` (sidebar, header)
  // won't re-render on their own. Spreading into a fresh object forces React
  // to notice the change. Only plain fields (displayName, photoURL, etc.) are
  // read from context elsewhere, so this is safe — nothing here calls methods
  // like getIdToken()/delete() directly on the context's `user` object.
  const updateDisplayName = async (name: string) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    await updateProfile(auth.currentUser, { displayName: name });
    await auth.currentUser.reload();
    setUser(auth.currentUser ? ({ ...auth.currentUser } as User) : null);
  };

  // Firebase requires a "recent" sign-in before allowing account deletion.
  // We only support Google sign-in, so re-auth means replaying the Google
  // popup to get a fresh credential.
  const reauthenticateWithGoogle = async () => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    await reauthenticateWithPopup(auth.currentUser, googleProvider);
  };

  const deleteAccount = async () => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    await deleteUser(auth.currentUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        logout,
        updateDisplayName,
        reauthenticateWithGoogle,
        deleteAccount,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;