"use client";

import { useEffect } from 'react';
import { create } from 'zustand';

export type AnonymousUserProfile = {
  firstName: string;
  lastName: string;
  region: string;
  city: string;
  userRoles: string[];
};

type UserProfileStore = {
  profile: AnonymousUserProfile | null;
  isHydrated: boolean;
  setAnonymousProfile: (data: AnonymousUserProfile) => void;
  hydrateFromStorage: () => void;
};

const STORAGE_KEY = 'mitsors-wizard-data';

const useUserProfileStore = create<UserProfileStore>((set) => ({
  profile: null,
  isHydrated: false,
  setAnonymousProfile: (data) => {
    const payload: AnonymousUserProfile = {
      ...data,
      userRoles: data.userRoles ?? [],
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error('Failed to persist anonymous profile', error);
    }

    set({ profile: payload, isHydrated: true });
  },
  hydrateFromStorage: () =>
    set((state) => {
      if (state.isHydrated) return state;

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as AnonymousUserProfile;
          return { profile: parsed, isHydrated: true };
        }
      } catch (error) {
        console.error('Failed to read anonymous profile', error);
      }

      return { ...state, isHydrated: true };
    }),
}));

export function useUserProfile() {
  const profile = useUserProfileStore((state) => state.profile);
  const isHydrated = useUserProfileStore((state) => state.isHydrated);
  const hydrateFromStorage = useUserProfileStore((state) => state.hydrateFromStorage);
  const setAnonymousProfile = useUserProfileStore((state) => state.setAnonymousProfile);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  return {
    data: profile,
    isLoading: !isHydrated,
    setAnonymousProfile,
  };
}
