import { createBrowserRouter } from "react-router-dom";

import { DashboardPage } from "@/routes/dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
  },
]);
