import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getAdminProduct,
  updateAdminProduct,
  uploadAdminProductImage,
  updateAdminProductItem,
  deleteAdminProductItem,
  getCategories,
} from "../../../services/api";

import {
  FaCloudUploadAlt,
  FaImage,
  FaTimes,
} from "react-icons/fa";

import "./AdminProductEdit.css";

function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [product, setProduct] =
    useState(null);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [image, setImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [dragging, setDragging] =
    useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAdminProduct(id);

      setProduct(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data =
        await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(
        "Failed to load categories:",
        error
      );
    }
  };

  useEffect(() => {
    load();
    loadCategories();
  }, [id]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(
          imagePreview
        );
      }
    };
  }, [imagePreview]);

  const changeProduct = (event) => {
    const {
      name,
      value,
    } = event.target;

    setProduct((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const saveProduct = async () => {
    try {
      setSaving(true);
      setError("");

      await updateAdminProduct(
        product.id,
        {
          name: product.name,
          description:
            product.description,
          price: Number(
            product.price
          ),
          category:
            product.category,
        }
      );

      if (image) {
        await uploadAdminProductImage(
          product.id,
          image
        );
      }

      await load();

      setImage(null);
      setImagePreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      alert("Product updated");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const selectImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file"
      );
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setError("");
    setImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  const handleFileChange = (event) => {
    selectImage(
      event.target.files?.[0]
    );
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setDragging(false);

    selectImage(
      event.dataTransfer.files?.[0]
    );
  };

  const removeSelectedImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImage(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const saveItem = async (item) => {
    try {
      await updateAdminProductItem(
        item.id,
        {
          sku: item.sku,
          size: item.size,
          color: item.color,
          stock: Number(
            item.stock
          ),
          stock_limit: Number(
            item.stock_limit
          ),
        }
      );

      await load();
    } catch (error) {
      alert(error.message);
    }
  };

  const changeItem = (
    itemId,
    field,
    value
  ) => {
    setProduct((current) => ({
      ...current,

      items: current.items.map(
        (item) =>
          item.id === itemId
            ? {
                ...item,
                [field]: value,
              }
            : item
      ),
    }));
  };

  const removeItem = async (
    itemId
  ) => {
    if (
      !window.confirm(
        "Delete this variant?"
      )
    ) {
      return;
    }

    try {
      await deleteAdminProductItem(
        itemId
      );

      await load();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <main className="admin_edit_page">
        Loading product...
      </main>
    );
  }

  if (error && !product) {
    return (
      <main className="admin_edit_page">
        {error}
      </main>
    );
  }

  if (!product) {
    return (
      <main className="admin_edit_page">
        Product not found
      </main>
    );
  }

  return (
    <main className="admin_edit_page">

      <div className="admin_edit_header">

        <div>
          <span>
            PRODUCT MANAGEMENT
          </span>

          <h1>
            {product.name}
          </h1>

          <p>
            Manage product information
            and inventory.
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              "/admin/products"
            )
          }
        >
          Back
        </button>

      </div>

      {error && (
        <div className="admin_edit_error">
          {error}
        </div>
      )}

      <section className="admin_edit_card">

        <h2>
          Product Information
        </h2>

        <div className="admin_edit_grid">

          <label>
            Name

            <input
              name="name"
              value={product.name}
              onChange={changeProduct}
            />
          </label>

          <label>
            Category

            <input
              name="category"
              list="edit-product-categories"
              value={
                product.category || ""
              }
              onChange={changeProduct}
              placeholder="Select or type category"
            />

            <datalist id="edit-product-categories">
              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  />
                )
              )}
            </datalist>

            <small className="admin_edit_hint">
              Choose an existing category
              or type a new one.
            </small>
          </label>

          <label>
            Price

            <input
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={product.price}
              onChange={changeProduct}
            />
          </label>

          <label className="full">
            Description

            <textarea
              name="description"
              value={
                product.description ||
                ""
              }
              onChange={changeProduct}
            />
          </label>

          <div className="full">

            <span className="admin_edit_upload_label">
              Replace product image
            </span>

            <div
              className={
                dragging
                  ? "admin_edit_dropzone dragging"
                  : "admin_edit_dropzone"
              }
              onDragEnter={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setDragging(false);
              }}
              onDrop={handleDrop}
              onClick={() =>
                fileInputRef.current?.click()
              }
            >

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={
                  handleFileChange
                }
              />

              {!imagePreview ? (
                <div className="admin_edit_dropzone_empty">

                  <div className="admin_edit_dropzone_icon">
                    <FaCloudUploadAlt />
                  </div>

                  <strong>
                    Drop new product image here
                  </strong>

                  <span>
                    or click to browse
                  </span>

                  <small>
                    Leave empty to keep
                    the current image
                  </small>

                </div>
              ) : (
                <div className="admin_edit_image_preview">

                  <img
                    src={imagePreview}
                    alt="New product preview"
                  />

                  <div className="admin_edit_image_info">

                    <FaImage />

                    <div>
                      <strong>
                        {image.name}
                      </strong>

                      <span>
                        {(
                          image.size /
                          1024 /
                          1024
                        ).toFixed(2)}
                        {" "}MB
                      </span>
                    </div>

                  </div>

                  <button
                    type="button"
                    className="admin_edit_remove_image"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeSelectedImage();
                    }}
                  >
                    <FaTimes />
                  </button>

                </div>
              )}

            </div>

          </div>

        </div>

        <button
          className="admin_save_btn"
          onClick={saveProduct}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Product"}
        </button>

      </section>

      <section className="admin_edit_card">

        <h2>
          Variants & Inventory
        </h2>

        {product.items?.length > 0 ? (
          <div className="variant_table">

            <div className="variant_row head">
              <span>SKU</span>
              <span>Size</span>
              <span>Color</span>
              <span>Stock</span>
              <span>Reserved</span>
              <span>Available</span>
              <span>Limit</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {product.items.map(
              (item) => (
                <div
                  className="variant_row"
                  key={item.id}
                >

                  <input
                    value={item.sku}
                    onChange={(event) =>
                      changeItem(
                        item.id,
                        "sku",
                        event.target.value
                      )
                    }
                  />

                  <input
                    value={
                      item.size || ""
                    }
                    onChange={(event) =>
                      changeItem(
                        item.id,
                        "size",
                        event.target.value
                      )
                    }
                  />

                  <input
                    value={
                      item.color || ""
                    }
                    onChange={(event) =>
                      changeItem(
                        item.id,
                        "color",
                        event.target.value
                      )
                    }
                  />

                  <input
                    type="number"
                    min="0"
                    value={item.stock}
                    onChange={(event) =>
                      changeItem(
                        item.id,
                        "stock",
                        event.target.value
                      )
                    }
                  />

                  <span>
                    {item.reserved_stock}
                  </span>

                  <span>
                    {item.available_stock}
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={
                      item.stock_limit
                    }
                    onChange={(event) =>
                      changeItem(
                        item.id,
                        "stock_limit",
                        event.target.value
                      )
                    }
                  />

                  <span
                    className={
                      `stock_badge ${item.stock_status}`
                    }
                  >
                    {item.stock_status}
                  </span>

                  <div className="variant_actions">

                    <button
                      onClick={() =>
                        saveItem(item)
                      }
                    >
                      Save
                    </button>

                    <button
                      className="danger"
                      onClick={() =>
                        removeItem(
                          item.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        ) : (
          <div className="admin_no_variants">
            No inventory variants
            for this product.
          </div>
        )}

      </section>

    </main>
  );
}

export default AdminProductEdit;