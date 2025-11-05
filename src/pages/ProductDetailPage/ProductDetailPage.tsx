import type { Product } from '@/types';
import { ArrowBack, Edit } from '@mui/icons-material';
import { Avatar, Box, Button, Container, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductStore } from '@/store/useProductStore';
import styles from './ProductDetailPage.module.css';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const products = useProductStore(s => s.products);

  const product = products.find(p => p.id === Number(id)) as Product | undefined;

  if (!product) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Продукт не найден
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Назад к списку
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box className={styles.btnWrapper}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Назад
          </Button>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/products/${id}/edit`)}
          >
            Редактировать
          </Button>
        </Box>
        {/* Детали продукта */}
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={product.image}
            alt={product.title}
            variant="rounded"
            sx={{ width: 100, height: 100, mr: 2 }}
          />
          <Typography variant="h4">{product.title}</Typography>
        </Box>

        <Typography variant="h6" color="primary" gutterBottom>
          $
          {product.price.toFixed(2)}
        </Typography>

        <Typography variant="body1" gutterBottom>
          <strong>Категория:</strong>
          {' '}
          {product.category}
        </Typography>

        <Typography variant="body2" gutterBottom>
          <strong>Описание:</strong>
          {' '}
          {product.description}
        </Typography>

      </Paper>
    </Container>
  );
};
