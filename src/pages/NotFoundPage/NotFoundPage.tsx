import { Button, Container, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Paper
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Страница не найдена
        </Typography>
        <Typography variant="body1" align="center" sx={{ mt: 2, mb: 3 }}>
          Извините, запрашиваемая вами страница не существует.
        </Typography>
        <Button
          type="button"
          fullWidth
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ mt: 1, mb: 1 }}
        >
          Назад
        </Button>
        <Button
          type="button"
          fullWidth
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{ mt: 1, mb: 1 }}
        >
          На главную
        </Button>
      </Paper>
    </Container>
  );
};
