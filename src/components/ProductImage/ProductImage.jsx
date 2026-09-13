import React from "react";
import "./ProductImage.css";


function ProductImage({
  imagePath,
  alt,
  size = "card",
  className = ""
}) {
  const imageUrl = imagePath
    ? `${import.meta.env.VITE_API_URL}/api/v1/assets/${imagePath}`
    : "";

  return (
    <div
      className={`
        product_image_frame
        product_image_frame--${size}
        ${className}
      `}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className="product_image_unified"
          loading="lazy"
        />
      ) : (
        <span className="product_image_placeholder">
          No image
        </span>
      )}
    </div>
  );
}


export default ProductImage;