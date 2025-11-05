import { create } from 'zustand';

type ModalType = 'confirmDelete';

interface ModalState {
  modalType: ModalType | null;
  isOpen: boolean;
  data: any;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>(set => ({
  modalType: null,
  isOpen: false,
  data: null,
  openModal: (type, data = null) => set({ modalType: type, isOpen: true, data }),
  closeModal: () => set({ modalType: null, isOpen: false, data: null }),
}));
