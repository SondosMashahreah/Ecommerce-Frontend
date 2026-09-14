import { useTranslation } from "react-i18next";
import { translate as t } from "../../i18n";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaCartArrowDown,
  FaRegHeart,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft
} from "react-icons/fa";

import {
  getProductById,
  addToCart,
  addToFavorites
} from "../../services/api";

import ProductRating from "../../components/ProductRating/ProductRating";

import "./ProductDetails.css";

import ProductImage from "../../components/ProductImage/ProductImage";

function ProductDetails() {
  useTranslation(); // Subscribe this screen to language changes.

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToFavorites, setAddingToFavorites] =
    useState(false);


  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error(
          "Failed to load product:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);


  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) {
      return;
    }

    try {
      setAddingToCart(true);

      await addToCart(product.id);

      setProduct((currentProduct) => ({
        ...currentProduct,
        stock: Math.max(
          currentProduct.stock - 1,
          0
        )
      }));

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
    } finally {
      setAddingToCart(false);
    }
  };


  const handleAddToFavorites = async () => {
    try {
      setAddingToFavorites(true);

      await addToFavorites(product.id);

      window.dispatchEvent(
        new Event("favoritesUpdated")
      );

      alert(t("Added to favorites"));
    } catch (error) {
      console.error(error);
      alert(
        error.message ||
          t("Failed to add product to favorites")
      );
    } finally {
      setAddingToFavorites(false);
    }
  };


  if (loading) {
    return (
      <main className="product_details_page">
        <div className="product_details_state">
          <div className="product_loader"></div>
          <p>{t("Loading product...")}</p>
        </div>
      </main>
    );
  }


  if (!product) {
    return (
      <main className="product_details_page">
        <div className="product_details_state">
          <h2>{t("Product not found")}</h2>

          <Link to="/" className="back_home_btn">
            <FaArrowLeft />{t("Back to Products")}</Link>
        </div>
      </main>
    );
  }


  const imageUrl = product.image_path
    ? `${import.meta.env.VITE_API_URL}/api/v1/assets/${product.image_path}`
    : "";


  const audioUrl = product.audio_path
    ? `${import.meta.env.VITE_API_URL}/api/v1/assets/${product.audio_path}`
    : "";


  const videoUrl = product.video_path
    ? `${import.meta.env.VITE_API_URL}/api/v1/assets/${product.video_path}`
    : "";


  const outOfStock = product.stock <= 0;


  return (
    <main className="product_details_page">

      <Link to="/" className="product_back_link">
        <FaArrowLeft />{t("Back to Products")}</Link>


      <section className="product_details">

        <div className="product_details_image_area">

          {product.category && (
            <span className="product_category_badge">
              {t(product.category, { defaultValue: product.category })}
            </span>
          )}


          <div className="product_details_image">

            {imageUrl ? (
<ProductImage
  imagePath={product.image_path}
  alt={product.name}
  size="details"
/>
            ) : (
              <div className="product_no_image">{t("No image available")}</div>
            )}

          </div>

        </div>


        <div className="product_info">

          <div className="product_title_section">

            <p className="product_details_label">{t("Product Details")}</p>

            <h1>{product.name}</h1>

          </div>


          <div
            className={
              outOfStock
                ? "product_stock out"
                : "product_stock in"
            }
          >
            {outOfStock ? (
              <>
                <FaTimesCircle />{t("Out of Stock")}</>
            ) : (
              <>
                <FaCheckCircle />{t("In Stock")}</>
            )}
          </div>


          <div className="product_details_rating">
            <ProductRating
              productId={product.id}
              size="large"
              showReviews
            />
          </div>


          <div className="product_details_price">
            <span>{t("Price")}</span>

            <strong>
              ${Number(product.price).toFixed(2)}
            </strong>
          </div>


          <div className="product_description">

            <h3>{t("About this product")}</h3>

            <p>
              {product.description ||
                t("No description available for this product.")}
            </p>

          </div>


          <div className="product_details_actions">

            <button
              type="button"
              className="details_cart_btn"
              onClick={handleAddToCart}
              disabled={
                outOfStock ||
                addingToCart
              }
            >
              <FaCartArrowDown />

              {outOfStock
                ? t("Out of Stock")
                : addingToCart
                  ? t("Adding...")
                  : t("Add to Cart")}
            </button>


            <button
              type="button"
              className="details_favorite_btn"
              onClick={handleAddToFavorites}
              disabled={addingToFavorites}
            >
              <FaRegHeart />

              {addingToFavorites
                ? t("Adding...")
                : t("Add to Favorites")}
            </button>

          </div>


          {(audioUrl || videoUrl) && (
            <div className="product_media">

              <h3>{t("Product Media")}</h3>


              {audioUrl && (
                <audio controls>
                  <source src={audioUrl} />
                </audio>
              )}


              {videoUrl && (
                <video controls>
                  <source src={videoUrl} />
                </video>
              )}

            </div>
          )}

        </div>

      </section>

    </main>
  );
}


export default ProductDetails;
