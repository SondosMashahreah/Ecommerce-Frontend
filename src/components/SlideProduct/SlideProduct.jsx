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
  return (
    <div className="Slide_product">
      <div className="container">

        <div className="top_slide">
          <h2>{title}</h2>

          <p>
            Available Devices in the store
          </p>
        </div>

        <Swiper
  modules={[Pagination]}
  pagination={{
    clickable: true,
  }}
  spaceBetween={15}
  breakpoints={{
    0: {
      slidesPerView: 1.2,
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