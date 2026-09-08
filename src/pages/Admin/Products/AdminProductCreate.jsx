import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  createAdminProduct,
  getCategories,
} from "../../../services/api";

import {
  FaCloudUploadAlt,
  FaImage,
  FaTimes,
} from "react-icons/fa";

import "./AdminProductForm.css";

function AdminProductCreate() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    sku: "",
    size: "",
    color: "",
    stock: 0,
    stock_limit: 5,
  });

  const [categories, setCategories] =
    useState([]);

  const [image, setImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [dragging, setDragging] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
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

    loadCategories();
  }, []);

  const change = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const selectImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file"
      );
      return;
    }

    setError("");
    setImage(file);

    const preview =
      URL.createObjectURL(file);

    setImagePreview(preview);
  };

  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0];

    selectImage(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setDragging(false);

    const file =
      event.dataTransfer.files?.[0];

    selectImage(file);
  };

  const removeImage = () => {
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

  const submit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data =
        new FormData();

      Object.entries(form).forEach(
        ([key, value]) => {
          data.append(key, value);
        }
      );

      if (image) {
        data.append(
          "image",
          image
        );
      }

      await createAdminProduct(data);

      navigate(
        "/admin/products"
      );

    } catch (error) {
      setError(error.message);

    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="admin_form_page">

      <div className="admin_form_header">
        <div>
          <span>
            PRODUCT MANAGEMENT
          </span>

          <h1>
            Create Product
          </h1>

          <p>
            Add a new product and its
            first inventory variant.
          </p>
        </div>
      </div>

      <form
        className="admin_product_form"
        onSubmit={submit}
      >

        {error && (
          <div className="admin_form_error">
            {error}
          </div>
        )}

        <section className="admin_form_card">

          <h2>
            Product Information
          </h2>

          <div className="admin_form_grid">

            <label>
              Product name

              <input
                name="name"
                value={form.name}
                onChange={change}
                required
              />
            </label>

            <label>
              Category

              <input
                name="category"
                list="product-categories"
                value={form.category}
                onChange={change}
                placeholder="Select or type category"
                required
              />

              <datalist id="product-categories">
                {categories.map(
                  (category) => (
                    <option
                      value={category}
                      key={category}
                    />
                  )
                )}
              </datalist>

              <small className="admin_field_hint">
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
                value={form.price}
                onChange={change}
                required
              />
            </label>

            <label className="full">
              Description

              <textarea
                name="description"
                value={form.description}
                onChange={change}
              />
            </label>

            <div className="full">
              <span className="admin_upload_label">
                Product image
              </span>

              <div
                className={
                  dragging
                    ? "admin_image_dropzone dragging"
                    : "admin_image_dropzone"
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
                  <div className="admin_dropzone_empty">

                    <div className="admin_dropzone_icon">
                      <FaCloudUploadAlt />
                    </div>

                    <strong>
                      Drop product image here
                    </strong>

                    <span>
                      or click to browse
                    </span>

                    <small>
                      PNG, JPG, JPEG or WEBP
                    </small>

                  </div>
                ) : (
                  <div className="admin_image_preview">

                    <img
                      src={imagePreview}
                      alt="Product preview"
                    />

                    <div className="admin_image_preview_info">

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
                      className="admin_remove_image"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeImage();
                      }}
                    >
                      <FaTimes />
                    </button>

                  </div>
                )}

              </div>
            </div>

          </div>

        </section>

        <section className="admin_form_card">

          <h2>
            Initial Variant
          </h2>

          <div className="admin_form_grid">

            <label>
              SKU

              <input
                name="sku"
                value={form.sku}
                onChange={change}
                required
              />
            </label>

            <label>
              Size

              <input
                name="size"
                value={form.size}
                onChange={change}
              />
            </label>

            <label>
              Color

              <input
                name="color"
                value={form.color}
                onChange={change}
              />
            </label>

            <label>
              Stock

              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={change}
              />
            </label>

            <label>
              Low stock limit

              <input
                name="stock_limit"
                type="number"
                min="0"
                value={form.stock_limit}
                onChange={change}
              />
            </label>

          </div>

        </section>

        <div className="admin_form_actions">

          <button
            type="button"
            className="secondary"
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Create Product"}
          </button>

        </div>

      </form>

    </main>
  );
}

export default AdminProductCreate;