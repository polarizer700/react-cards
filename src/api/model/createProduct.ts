import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().min(3, 'Название должно быть не короче 3 символов'),
  price: z.number().positive('Цена должна быть положительной'),
  description: z.string().min(10, 'Описание должно быть не короче 10 символов'),
  category: z.string().min(1, 'Категория обязательна'),
  image: z.string().url('Поле изображения должно быть корректным URL'),
});

export type ProductFormData = z.infer<typeof productSchema>;
