import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { jwtDecode } from 'jwt-decode';

import { clearToken, deleteCookie, getToken, storeToken } from '@/lib/utils';

interface UserDetails {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserState {
  isAuthenticated: boolean;
  user: UserDetails | null;
  role: string | null;
  signin: (token: string) => Promise<void>;
  signout: () => Promise<void>;
  getUser: () => UserDetails | null;
  checkTokenExpiration: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      immer((set, get) => ({
        isAuthenticated: false,
        user: null,
        role: null,
        signin: async (token: string) => {
          const decodedToken = jwtDecode<UserDetails>(token);
          set((state) => {
            state.isAuthenticated = true;
            state.user = decodedToken;
            state.role = decodedToken.role;
          });
          await storeToken(token);
          document.cookie = `token=${token}; path=/`;
        },
        signout: async () => {
          set((state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.role = null;
          });
          await clearToken();
          deleteCookie('token');
        },
        getUser: () => get().user,
        checkTokenExpiration: async () => {
          const token = getToken('token');
          if (token) {
            try {
              const decodedToken = jwtDecode<{ user: UserDetails; roles: string[]; exp: number }>(token);
              const currentTime = Math.floor(Date.now() / 1000);

              if (decodedToken.exp < currentTime) {
                await clearToken();
                deleteCookie('token');
                set({ isAuthenticated: false, user: null, role: null });
              } else {
                set({
                  isAuthenticated: true,
                  user: decodedToken.user,
                  role: decodedToken.roles[0] || null,
                });
              }
            } catch (error) {
              console.error('Error decoding token:', error);
              await clearToken();
              deleteCookie('token');
              set({ isAuthenticated: false, user: null, role: null });
            }
          } else {
            set({ isAuthenticated: false, user: null, role: null });
          }
        },
      })),
      {
        name: 'user-storage',
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          role: state.role,
        }),
      }
    )
  )
);
