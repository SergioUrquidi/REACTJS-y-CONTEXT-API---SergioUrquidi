import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage, NotFoundPage, UserPage } from '../pages/public';
import { PerfilPage, TaskPage } from '../pages/private';
import { PrivateLayout } from '../layouts/PrivateLayout';
import { PublicRoute } from './PublicRouter';

/*
BrowserRouter es un componente que se encarga de manejar la historia de navegación de la aplicación. Es el componente principal que envuelve a toda la aplicación y permite que se puedan definir rutas dentro de ella.
Routes es un componente que se utiliza para agrupar varias rutas (Route) dentro de la aplicación. Es necesario para que React Router pueda manejar correctamente las rutas definidas.
Route es un componente que se utiliza para definir una ruta específica dentro de la aplicación. Se le puede asignar un path (ruta) y un componente que se renderizará cuando el usuario navegue a esa ruta.
*/

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user" element={<UserPage />} />
        </Route>

        <Route element={<PrivateLayout />}>
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/tasks" element={<TaskPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
