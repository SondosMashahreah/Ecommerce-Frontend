import { useTranslation } from "react-i18next";
import { translate as t } from "../../i18n";
import i18n from "../../i18n";
import { localizedProductDescription, localizedProductName } from "../../i18n/productContent";
import React, {
  useEffect,
  useState
} from "react";

import {
  FaHeart,
  FaShoppingCart,
  FaEye
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import {
  getFavorites,
  removeFavorite,
  addToCart
} from "../../services/api";

import "./Favorites.css";
import ProductImage from "../../components/ProductImage/ProductImage";

function Favorites() {
  useTranslation(); // Subscribe this screen to language changes.

  const navigate = useNavigate();

  const [favorites, setFavorites] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [removingId, setRemovingId] =
    useState(null);


  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data =
          await getFavorites();

        setFavorites(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);


  const handleRemove = async (id) => {
    if (removingId === id) {
      return;
    }

    try {
      setRemovingId(id);

      await removeFavorite(id);

      setFavorites(
        (currentFavorites) =>
          currentFavorites.filter(
            (favorite) =>
              favorite.id !== id
          )
      );

      window.dispatchEvent(
        new Event("favoritesUpdated")
      );
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          t("Failed to remove favorite")
      );
    } finally {
      setRemovingId(null);
    }
  };


  const handleAddToCart = async (
    product
  ) => {
    if (product.stock === 0) {
      return;
    }

    try {
      await addToCart(product.id);

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      alert(t("Added to cart"));
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          t("Failed to add product to cart")
      );
    }
  };


  if (loading) {
    return (
      <main className="favorites_page">
        <div className="favorites_state">{t("Loading favorites...")}</div>
      </main>
    );
  }


  return (
    <main className="favorites_page">

      <div className="favorites_heading">

        <div>
          <span>{t("Saved Products")}</span>

          <h1>{t("My Favorites")}</h1>
        </div>

        {favorites.length > 0 && (
          <div className="favorites_count">
            <FaHeart />

            {favorites.length}
          </div>
        )}

      </div>


      {favorites.length === 0 ? (

        <section className="empty_favorites">

          <div className="empty_favorites_icon">
            <FaHeart />
          </div>

          <h2>{t("No favorites yet")}</h2>

          <p>{t("Products you love will appear here.")}</p>

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
          >{t("Explore Products")}</button>

        </section>

      ) : (

        <div className="favorites_grid">

          {favorites.map(
            (favorite) => {

              const product =
                favorite.product;

              const imageUrl =
                product.image_path
                  ? `${import.meta.env.VITE_API_URL}/api/v1/assets/${product.image_path}`
                  : "";

              return (
                <article
                  className="favorite_card"
                  key={favorite.id}
                >

                  <button
                    type="button"
                    className="favorite_heart_btn active"
                    onClick={() =>
                      handleRemove(
                        favorite.id
                      )
                    }
                    disabled={
                      removingId ===
                      favorite.id
                    }
                    title={t("Remove from Favorites")}
                  >
                    <FaHeart />
                  </button>


                  {imageUrl && (
                    <ProductImage
                      imagePath={product.image_path}
                      alt={localizedProductName(product.name, i18n.language)}
                      size="favorite"
                      className="favorite_image"
                    />
                  )}


                  <div className="favorite_info">

                    <h3>
                      {localizedProductName(product.name, i18n.language)}
                    </h3>

                    <p className="favorite_description">
                      {localizedProductDescription(product.description, i18n.language)}
                    </p>

                    <strong className="favorite_price">
                      $
                      {Number(
                        product.price
                      ).toFixed(2)}
                    </strong>


                    {product.stock === 0 && (
                      <span className="favorite_stock_out">{t("Out of Stock")}</span>
                    )}


                    <div className="favorite_actions">

                      <button
                        type="button"
                        className="favorite_cart_btn"
                        onClick={() =>
                          handleAddToCart(
                            product
                          )
                        }
                        disabled={
                          product.stock === 0
                        }
                      >
                        <FaShoppingCart />

                        {product.stock === 0
                          ? t("Out of Stock")
                          : t("Add to Cart")}
                      </button>


                      <button
                        type="button"
                        className="favorite_view_btn"
                        onClick={() =>
                          navigate(
                            `/products/${product.id}`
                          )
                        }
                      >
                        <FaEye />{t("View")}</button>

                    </div>

                  </div>

                </article>
              );
            }
          )}

        </div>

      )}

    </main>
  );
}


export default Favorites;
