import React, { useEffect, useState } from "react";

import {
  FaCartArrowDown,
  FaRegHeart,
  FaHeart,
  FaEye
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import {
  addToCart,
  addToFavorites,
  removeFavorite,
  getFavorites
} from "../../../services/api";

import ProductRating from "../../ProductRating/ProductRating";


function Product({ item }) {
  const navigate = useNavigate();

  const [favoriteId, setFavoriteId] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const imageUrl = item.image_path
    ? `${import.meta.env.VITE_API_URL}/api/v1/assets/${item.image_path}`
    : "";


  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favorites = await getFavorites();

        const favorite = favorites.find(
          (fav) =>
            fav.product_id === item.id ||
            fav.product?.id === item.id
        );

        setFavoriteId(
          favorite ? favorite.id : null
        );
      } catch (error) {
        console.error(
          "Failed to check favorite:",
          error
        );
      }
    };

    checkFavorite();
  }, [item.id]);


  const handleAddToCart = async () => {
    if (item.stock === 0 || addingToCart) {
      return;
    }

    try {
      setAddingToCart(true);

      await addToCart(item.id);

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      alert("Added to cart");
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "Failed to add product to cart"
      );
    } finally {
      setAddingToCart(false);
    }
  };


  const handleFavoriteToggle = async () => {
    if (favoriteLoading) {
      return;
    }

    try {
      setFavoriteLoading(true);

      if (favoriteId) {
        await removeFavorite(favoriteId);

        setFavoriteId(null);

        window.dispatchEvent(
          new Event("favoritesUpdated")
        );

        return;
      }

      const newFavorite =
        await addToFavorites(item.id);

      if (newFavorite?.id) {
        setFavoriteId(newFavorite.id);
      } else {
        const favorites =
          await getFavorites();

        const favorite = favorites.find(
          (fav) =>
            fav.product_id === item.id ||
            fav.product?.id === item.id
        );

        setFavoriteId(
          favorite ? favorite.id : null
        );
      }

      window.dispatchEvent(
        new Event("favoritesUpdated")
      );
    } catch (error) {
      console.error(
        "Failed to update favorites:",
        error
      );

      alert(
        error.message ||
          "Failed to update favorites"
      );
    } finally {
      setFavoriteLoading(false);
    }
  };


  return (
    <div
      className="product"
      id={`product-${item.id}`}
    >

      <div className="img_product">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={item.name}
          />
        )}
      </div>


      <p className="name_product">
        {item.name}
      </p>


      <p className="price">
        <span>
          $ {item.price}
        </span>
      </p>


      <ProductRating
        productId={item.id}
        size="small"
      />


      {item.stock === 0 && (
        <span className="product_out_stock">
          Out of Stock
        </span>
      )}


      <div className="icons">

        <span
          className={
            item.stock === 0
              ? "product_icon disabled"
              : "product_icon"
          }
          onClick={handleAddToCart}
          title={
            item.stock === 0
              ? "Out of Stock"
              : "Add to Cart"
          }
        >
          <FaCartArrowDown />
        </span>


        <span
          className={
            favoriteId
              ? "product_icon favorite_active"
              : "product_icon"
          }
          onClick={handleFavoriteToggle}
          title={
            favoriteId
              ? "Remove from Favorites"
              : "Add to Favorites"
          }
        >
          {favoriteId ? (
            <FaHeart />
          ) : (
            <FaRegHeart />
          )}
        </span>


        <span
          className="product_icon"
          onClick={() =>
            navigate(`/products/${item.id}`)
          }
          title="View Details"
        >
          <FaEye />
        </span>

      </div>

    </div>
  );
}


export default Product;