import {
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import BtmHeader from "./components/BtmHeader/BtmHeader";
import TopHeader from "./components/TopHeader/TopHeader";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import SessionManager from "./components/SessionManager/SessionManager";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";

import Signup from "./pages/Signup/Signup";
import VerifyOtp from "./pages/VerifyOtp/VerifyOtp";
import Signin from "./pages/Signin/Signin";
import Profile from "./pages/Profile/Profile";

import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";
import Favorites from "./pages/Favorites/Favorites";

import Orders from "./pages/Orders/Orders";
import OrderDetails from "./pages/OrderDetails/OrderDetails";

import AdminRoute from "./components/AdminRoute/AdminRoute";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";

import AdminProducts from "./pages/Admin/Products/AdminProducts";
import AdminProductCreate from "./pages/Admin/Products/AdminProductCreate";
import AdminProductEdit from "./pages/Admin/Products/AdminProductEdit";

import AdminCategories from "./pages/Admin/Categories/AdminCategories";
import AdminInventory from "./pages/Admin/Inventory/AdminInventory";

import AdminOrders from "./pages/Admin/Orders/AdminOrders";
import AdminOrderDetails from "./pages/Admin/Orders/AdminOrderDetails";

import AdminCustomers from "./pages/Admin/Customers/AdminCustomers";
import AdminCustomerDetails from "./pages/Admin/Customers/AdminCustomerDetails";

import AdminMessages from "./pages/Admin/Messages/AdminMessages";
import AdminMessageDetails from "./pages/Admin/Messages/AdminMessageDetails";

import AdminLayout from "./layouts/AdminLayout/AdminLayout";


function App() {
  const location = useLocation();

  const authPages = [
    "/signin",
    "/signup",
    "/verify-otp"
  ];

  const isAuthPage =
    authPages.includes(
      location.pathname
    );

  const isAdminPage =
    location.pathname.startsWith(
      "/admin"
    );


  return (
    <>
      <SessionManager />

      {!isAuthPage && !isAdminPage && (
        <header>
          <TopHeader />
          <BtmHeader />
        </header>
      )}

      <Routes>

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />


        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />


        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />


        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/signup"
          element={<Signup />}
        />


        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />


        <Route
          path="/signin"
          element={<Signin />}
        />


        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />


        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />


        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />


        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />


        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >

          <Route
            index
            element={
              <AdminDashboard />
            }
          />


          <Route
            path="products"
            element={
              <AdminProducts />
            }
          />


          <Route
            path="products/new"
            element={
              <AdminProductCreate />
            }
          />


          <Route
            path="products/:id"
            element={
              <AdminProductEdit />
            }
          />


          <Route
            path="categories"
            element={
              <AdminCategories />
            }
          />


          <Route
            path="inventory"
            element={
              <AdminInventory />
            }
          />


          <Route
            path="orders"
            element={
              <AdminOrders />
            }
          />


          <Route
            path="orders/:id"
            element={
              <AdminOrderDetails />
            }
          />


          <Route
            path="customers"
            element={
              <AdminCustomers />
            }
          />


          <Route
            path="customers/:id"
            element={
              <AdminCustomerDetails />
            }
          />


          <Route
            path="messages"
            element={
              <AdminMessages />
            }
          />


          <Route
            path="messages/:id"
            element={
              <AdminMessageDetails />
            }
          />

        </Route>

      </Routes>
    </>
  );
}


export default App;