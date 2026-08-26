import React, { useEffect, useState } from 'react';
import { IoMdMenu } from "react-icons/io";
import { MdArrowDropDown } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { PiSignInFill } from "react-icons/pi";
import './BtmHeader.css';

const NavLinks = [
  { title: "Home", link: "/" },
  { title: "About", link: "/about" },
  { title: "Contact", link: "/contact" },
];

function BtmHeader() {
  const [categories, setCategories] = useState([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const location = useLocation();

useEffect(() => {
  fetch('https://dummyjson.com/products/categories')
    .then((res) => res.json())
    .then((data) => {
      const selectedCategories = data.filter((category, index) =>
        [6, 13, ,10, 16].includes(index)
      );

      setCategories(selectedCategories);
    });
}, []);


  return (
    <div className="btm_header">
      <div className="container">

        <nav className="nav">

          <div className="category_nav">

            <div
              className="category_btn"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            >
              <IoMdMenu />
              <p>Browse Category</p>
              <MdArrowDropDown />
            </div>

            <div
              className={`category_nav_list ${
                isCategoriesOpen ? "active" : ""
              }`}
            >
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  onClick={() => setIsCategoriesOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>

          </div>

          <div className="nav_links">

            {NavLinks.map((item) => (
              <li
                key={item.link}
                className={location.pathname === item.link ? "active" : ""}
              >
                <Link to={item.link}>
                  {item.title}
                </Link>
              </li>
            ))}

          </div>

        </nav>

        <div className="sign_regs_icon">
            <PiSignInFill />

        </div>

      </div>
    </div>
  );
}

export default BtmHeader;