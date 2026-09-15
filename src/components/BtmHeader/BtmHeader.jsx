import { isSignedIn, signOut } from '../../services/session';
import i18n from '../../i18n';
import { localizedCategory } from '../../i18n/productContent';
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

  const [signedIn, setSignedIn] = useState(isSignedIn);
  useEffect(() => {
    const sync = () => setSignedIn(isSignedIn());
    window.addEventListener('authChanged', sync);
    return () => window.removeEventListener('authChanged', sync);
  }, []);

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
    signOut();
    navigate("/");
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
    <div className={`btm_header ${signedIn ? "" : "btm_header--guest"}`}>
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
                  {localizedCategory(category, i18n.language)}
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
{signedIn ? (
  <button
    className="logout_btn"
    onClick={handleLogout}
    type="button"
  >
    <PiSignOutFill />
    <span>{t("Logout")}</span>
  </button>
) : (
  <>
    <Link className="guest_signin" to="/signin">{t("Sign In")}</Link>
    <Link className="logout_btn" to="/signup">{t("Sign Up")}</Link>
  </>
)}
</div>
      </div>
    </div>
  );
}

export default BtmHeader;