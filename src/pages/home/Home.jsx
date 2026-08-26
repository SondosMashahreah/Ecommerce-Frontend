import React from 'react'
import HeroSlider from '../../components/HeroSlider/HeroSlider'
import SlideProduct from '../../components/SlideProduct/SlideProduct'
import './home.css'
import { useState, useEffect } from 'react'


const categories = [
  "laptops",
  "mobile-accessories",
  "smartphones",
  "tablets"
]

function Home() {

const [products, setProducts] = useState({});
const [loading, setLoading] = useState(true);



useEffect(() => {
  const fetchProducts = async () => {
    try {
      const results = await Promise.all(
        categories.map(async (category) => {
          const res = await fetch(
            `https://dummyjson.com/products/category/${category}`
          );

          const data = await res.json();

          return {
            [category]: data.products,
          };
        })
      );

      const productsData = Object.assign({}, ...results);

      setProducts(productsData);
    } catch (error) {
      console.error("Error Fetching Products:", error);
    } finally {
      setLoading(false)
    }
  };

  fetchProducts();
}, []);



  return (
    <div>
      <HeroSlider />

      {loading ? (
        <p>Loading ...</p>
      ) : (
        categories.map((category) => (
      <SlideProduct key={category} data={products[category]} title={category.replace("-" , " ")}/>

))
)}

    </div>

  )}
export default Home
