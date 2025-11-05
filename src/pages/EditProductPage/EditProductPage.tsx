import type { ProductFormData } from '@/api/model/createProduct.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowBack, Save } from '@mui/icons-material';
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
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { productSchema } from '@/api/model/createProduct.ts';
import { useProductStore } from '@/store/useProductStore';

export const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const products = useProductStore(s => s.products);
  const storeUpdateProduct = useProductStore(s => s.updateProduct);
  const loading = useProductStore(s => s.loading);
  const error = useProductStore(s => s.error);

  const productToEdit = products.find(p => p.id === Number(id));

  useEffect(() => {
    if (!productToEdit && !loading) {
      console.error(`Продукт с id ${id} не найден в store.`);
    }
  }, [productToEdit, id, loading, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: productToEdit?.title || '',
      price: productToEdit?.price || 0,
      description: productToEdit?.description || '',
      category: productToEdit?.category || '',
      image: productToEdit?.image || 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    },
  });

  useEffect(() => {
    if (productToEdit) {
      reset({
        title: productToEdit.title,
        price: productToEdit.price,
        description: productToEdit.description,
        category: productToEdit.category,
        image: productToEdit.image,
      });
    }
  }, [productToEdit, reset]);

  const onSubmit = async (data: ProductFormData) => {
    if (!productToEdit)
      return;
    try {
      await storeUpdateProduct(productToEdit.id, data);
      navigate(`/products/${productToEdit.id}`);
    } catch (err) {
      console.error('Ошибка в onSubmit:', err);
    }
  };

  if (!productToEdit && !loading) {
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

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Назад
        </Button>

        <Typography variant="h5" gutterBottom>
          Редактировать продукт
        </Typography>

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
            startIcon={<Save />}
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
