import { create } from "zustand";

interface SheetStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSheetContext = create<SheetStore>(set => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
})); 