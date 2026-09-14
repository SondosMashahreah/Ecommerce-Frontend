import { useTranslation } from "react-i18next";
import { translate as t } from "../../i18n";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import {
  Pagination,
  Autoplay
} from "swiper/modules";

import "./HeroSlider.css";

import ProductImage from "../ProductImage/ProductImage";

function HeroSlider({ products = [] }) {
  const { i18n } = useTranslation();


  const handleProductClick = (productId) => {
    const productElement = document.getElementById(
      `product-${productId}`
    );

    if (!productElement) {
      return;
    }

    productElement.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    productElement.classList.add(
      "search-highlight"
    );

    setTimeout(() => {
      productElement.classList.remove(
        "search-highlight"
      );
    }, 1000);
  };


  if (products.length === 0) {
    return null;
  }


  return (
    <div className="hero">
      <div className="container">

        <Swiper key={i18n.language} dir={i18n.dir()}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={900}
          loop={products.length > 1}
          modules={[
            Pagination,
            Autoplay
          ]}
          className="mySwiper"
        >

          {products.map((product) => {
            return (
              <SwiperSlide key={product.id}>

                <div className="content">

                  <span>{t("Introducing the new")}</span>

                  <h3>
                    {product.name}
                  </h3>

                  <p>{t("hero.newProduct", { name: product.name, category: t(product.category, { defaultValue: product.category }) })}</p>

                  <button
                    type="button"
                    className="btn"
                    onClick={() =>
                      handleProductClick(product.id)
                    }
                  >{t("Shop Now")}</button>

                </div>

                <div className="image">
                  <ProductImage
                    imagePath={product.image_path}
                    alt={product.name}
                    size="hero"
                  />
                </div>

              </SwiperSlide>
            );
          })}

        </Swiper>

      </div>
    </div>
  );
}


export default HeroSlider;
