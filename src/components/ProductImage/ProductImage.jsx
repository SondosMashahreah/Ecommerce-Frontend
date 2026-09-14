import { useTranslation } from "react-i18next";
import { translate as t } from "../../i18n";
import React, { useEffect, useState } from "react";
import "./ProductImage.css";

const processedImages = new Map();

function colorDistance(first, second) {
  return Math.sqrt(
    ((first[0] - second[0]) ** 2) +
    ((first[1] - second[1]) ** 2) +
    ((first[2] - second[2]) ** 2)
  );
}

function getCornerColor(data, width, height) {
  const points = [[0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]];
  const colors = points.map(([x, y]) => {
    const offset = ((y * width) + x) * 4;
    return [data[offset], data[offset + 1], data[offset + 2]];
  });
  const background = [0, 1, 2].map((channel) =>
    colors.reduce((sum, color) => sum + color[channel], 0) / colors.length
  );
  return colors.every((color) => colorDistance(color, background) < 55)
    ? background
    : null;
}

function normalizeImage(image) {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  if (!width || !height) return null;

  const source = document.createElement("canvas");
  source.width = width;
  source.height = height;
  const context = source.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0);

  const imageData = context.getImageData(0, 0, width, height);
  const { data } = imageData;
  const background = getCornerColor(data, width, height);
  if (!background) return null;

  const visited = new Uint8Array(width * height);
  const queue = [];
  const addPixel = (x, y) => {
    const index = (y * width) + x;
    if (visited[index]) return;
    visited[index] = 1;
    queue.push(index);
  };

  for (let x = 0; x < width; x += 1) {
    addPixel(x, 0);
    addPixel(x, height - 1);
  }
  for (let y = 1; y < height - 1; y += 1) {
    addPixel(0, y);
    addPixel(width - 1, y);
  }

  let cursor = 0;
  while (cursor < queue.length) {
    const index = queue[cursor];
    cursor += 1;
    const offset = index * 4;
    const pixel = [data[offset], data[offset + 1], data[offset + 2]];
    if (colorDistance(pixel, background) > 48) continue;

    data[offset + 3] = 0;
    const x = index % width;
    const y = Math.floor(index / width);
    if (x > 0) addPixel(x - 1, y);
    if (x < width - 1) addPixel(x + 1, y);
    if (y > 0) addPixel(x, y - 1);
    if (y < height - 1) addPixel(x, y + 1);
  }
  context.putImageData(imageData, 0, 0);

  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(((y * width) + x) * 4) + 3];
      if (alpha > 18) {
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
  }
  if (right < left || bottom < top) return null;

  const croppedWidth = right - left + 1;
  const croppedHeight = bottom - top + 1;
  const outputSize = 900;
  const availableSize = outputSize * 0.82;
  const scale = Math.min(availableSize / croppedWidth, availableSize / croppedHeight);
  const drawWidth = croppedWidth * scale;
  const drawHeight = croppedHeight * scale;
  const output = document.createElement("canvas");
  output.width = outputSize;
  output.height = outputSize;
  output.getContext("2d").drawImage(
    source, left, top, croppedWidth, croppedHeight,
    (outputSize - drawWidth) / 2, (outputSize - drawHeight) / 2,
    drawWidth, drawHeight
  );
  return output.toDataURL("image/webp", 0.9);
}

function ProductImage({ imagePath, alt, size = "card", className = "" }) {
  useTranslation(); // Subscribe this screen to language changes.

  const imageUrl = imagePath
    ? `${import.meta.env.VITE_API_URL}/api/v1/assets/${imagePath}`
    : "";
  const [displayUrl, setDisplayUrl] = useState(processedImages.get(imageUrl) || imageUrl);

  useEffect(() => {
    setDisplayUrl(processedImages.get(imageUrl) || imageUrl);
  }, [imageUrl]);

  const handleLoad = (event) => {
    if (!imageUrl || processedImages.has(imageUrl)) return;
    try {
      const normalized = normalizeImage(event.currentTarget);
      processedImages.set(imageUrl, normalized || imageUrl);
      setDisplayUrl(normalized || imageUrl);
    } catch {
      processedImages.set(imageUrl, imageUrl);
    }
  };

  return (
    <div className={`product_image_frame product_image_frame--${size} ${className}`}>
      {imageUrl ? (
        <img
          src={displayUrl}
          alt={alt}
          className="product_image_unified"
          loading={size === "hero" ? "eager" : "lazy"}
          crossOrigin="anonymous"
          onLoad={handleLoad}
        />
      ) : (
        <span className="product_image_placeholder">{t("No image")}</span>
      )}
    </div>
  );
}

export default ProductImage;
