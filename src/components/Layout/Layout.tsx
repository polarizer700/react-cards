import { Box, Container } from '@mui/material';
import styles from './Layout.module.css';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box className={styles.wrapper}>
      <Container maxWidth="lg">
        {children}
      </Container>
    </Box>
  );
};
