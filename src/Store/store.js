import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (product) => {
        const { favorites } = get();
        const isExist = favorites.find((item) => item.id === product.id);
        if (isExist) {
          set({ favorites: favorites.filter((item) => item.id !== product.id) });
        } else {
          set({ favorites: [...favorites, product] });
        }
      },
    }),
    { name: 'favorites-storage' }
  )
);

export const useModalStore = create((set) => ({
  isCreateOpen: false,
  openCreate: () => set({ isCreateOpen: true }),
  closeCreate: () => set({ isCreateOpen: false }),
}));