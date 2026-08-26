import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';

import './HeroSlider.css';

import bannerHero1 from './img/banner_Hero1.jpg';
import bannerHero2 from './img/banner_Hero2.jpg';
import bannerHero3 from './img/banner_Hero3.jpg';

function HeroSlider() {
  const slides = [
    {
      id: 1,
      subtitle: 'Introducing the new',
      title: 'Microsoft Xbox 360 Controller',
      description: 'Take your gaming experience to the next level.',
      image: bannerHero1,
    },
    {
      id: 2,
      subtitle: 'Discover the latest',
      title: 'Smartphones & Technology',
      description: 'Powerful performance, modern design and smart features.',
      image: bannerHero2,
    },
    {
      id: 3,
      subtitle: 'Upgrade your setup',
      title: 'Premium Electronics',
      description: 'Everything you need for your home and entertainment.',
      image: bannerHero3,
    },
  ];

  return (
    <div className="hero">
      <div className="container">
        <Swiper
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="content">
                <span>{slide.subtitle}</span>

                <h3>{slide.title}</h3>

                <p>{slide.description}</p>

                <Link to="/" className="btn">
                  Shop Now
                </Link>
              </div>

              <div className="image">
                <img src={slide.image} alt={slide.title} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default HeroSlider;