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
import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchProducts as apiFetchProducts } from '@/api/apiClient';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { useProductStore } from '@/store/useProductStore';
import styles from './ProductsPage.module.css';

const itemsPerPage = 6;

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlFilter = searchParams.get('filter');
  const filter = (urlFilter === 'liked' || urlFilter === 'all') ? urlFilter : 'all';

  const urlPage = searchParams.get('page');
  const initialPage = urlPage ? Number.parseInt(urlPage, 10) : 1;
  const currentPage = Number.isNaN(initialPage) ? 1 : initialPage;

  const {
    products,
    getFilteredProducts,
    loading,
    error,
    searchTerm: storeSearchTerm,
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
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0 && !loading) {
      const newParams = new URLSearchParams(searchParams);
      if (totalPages === 1) {
        newParams.delete('page');
      } else {
        newParams.set('page', '1');
      }
      setSearchParams(newParams, { replace: true });
    }
  }, [filteredProducts, totalPages, currentPage, searchParams, setSearchParams, loading]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsForCurrentPage = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    if (value === 1) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('page');
      setSearchParams(newParams);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams.entries()), page: value.toString() });
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = event.target.value as 'all' | 'liked';
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('filter', newFilter);
    if (storeSearchTerm) {
      newSearchParams.set('searchTerm', storeSearchTerm);
    }
    setSearchParams(newSearchParams);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    const newSearchParams = new URLSearchParams();
    if (newSearchTerm) {
      newSearchParams.set('searchTerm', newSearchTerm);
    }
    if (filter) {
      newSearchParams.set('filter', filter);
    }
    newSearchParams.delete('page');
    setSearchParams(newSearchParams);
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
            value={storeSearchTerm}
            onChange={handleSearchChange}
            margin="normal"
            sx={{ mb: 2 }}
          />

          <RadioGroup
            row
            value={filter}
            onChange={handleFilterChange}
            aria-label="filter"
          >
            <FormControlLabel value="all" control={<Radio />} label="Все" />
            <FormControlLabel value="liked" control={<Radio />} label="Избранные" />
          </RadioGroup>
        </Paper>

        {productsForCurrentPage.length === 0
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
