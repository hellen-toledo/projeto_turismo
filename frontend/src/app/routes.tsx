import { createBrowserRouter } from 'react-router-dom';
import { AdminRoute } from '../features/admin/components/AdminRoute';
import { AdminLayout } from '../features/admin/layouts/AdminLayout';
import { AdminCitiesPage } from '../features/admin/pages/AdminCitiesPage';
import { AdminEventsPage } from '../features/admin/pages/AdminEventsPage';
import { AdminHomePage } from '../features/admin/pages/AdminHomePage';
import { AdminLoginPage } from '../features/admin/pages/AdminLoginPage';
import { CityDetailsPage } from '../pages/CityDetailsPage';
import { CitiesPage } from '../pages/CitiesPage';
import { EventsPage } from '../pages/EventsPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AppShell } from '../shared/components/AppShell';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'cidades',
        element: <CitiesPage />,
      },
      {
        path: 'cidades/:idOrSlug',
        element: <CityDetailsPage />,
      },
      {
        path: 'eventos',
        element: <EventsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminHomePage />,
          },
          {
            path: 'cities',
            element: <AdminCitiesPage />,
          },
          {
            path: 'events',
            element: <AdminEventsPage />,
          },
        ],
      },
    ],
  },
]);
