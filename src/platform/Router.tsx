import { createBrowserRouter, RouterProvider } from "react-router-dom";
import  Layout  from "./components/Layout";
import { Home }  from "@/Routes/Home";
import { Settings } from "@/Routes/Settings";
import { FlashcardsRouter } from "@/tools/flashcards/FlashcardsRouter";
import { NotebookRoute } from "@/notebook/components/NotebookRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/tools/flashcards/*",
        element: <FlashcardsRouter />,
      },
      {
        path: "/notebook",
        element: <NotebookRoute />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
