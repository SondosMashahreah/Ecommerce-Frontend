import {
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import BtmHeader from "./components/BtmHeader/BtmHeader";
import TopHeader from "./components/TopHeader/TopHeader";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";

import Signup from "./pages/Signup/Signup";
import VerifyOtp from "./pages/VerifyOtp/VerifyOtp";
import Signin from "./pages/Signin/Signin";
import Profile from "./pages/Profile/Profile";


function App() {
  const location = useLocation();

  const authPages = [
    "/signin",
    "/signup",
    "/verify-otp"
  ];

  const isAuthPage = authPages.includes(
    location.pathname
  );


  return (
    <>

      {!isAuthPage && (
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

      </Routes>

    </>
  );
}


export default App;