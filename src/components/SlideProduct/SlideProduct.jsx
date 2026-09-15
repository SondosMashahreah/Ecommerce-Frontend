import { localizedCategory } from '../../i18n/productContent';
import { useTranslation } from "react-i18next";
import { translate as t } from "../../i18n";
import React from "react";

import Product from "./Product/Product";

import "./SlideProduct.css";
import "./Product/Product.css";

import {
  Swiper,
  SwiperSlide
} from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Pagination } from "swiper/modules";



function SlideProduct({
  data = [],
  title
}) {
  const { i18n } = useTranslation();

  return (
    <div className="Slide_product">
      <div className="container">

        <div className="top_slide">
          <h2>{localizedCategory(title, i18n.language)}</h2>

          <p>{t("Available Devices in the store")}</p>
        </div>

        <Swiper key={i18n.language} dir={i18n.dir()}
  modules={[Pagination]}
  pagination={{
    clickable: true,
  }}
  spaceBetween={15}
  breakpoints={{
    0: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    480: {
      slidesPerView: 2,
      spaceBetween: 12,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 15,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 18,
    },
    1280: {
      slidesPerView: 5,
      spaceBetween: 20,
    },
  }}
  className="mySwiper"
>
  {data.map((item) => (
    <SwiperSlide key={item.id}>
      <Product item={item} />
    </SwiperSlide>
  ))}
</Swiper>

      </div>
    </div>
  );
}

export default SlideProduct;