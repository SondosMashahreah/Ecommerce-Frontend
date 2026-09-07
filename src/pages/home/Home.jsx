import React, { useEffect, useState } from "react";

import HeroSlider from "../../components/HeroSlider/HeroSlider";
import SlideProduct from "../../components/SlideProduct/SlideProduct";

import { getProducts } from "../../services/api";

import "./home.css";


function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(
          "Failed to load products:",
          error
        );
      }
    }

    loadProducts();
  }, []);


  const productsByCategory = products.reduce(
    (groups, product) => {
      const category =
        product.category || "Other";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(product);

      return groups;
    },
    {}
  );


  return (
    <div>

      <HeroSlider />

      {Object.entries(
        productsByCategory
      ).map(([category, items]) => (

        <div
          key={category}
          id={`category-${category
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          <SlideProduct
            title={category}
            data={items}
          />
        </div>

      ))}

    </div>
  );
}


export default Home;