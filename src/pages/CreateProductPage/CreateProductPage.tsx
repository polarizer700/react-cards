import type { ProductFormData } from '@/api/model/createProduct.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowBack } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow'; // Импортируем useShallow
import { productSchema } from '@/api/model/createProduct.ts';
import { useProductStore } from '@/store/useProductStore'; // Импортируем store

export const CreateProductPage = () => {
  const navigate = useNavigate();

  const { loading, error } = useProductStore(
    useShallow(s => ({
      loading: s.loading,
      error: s.error,
    })),
  );
  const storeCreateProduct = useProductStore(s => s.createProduct);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      price: 0,
      description: '',
      category: '',
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      await storeCreateProduct(data);
      navigate('/products');
    } catch (err) {
      console.error('Ошибка в onSubmit:', err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Назад
        </Button>

        <Typography variant="h5" gutterBottom>
          Создать продукт
        </Typography>

        {/* Отображаем ошибку из store */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            margin="normal"
            fullWidth
            label="Название"
            autoFocus
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            disabled={loading}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Цена"
            type="number"
            InputProps={{ inputProps: { step: 0.01 } }}
            {...register('price', { valueAsNumber: true })}
            error={!!errors.price}
            helperText={errors.price?.message}
            disabled={loading}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Описание"
            multiline
            rows={4}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            disabled={loading}
          />

          <FormControl fullWidth margin="normal" error={!!errors.category} disabled={loading}>
            <InputLabel id="category-label">Категория</InputLabel>
            <Select
              labelId="category-label"
              label="Категория"
              {...register('category')}
            >
              <MenuItem value="electronics">Электроника</MenuItem>
              <MenuItem value="jewelery">Ювелирные изделия</MenuItem>
              <MenuItem value="men's clothing">Мужская одежда</MenuItem>
              <MenuItem value="women's clothing">Женская одежда</MenuItem>
            </Select>
            {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
          </FormControl>

          <TextField
            margin="normal"
            fullWidth
            label="URL изображения"
            {...register('image')}
            error={!!errors.image}
            helperText={errors.image?.message}
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Создание...' : 'Создать'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
