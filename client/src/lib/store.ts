import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, User, Admin, ProfileStatus, UserRole } from '@/lib/types';

interface AppState {
  currentUser: AuthUser | null;
  users: User[];
  admins: Admin[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<boolean>;
  updateProfile: (userId: string, userData: Partial<User>) => void;
  updateProfileStatus: (userId: string, status: ProfileStatus, rejectionReason?: string) => void;
  deleteUser: (userId: string) => void;
  createAdmin: (adminData: Partial<Admin>) => void;
  deleteAdmin: (adminId: string) => void;
  getVisibleProfiles: (gender: string) => User[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [
        {
          id: 'user1',
          name: 'User',
          email: 'user@matrimony.com',
          password: 'user123', 
          role: UserRole.USER,
          gender: 'MALE', 
          status: ProfileStatus.APPROVED,
          createdAt: new Date(),
          updatedAt: new Date(),        
        },
      ],
      admins: [
        {
          id: 'admin1',
          name: 'Super Admin',
          email: 'admin@matrimony.com',
          password: 'admin123', // In real app, this would be hashed
          role: UserRole.ADMIN,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],

      login: async (email: string, password: string) => {
        const { users, admins } = get();
        
        // Check admin login
        const admin = admins.find((a) => a.email === email && a.password === password);
        if (admin) {
          set({
            currentUser: {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: UserRole.ADMIN,
            },
          });
          return true;
        }

        // Check user login
        const user = users.find((u) => u.email === email && u.password === password);
        if (user) {
          set({
            currentUser: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: UserRole.USER,
              status: user.status,
              gender: user.gender,
            },
          });
          return true;
        }

        return false;
      },

      logout: () => {
        set({ currentUser: null });
      },

      register: async (userData: Partial<User>) => {
        const newUser: User = {
          id: `user_${Date.now()}`,
          role: UserRole.USER,
          status: ProfileStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...userData,
        } as User;

        set((state) => ({
          users: [...state.users, newUser],
        }));

        return true;
      },

      updateProfile: (userId: string, userData: Partial<User>) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  ...userData,
                  status: ProfileStatus.UNDER_REVIEW,
                  updatedAt: new Date(),
                }
              : user
          ),
        }));

        // Update current user if it's their profile
        const currentUser = get().currentUser;
        if (currentUser && currentUser.id === userId) {
          set({
            currentUser: {
              ...currentUser,
              status: ProfileStatus.UNDER_REVIEW,
            },
          });
        }
      },

      updateProfileStatus: (userId: string, status: ProfileStatus, rejectionReason?: string) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  status,
                  rejectionReason: rejectionReason || undefined,
                  updatedAt: new Date(),
                }
              : user
          ),
        }));

        // Update current user if it's their profile
        const currentUser = get().currentUser;
        if (currentUser && currentUser.id === userId) {
          set({
            currentUser: {
              ...currentUser,
              status,
            },
          });
        }
      },

      deleteUser: (userId: string) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== userId),
        }));
      },

      createAdmin: (adminData: Partial<Admin>) => {
        const newAdmin: Admin = {
          id: `admin_${Date.now()}`,
          role: UserRole.ADMIN,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...adminData,
        } as Admin;

        set((state) => ({
          admins: [...state.admins, newAdmin],
        }));
      },

      deleteAdmin: (adminId: string) => {
        // Don't allow deleting the last admin
        const { admins } = get();
        if (admins.length <= 1) return;

        set((state) => ({
          admins: state.admins.filter((admin) => admin.id !== adminId),
        }));
      },

      getVisibleProfiles: (gender: string) => {
        const { users } = get();
        // Males see female profiles, females see male profiles
        const oppositeGender = gender === 'MALE' ? 'FEMALE' : 'MALE';
        return users.filter(
          (user) => user.gender === oppositeGender && user.status === ProfileStatus.APPROVED
        );
      },
    }),
    {
      name: 'matrimony-storage',
    }
  )
);
