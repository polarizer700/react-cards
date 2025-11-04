import { create } from 'zustand';

type ModalType = 'confirmDelete'; // Можно расширить для других типов модалок

interface ModalState {
  modalType: ModalType | null;
  isOpen: boolean;
  data: any; // Объект с данными, необходимыми для модального окна (например, id продукта)
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
