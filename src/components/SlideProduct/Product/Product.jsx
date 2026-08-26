import React from 'react'
import { FaCartArrowDown, FaRegHeart, FaShare } from "react-icons/fa";

function Product({item}) {
  return (
<div className="product">
    <div className="img_product">
        <img src={item.images[0]} alt="product_photo"/>
    </div>

    <p className="name_product">{item.title}</p>
    <p className="price"><span>$ {item.price}</span></p>

    <div className="icons">
        <span><FaCartArrowDown /></span>
        <span><FaRegHeart /></span>
        <span><FaShare /></span>

    </div>

</div>
  )
}

export default Product
