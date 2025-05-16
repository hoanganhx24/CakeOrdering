import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import HomeAdmin from "./pageAdmin/homeAdmin.jsx";
import Login from "./pageAdmin/login.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/homeadmin/:section",
    element: <HomeAdmin />,
  }
]);

export default router;
