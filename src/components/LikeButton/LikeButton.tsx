import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { IconButton } from '@mui/material';

interface LikeButtonProps {
  liked: boolean;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

export const LikeButton = ({ liked, onClick, disabled = false }: LikeButtonProps) => {
  return (
    <IconButton
      aria-label={liked ? 'Unlike' : 'Like'}
      onClick={onClick}
      color={liked ? 'error' : 'default'}
      disabled={disabled}
      size="small"
    >
      {liked ? <Favorite /> : <FavoriteBorder />}
    </IconButton>
  );
};
