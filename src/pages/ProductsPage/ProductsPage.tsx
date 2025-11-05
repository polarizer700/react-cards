import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchProducts as apiFetchProducts } from '@/api/apiClient';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { useProductStore } from '@/store/useProductStore';
import styles from './ProductsPage.module.css';

const itemsPerPage = 6;

export const ProductsPage = () => {
  const [filter, setFilter] = useState<'all' | 'liked'>('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

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
    const pageFromUrl = searchParams.get('page');
    const initialPage = pageFromUrl ? Number.parseInt(pageFromUrl, 10) : 1;
    setCurrentPage(Number.isNaN(initialPage) ? 1 : initialPage);
  }, [searchParams]);

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

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsForCurrentPage = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    if (value === 1) {
      setSearchParams({});
    } else {
      setSearchParams({ page: value.toString() });
    }
  };

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

        {productsForCurrentPage
          && productsForCurrentPage.length === 0
          ? (
              <Typography variant="h6" color="text.secondary" sx={{ mt: 4 }}>
                Нет продуктов для отображения
              </Typography>
            )
          : (
              <Box className={styles.productList}>
                {productsForCurrentPage.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onToggleLike={toggleLike}
                  />
                ))}
              </Box>
            )}

        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Container>

      <ConfirmDeleteModal />
    </Box>
  );
};
