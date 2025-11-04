import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
// src/components/DeleteButton.tsx
import React from 'react';
import { useModalStore } from '@/store/useModalStore'; // Импортируем новый store

interface DeleteButtonProps {
  disabled?: boolean;
  productId: number; // Передаём id продукта
}

export const DeleteButton = ({ disabled = false, productId }: DeleteButtonProps) => {
  const openModal = useModalStore(s => s.openModal); // Получаем экшн открытия модалки

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal('confirmDelete', { id: productId });
  };

  return (
    <IconButton
      aria-label="Delete"
      onClick={handleClick} // Вызываем функцию открытия модалки
      color="error"
      disabled={disabled}
      size="small"
    >
      <Delete />
    </IconButton>
  );
};
