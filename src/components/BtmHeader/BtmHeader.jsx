import { useTranslation } from "react-i18next";
import { translate as t } from "../../i18n";
import { LanguageButton } from '../../preferences/Controls';
import React, { useEffect, useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { MdArrowDropDown } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PiSignOutFill } from "react-icons/pi";

import "./BtmHeader.css";
import { getCategories } from "../../services/api";

const NavLinks = [
  { title: "Home", link: "/" },
  { title: "About", link: "/about" },
  { title: "Contact", link: "/contact" },
];

function BtmHeader() {
  useTranslation(); // Subscribe this screen to language changes.

  const [categories, setCategories] = useState([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }

    loadCategories();
  }, []);

  const handleLogout = () => {
localStorage.removeItem("access_token");
localStorage.removeItem("refresh_token");

window.dispatchEvent(
  new Event("authChanged")
);

navigate("/signin");
  };

  const handleCategoryClick = (category) => {
    setIsCategoriesOpen(false);

    const categoryId = `category-${category
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    if (location.pathname !== "/") {
      navigate(`/#${categoryId}`);
      return;
    }

    const element = document.getElementById(categoryId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="btm_header">
      <div className="container">
        <nav className="nav">
          <div className="category_nav">
            <button type="button"
              aria-expanded={isCategoriesOpen}
              aria-controls="category-options"
              className="category_btn"
              onClick={() =>
                setIsCategoriesOpen(!isCategoriesOpen)
              }
            >
              <IoMdMenu />
              <p>{t("Browse Category")}</p>
              <MdArrowDropDown />
            </button>

            <div
              id="category-options"
              inert={!isCategoriesOpen}
              className={`category_nav_list ${
                isCategoriesOpen ? "active" : ""
              }`}
            >
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() =>
                    handleCategoryClick(category)
                  }
                >
                  {t(category, { defaultValue: category })}
                </button>
              ))}
            </div>
          </div>

          <ul className="nav_links">
            {NavLinks.map((item) => (
              <li
                key={item.link}
                className={
                  location.pathname === item.link
                    ? "active"
                    : ""
                }
              >
                <Link to={item.link}>
                  {t(item.title, { defaultValue: item.title })}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

<div className="header_actions">
<LanguageButton />
{token && (
  <button
    className="logout_btn"
    onClick={handleLogout}
    type="button"
  >
    <PiSignOutFill />
    <span>{t("Logout")}</span>
  </button>
)}
</div>
      </div>
    </div>
  );
}

export default BtmHeader;