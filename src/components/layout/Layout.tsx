import { Box, Container, Toolbar } from '@mui/material';
import type { ReactNode } from 'react';
import { Header } from './Header';
import {
  Person as PersonIcon,
  Assignment as TaskIcon,
} from '@mui/icons-material';
import type { MenuType } from './types';
import { useAuth } from '../../hooks';
import { Menu } from './Menu';
import { Footer } from './Footer';

interface Props {
  children: ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { logout, user } = useAuth();
  const menuOptions: MenuType[] = [
    { text: 'Mi Perfil', icon: <PersonIcon />, path: '/perfil' },
    { text: 'Mis Tareas', icon: <TaskIcon />, path: '/tasks' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        username={user?.username}
        logout={logout}
        menuOptions={menuOptions}
      />
      <Toolbar />

      <Box sx={{ flex: 1, display: 'flex' }}>
        <Menu menuOptions={menuOptions} />
        <Container sx={{ flex: 1, py: 3 }}>{children}</Container>
      </Box>
      <Footer message="© 2024 Mi Aplicación. Todos los derechos reservados." />
    </Box>
  );
};
