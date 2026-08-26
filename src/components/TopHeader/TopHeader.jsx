import React from 'react'
import logo from './img/logo.png'
import { Link } from 'react-router-dom'
import { FcSearch } from "react-icons/fc";
import { FiHeart } from "react-icons/fi";
import { MdOutlineShoppingCart } from "react-icons/md";
import './TopHeader.css';



function TopHeader() {
  return (
    <div className='top_header'>
        <div className="container">
            <Link className='logo' to="/"><img src={logo} alt="Logo" /></Link>
            <form action="" className="search_box">
                <input type="text" name='search' id='search' placeholder='Srearch for products'/>
                <button type='submit'><FcSearch /></button>
            </form>

            <div className="header_icons">
                <div className="icon">
                    <FiHeart />
                    <span className='count'>0</span>
                </div>

                <div className="icon">
                    <MdOutlineShoppingCart />
                    <span className='count'>0</span>
                </div>

            </div>
         </div>
      
    </div>
  )
}

export default TopHeader
