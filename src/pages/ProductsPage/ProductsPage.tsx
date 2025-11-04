// src/pages/ProductsPage.tsx
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts as apiFetchProducts } from '@/api/apiClient';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { useProductStore } from '@/store/useProductStore';
import styles from './ProductsPage.module.css';

export const ProductsPage = () => {
  const [filter, setFilter] = useState<'all' | 'liked'>('all');
  const {
    products,
    getFilteredProducts,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    setProducts,
    setLoading,
    setError,
    toggleLike,
  } = useProductStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (products.length > 0) {
      return;
    }

    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetchProducts();
        const productsWithLike = data.map(product => ({ ...product, liked: false }));
        setProducts(productsWithLike);
      } catch (err) {
        setError('Ошибка при загрузке продуктов');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [products, setProducts, setLoading, setError, navigate]);

  const filteredProducts = getFilteredProducts(filter);

  if (loading)
    return <Typography sx={{ mt: 4 }}>Загрузка...</Typography>;
  if (error) {
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        Ошибка:
        {error}
      </Typography>
    );
  }

  return (
    <Box>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Продукты</Typography>
          <Button component={Link} to="/create-product" variant="contained" color="primary">
            + Добавить продукт
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Поиск..."
            variant="outlined"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            margin="normal"
            sx={{ mb: 2 }}
          />

          <RadioGroup
            row
            value={filter}
            onChange={e => setFilter(e.target.value as 'all' | 'liked')}
            aria-label="filter"
          >
            <FormControlLabel value="all" control={<Radio />} label="Все" />
            <FormControlLabel value="liked" control={<Radio />} label="Избранные" />
          </RadioGroup>
        </Paper>

        {filteredProducts.length === 0
          ? (
              <Typography variant="h6" color="text.secondary" sx={{ mt: 4 }}>
                Нет продуктов для отображения
              </Typography>
            )
          : (
              <Box className={styles.productList}>
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onToggleLike={toggleLike}
                  />
                ))}
              </Box>
            )}
      </Container>

      <ConfirmDeleteModal />
    </Box>
  );
};
