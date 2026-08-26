import React from 'react'
import Product from './Product/Product'
import './SlideProduct.css'
import './Product/Product.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'

function SlideProduct({ data, title }) {
  return (
    <div className="Slide_product">
      <div className="container">

        <div className="top_slide">
          <h2>{title}</h2>
          <p>Available Devices in the store</p>
        </div>

        <Swiper
          slidesPerView={5}
          navigation={true}
          modules={[Navigation]}
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
  )
}

export default SlideProduct