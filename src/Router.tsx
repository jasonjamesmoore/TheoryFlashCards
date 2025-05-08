import { createBrowserRouter, RouterProvider } from "react-router-dom";
import  Layout  from "./components/Layout";
import { Home }  from "./Routes/Home";
import { Settings } from "./Routes/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/settings",
        element: <Settings />,
         // Optional: You can add subroutes for specific modes
        // children: [
        //   { path: 'note-to-degree', element: <NoteToDegree /> },
        //   { path: 'degree-to-note', element: <DegreeToNote /> },
        // ],
      },
    ],
  },
]);


export function Router() {
  return <RouterProvider router={router} />;
}
