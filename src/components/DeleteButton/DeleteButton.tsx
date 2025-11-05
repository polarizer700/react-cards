import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React from 'react';
import { useModalStore } from '@/store/useModalStore';

interface DeleteButtonProps {
  disabled?: boolean;
  productId: number;
}

export const DeleteButton = ({ disabled = false, productId }: DeleteButtonProps) => {
  const openModal = useModalStore(s => s.openModal);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal('confirmDelete', { id: productId });
  };

  return (
    <IconButton
      aria-label="Delete"
      onClick={handleClick}
      color="error"
      disabled={disabled}
      size="small"
    >
      <Delete />
    </IconButton>
  );
};
