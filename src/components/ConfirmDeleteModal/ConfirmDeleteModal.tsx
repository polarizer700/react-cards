import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// src/components/ConfirmDeleteModal.tsx
import { useShallow } from 'zustand/react/shallow'; // <-- Убедись, что импортировал useShallow
import { useModalStore } from '@/store/useModalStore';
import { useProductStore } from '@/store/useProductStore';

export const ConfirmDeleteModal = () => {
  // Используем useShallow
  const { isOpen, data, closeModal } = useModalStore(
    useShallow(state => ({
      isOpen: state.isOpen && state.modalType === 'confirmDelete',
      data: state.data,
      closeModal: state.closeModal, // <-- closeModal объявлен ТОЛЬКО здесь
    })),
  );
    // closeModal НЕ должен объявляться снова отдельно, если он уже в объекте выше
  const deleteProduct = useProductStore(s => s.deleteProduct);

  const productId = data?.id;
  const productName = useProductStore(s => s.products.find(p => p.id === productId)?.title) || 'этот элемент';

  const handleConfirm = () => {
    if (productId !== undefined) {
      deleteProduct(productId);
    }
    closeModal(); // Используем closeModal из селектора
  };

  const handleCancel = () => {
    closeModal(); // Используем closeModal из селектора
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleCancel}
      aria-labelledby="confirm-delete-dialog-title"
      aria-describedby="confirm-delete-dialog-description"
    >
      <DialogTitle id="confirm-delete-dialog-title">
        Подтвердите удаление
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-delete-dialog-description">
          Вы уверены, что хотите удалить "
          {productName}
          "?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>
          Нет
        </Button>
        <Button onClick={handleConfirm} color="error" autoFocus>
          Да
        </Button>
      </DialogActions>
    </Dialog>
  );
};
