import type { Product } from '@/types';
import { Box, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { DeleteButton } from '@/components/DeleteButton';
import { LikeButton } from '@/components/LikeButton';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onToggleLike: (id: number) => void;
}

export const ProductCard = ({ product, onToggleLike }: ProductCardProps) => {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(product.id);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Box sx={{ height: 140, overflow: 'hidden' }}>
          <CardMedia
            component="img"
            image={product.image}
            alt={product.title}
            sx={{ objectFit: 'contain', p: 1, maxHeight: 140 }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, pb: 1, minHeight: 80 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {product.title}
          </Typography>
          <Typography className={styles.clamp2} variant="body2" color="text.secondary">
            {product.description}
          </Typography>
          <Typography sx={{ mb: 1 }} variant="body2" color="text.secondary" noWrap>
            Категория:
            {' '}
            {product.category}
          </Typography>
          <Typography variant="body1" color="primary" fontWeight="bold">
            $
            {product.price.toFixed(2)}
          </Typography>
        </CardContent>
      </Link>
      <CardActions sx={{ justifyContent: 'space-between', pb: 1 }}>
        <Box display="flex" gap={1}>
          <LikeButton
            liked={product.liked ?? false}
            onClick={handleLikeClick}
          />

          <DeleteButton
            disabled={false}
            productId={product.id}
          />
        </Box>
      </CardActions>
    </Card>
  );
};
