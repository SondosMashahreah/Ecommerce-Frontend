import React, { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";

import {
  rateProduct,
  getProductRating,
  getMyProductRating
} from "../../services/api";

function ProductRating({ productId, size = "small" }) {
  const [userRating, setUserRating] = useState(null);

  const [ratingInfo, setRatingInfo] = useState({
    average_rating: 0,
    ratings_count: 0
  });

  const loadRatings = async () => {
    try {
      const summary = await getProductRating(productId);
      setRatingInfo(summary);

      try {
        const myRating = await getMyProductRating(productId);

        setUserRating(
          myRating ? myRating.rating : null
        );
      } catch {
        setUserRating(null);
      }
    } catch (error) {
      console.error("Failed to load ratings:", error);
    }
  };

  useEffect(() => {
    loadRatings();
  }, [productId]);

  const handleRatingChange = async (event, newValue) => {
    if (!newValue) {
      return;
    }

    try {
      await rateProduct(productId, newValue);

      setUserRating(newValue);

      const updatedSummary =
        await getProductRating(productId);

      setRatingInfo(updatedSummary);

      window.dispatchEvent(
        new CustomEvent("ratingUpdated", {
          detail: {
            productId
          }
        })
      );
    } catch (error) {
      console.error("Failed to rate product:", error);
    }
  };

  useEffect(() => {
    const handleRatingUpdated = (event) => {
      if (
        event.detail?.productId === productId
      ) {
        loadRatings();
      }
    };

    window.addEventListener(
      "ratingUpdated",
      handleRatingUpdated
    );

    return () => {
      window.removeEventListener(
        "ratingUpdated",
        handleRatingUpdated
      );
    };
  }, [productId]);

  return (
    <div className="product_rating">
      <Rating
        name={`product-rating-${productId}`}
        value={userRating}
        onChange={handleRatingChange}
        size={size}
      />

      <span className="rating_info">
        {ratingInfo.ratings_count > 0
          ? `${ratingInfo.average_rating} (${ratingInfo.ratings_count})`
          : "No ratings"}
      </span>
    </div>
  );
}

export default ProductRating;