import {
  useEffect,
  useState,
} from "react";

import {
  getAdminProducts,
  deleteAdminProduct,
} from "../../../services/api";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBoxOpen,
} from "react-icons/fa";

import "./AdminProducts.css";


function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const loadProducts = async () => {
    try {
      setLoading(true);

      const data =
        await getAdminProducts();

      setProducts(data);

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadProducts();
  }, []);


  const handleDelete = async (
    productId
  ) => {
    const confirmed =
      window.confirm(
        "Delete this product?"
      );

    if (!confirmed) return;

    try {
      await deleteAdminProduct(
        productId
      );

      setProducts(
        current =>
          current.filter(
            product =>
              product.id !== productId
          )
      );

    } catch (error) {
      alert(error.message);
    }
  };


  if (loading) {
    return (
      <main className="admin_products_page">
        Loading products...
      </main>
    );
  }


  return (
    <main className="admin_products_page">

      <div className="admin_products_container">

        <div className="admin_products_header">

          <div>
            <span>
              ADMIN PANEL
            </span>

            <h1>
              Product Management
            </h1>

            <p>
              Manage products,
              variants and inventory.
            </p>
          </div>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/products/new"
              )
            }
          >
            <FaPlus />
            Add Product
          </button>

        </div>


        {error && (
          <div className="admin_products_error">
            {error}
          </div>
        )}


        <div className="admin_products_table">

          <div className="admin_products_table_head">
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span>Actions</span>
          </div>


          {products.map((product) => {

            const totalStock =
              product.items?.reduce(
                (total, item) =>
                  total +
                  item.available_stock,
                0
              ) || 0;

            const hasLowStock =
              product.items?.some(
                item =>
                  item.stock_status ===
                  "low_stock"
              );

            const allOut =
              product.items?.length > 0 &&
              product.items.every(
                item =>
                  item.stock_status ===
                  "out_of_stock"
              );


            let status =
              "In Stock";

            if (allOut) {
              status =
                "Out of Stock";

            } else if (hasLowStock) {
              status =
                "Low Stock";
            }


            const imageUrl =
              product.image_path
                ? `${import.meta.env.VITE_API_URL}/api/v1/assets/${product.image_path}`
                : "";


            return (
              <div
                className="admin_product_row"
                key={product.id}
              >

                <div className="admin_product_info">

                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                    />
                  ) : (
                    <div className="admin_product_placeholder">
                      <FaBoxOpen />
                    </div>
                  )}

                  <strong>
                    {product.name}
                  </strong>

                </div>


                <span>
                  {product.category}
                </span>


                <span>
                  ${Number(
                    product.price
                  ).toFixed(2)}
                </span>


                <span>
                  {totalStock}
                </span>


                <span>
                  {status}
                </span>


                <div className="admin_product_actions">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/admin/products/${product.id}`
                      )
                    }
                  >
                    <FaEdit />
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        product.id
                      )
                    }
                  >
                    <FaTrash />
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </main>
  );
}


export default AdminProducts;