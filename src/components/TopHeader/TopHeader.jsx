import { useTranslation } from "react-i18next";
import { translate as t } from "../../i18n";
import { ThemeSelector } from '../../preferences/Controls';
import React, {
  useEffect,
  useState
} from "react";

import logo from "./img/logo.png";

import {
  Link,
  useNavigate
} from "react-router-dom";

import { FcSearch } from "react-icons/fc";
import { FiHeart, FiUser } from "react-icons/fi";
import {
  MdOutlineShoppingCart,
  MdDashboard
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { PiSignOutFill } from "react-icons/pi";

import "./TopHeader.css";

import {
  searchProducts,
  getCart,
  getFavorites,
  getCurrentUser
} from "../../services/api";

function TopHeader() {
  useTranslation(); // Subscribe this screen to language changes.

  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [headerUser, setHeaderUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      const searchText = query.trim();

      if (searchText.length < 3) {
        setResults([]);
        return;
      }

      try {
        const data = await searchProducts(searchText);
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      }
    }, 150);

    return () => {
      clearTimeout(searchTimer);
    };
  }, [query]);

  const handleProductClick = (productId) => {
    const productElement = document.getElementById(
      `product-${productId}`
    );

    if (productElement) {
      productElement.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      productElement.classList.add("search-highlight");

      setTimeout(() => {
        productElement.classList.remove("search-highlight");
      }, 1000);

      setResults([]);
      setQuery("");
    } else {
      console.log("Product not found:", productId);
    }
  };

  const loadCartCount = async () => {
    try {
      const cart = await getCart();

      const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount(count);
    } catch (error) {
      console.error(
        "Failed to load cart count:",
        error
      );
    }
  };

  const loadFavoritesCount = async () => {
    try {
      const favorites = await getFavorites();
      setFavoritesCount(favorites.length);
    } catch (error) {
      console.error(
        "Failed to load favorites count:",
        error
      );
    }
  };

  useEffect(() => {
    loadCartCount();

    window.addEventListener(
      "cartUpdated",
      loadCartCount
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        loadCartCount
      );
    };
  }, []);

  useEffect(() => {
    loadFavoritesCount();

    window.addEventListener(
      "favoritesUpdated",
      loadFavoritesCount
    );

    return () => {
      window.removeEventListener(
        "favoritesUpdated",
        loadFavoritesCount
      );
    };
  }, []);

  const handleProfileLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    window.dispatchEvent(
      new Event("authChanged")
    );

    setIsProfileOpen(false);

    navigate("/signin");
  };

  useEffect(() => {
    const loadHeaderUser = async () => {
      const token = localStorage.getItem(
        "access_token"
      );

      if (!token) {
        setHeaderUser(null);
        return;
      }

      try {
        const data = await getCurrentUser();
        setHeaderUser(data);
      } catch (error) {
        console.error(
          "Failed to load header user:",
          error
        );

        setHeaderUser(null);
      }
    };

    loadHeaderUser();

    window.addEventListener(
      "profileUpdated",
      loadHeaderUser
    );

    window.addEventListener(
      "authChanged",
      loadHeaderUser
    );

    return () => {
      window.removeEventListener(
        "profileUpdated",
        loadHeaderUser
      );

      window.removeEventListener(
        "authChanged",
        loadHeaderUser
      );
    };
  }, []);

  return (
    <div className="top_header">
      <div className="container">

        <Link
          className="logo"
          to="/"
        >
          <img
            src={logo}
            alt={t("Logo")}
          />
        </Link>

        <div className="profile_menu_wrapper">

          <button
            type="button"
            className="profile_btn"
            aria-expanded={isProfileOpen}
            aria-controls="profile-options"
            onClick={() =>
              setIsProfileOpen(!isProfileOpen)
            }
          >
            {headerUser?.profile_image_path ? (
              <img
                className="header_profile_image"
                src={
                  `${import.meta.env.VITE_API_URL}` +
                  `/api/v1/assets/${headerUser.profile_image_path}`
                }
                alt={headerUser.name}
              />
            ) : (
              <FaUserCircle />
            )}

            <span>
              {headerUser?.name || t("Profile")}
            </span>
          </button>

          <div
            id="profile-options"
            inert={!isProfileOpen}
            className={`profile_sidebar ${
              isProfileOpen ? "active" : ""
            }`}
          >

            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(false);
                navigate("/profile");
              }}
            >
              <FiUser />
              <span>{t("My Profile")}</span>
            </button>

            {headerUser && (
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/orders");
                }}
              >
                <MdOutlineShoppingCart />
                <span>{t("My Orders")}</span>
              </button>
            )}

            <ThemeSelector />

            {headerUser?.role === "admin" && (
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/admin");
                }}
              >
                <MdDashboard />
                <span>{t("Dashboard")}</span>
              </button>
            )}

            <button
              type="button"
              className="profile_logout"
              onClick={handleProfileLogout}
            >
              <PiSignOutFill />
              <span>{t("Logout")}</span>
            </button>

          </div>
        </div>

        <div className="search_wrapper">

          <form
            className="search_box"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              name="search"
              id="search"
              placeholder={t("Search for products")}
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
            />

            <button type="submit" aria-label={t("Search")}>
              <FcSearch />
            </button>
          </form>

          {results.length > 0 && (
            <div className="search_results">

              {results.map((product) => (
                <div
                  className="search_result_item"
                  key={product.id}
                  onClick={() =>
                    handleProductClick(product.id)
                  }
                >
                  <p>{product.name}</p>
                </div>
              ))}

            </div>
          )}

        </div>

        <div className="header_icons">

          <Link
            to="/favorites"
            aria-label={t("Favorites")}
            className="icon"
          >
            <FiHeart />

            <span className="count">
              {favoritesCount}
            </span>
          </Link>

          <Link
            to="/cart"
            aria-label={t("Cart")}
            className="icon"
          >
            <MdOutlineShoppingCart />

            <span className="count">
              {cartCount}
            </span>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default TopHeader;