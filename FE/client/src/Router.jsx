import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import DetailProduct from "./pages/DetailProduct.jsx";
import Cart from "./pages/Cart.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Account from "./pages/Account.jsx";
import Contact from "./pages/Contact.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/menu/:section",
    element: <Menu />,
  },
  {
    path: "/detail/:id",
    element: <DetailProduct />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/ordersuccess",
    element: <OrderSuccess />,
  },
  {
    path: "/account/:section",
    element: <Account />,
  },
  {
    path: "/contact",
    element: <Contact />,
  }
]);

export default router;
