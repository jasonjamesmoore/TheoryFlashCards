import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NotebookRoute } from '@/notebook/components/NotebookRoute';
import { NotebookStateProvider } from '@/notebook/state/NotebookStateContext';
import { Home } from '@/Routes/Home';
import { Settings } from '@/Routes/Settings';
import { FlashcardsRouter } from '@/tools/flashcards/FlashcardsRouter';
import Layout from './components/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <NotebookStateProvider>
        <Layout />
      </NotebookStateProvider>
    ),
    children: [
      { index: true, element: <Home /> },
      {
        path: '/tools/flashcards/*',
        element: <FlashcardsRouter />,
      },
      {
        path: '/notebook',
        element: <NotebookRoute />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
