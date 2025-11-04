import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage.tsx';
import { CreateProductPage } from './pages/CreateProductPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductsPage } from './pages/ProductsPage';

const theme = createTheme();

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename="/react-cards">
        <Layout>
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/create-product" element={<CreateProductPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};
