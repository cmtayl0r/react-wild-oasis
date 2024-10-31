import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient({
  // default options for all queries in this client
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // staleTime is the time after which the query will be considered stale
    },
  },
});

// PAGES
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
// LAYOUT
import AppLayout from "./ui/AppLayout";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate replace to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "bookings",
        element: <Bookings />,
      },
      {
        path: "cabins",
        element: <Cabins />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "account",
        element: <Account />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <GlobalStyles /> {/* // Global styles for the app */}
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
