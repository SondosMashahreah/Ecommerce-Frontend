const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`; 

export const sendContactMessage = async (contactData) => {
  const response = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
};


export const signupUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Signup failed"
    );
  }

  return data;
};

export const verifyOtp = async (verifyData) => {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(verifyData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "OTP verification failed"
    );
  }

  return data;
};

export const signinUser = async (loginData) => {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Sign in failed"
    );
  }

  return data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to get user"
    );
  }

  return data;
};

export const updateProfile = async (
  profileData
) => {
  const response = await fetch(
    `${API_URL}/auth/profile`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${getToken()}`
      },

      body: JSON.stringify(
        profileData
      )
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Failed to update profile"
    );
  }

  return data;
};

export const changePassword = async (
  passwordData
) => {
  const response = await fetch(
    `${API_URL}/auth/password`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${getToken()}`
      },

      body: JSON.stringify(
        passwordData
      )
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Failed to change password"
    );
  }

  return data;
};

export async function getProducts() {
  const response = await fetch(`${API_URL}/products/`);

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return response.json();
}

export async function searchProducts(query) {
  const response = await fetch(
    `${API_URL}/products/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search products");
  }

  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(
    `${API_URL}/products/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to load product");
  }

  return response.json();
}

function getToken() {
  return localStorage.getItem("access_token");
}


export async function addToCart(productId) {
  const response = await fetch(`${API_URL}/cart/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({
      product_id: productId,
      quantity: 1
    })
  });

  if (!response.ok) {
    throw new Error("Failed to add product to cart");
  }

  const data = await response.json();

  window.dispatchEvent(
    new Event("cartUpdated")
  );

  return data;
}

export async function getCart() {
  const response = await fetch(`${API_URL}/cart/`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to load cart");
  }

  return response.json();
}


export async function removeCartItem(cartItemId) {
  const response = await fetch(
    `${API_URL}/cart/${cartItemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove cart item");
  }

  const data = await response.json();

  window.dispatchEvent(
    new Event("cartUpdated")
  );

  return data;
}

export async function addToFavorites(productId) {
  const response = await fetch(
    `${API_URL}/favorites/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        product_id: productId
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to add product to favorites"
    );
  }

  const data = await response.json();

  window.dispatchEvent(
    new Event("favoritesUpdated")
  );

  return data;
}


export async function getFavorites() {
  const response = await fetch(
    `${API_URL}/favorites/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load favorites"
    );
  }

  return response.json();
}


export async function removeFavorite(favoriteId) {
  const response = await fetch(
    `${API_URL}/favorites/${favoriteId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to remove favorite"
    );
  }

  const data = await response.json();

  window.dispatchEvent(
    new Event("favoritesUpdated")
  );

  return data;
}

export async function getCategories() {
  const response = await fetch(
    `${API_URL}/products/categories`
  );

  if (!response.ok) {
    throw new Error("Failed to load categories");
  }

  return response.json();
}

export async function rateProduct(productId, rating) {
  const response = await fetch(
    `${API_URL}/ratings/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        product_id: productId,
        rating: rating
      })
    }
  );

  if (!response.ok) {
    throw new Error("Failed to rate product");
  }

  return response.json();
}

export async function getProductRating(productId) {
  const response = await fetch(
    `${API_URL}/ratings/product/${productId}`
  );

  if (!response.ok) {
    throw new Error("Failed to load product rating");
  }

  return response.json();
}


export async function getMyProductRating(productId) {
  const response = await fetch(
    `${API_URL}/ratings/me/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load user rating");
  }

  return response.json();
}

export async function refreshSession(refreshToken) {
  const response = await fetch(
    `${API_URL}/auth/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        refresh_token: refreshToken
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Session refresh failed"
    );
  }

  return data;
}

export async function incrementCartItem(cartItemId) {
  const response = await fetch(
    `${API_URL}/cart/${cartItemId}/increment`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Cannot increase quantity"
    );
  }

  window.dispatchEvent(
    new Event("cartUpdated")
  );

  return data;
}


export async function decrementCartItem(cartItemId) {
  const response = await fetch(
    `${API_URL}/cart/${cartItemId}/decrement`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Cannot decrease quantity"
    );
  }

  window.dispatchEvent(
    new Event("cartUpdated")
  );

  return data;
}

export const uploadProfileImage = async (
  imageFile
) => {
  const formData = new FormData();

  formData.append(
    "file",
    imageFile
  );

  const response = await fetch(
    `${API_URL}/auth/profile/image`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${getToken()}`
      },

      body: formData
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Failed to upload profile image"
    );
  }

  return data;
};

export async function createOrder() {
  const response = await fetch(
    `${API_URL}/orders/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Failed to create order"
    );
  }

  window.dispatchEvent(
    new Event("cartUpdated")
  );

  return data;
}


export async function getOrders() {
  const response = await fetch(
    `${API_URL}/orders/`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Failed to load orders"
    );
  }

  return data;
}


export async function getOrderById(orderId) {
  const response = await fetch(
    `${API_URL}/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Failed to load order"
    );
  }

  return data;
}


export async function cancelOrder(orderId) {
  const response = await fetch(
    `${API_URL}/orders/${orderId}/cancel`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Failed to cancel order"
    );
  }

  return data;
}


export async function requestOrderReturn(
  orderId
) {
  const response = await fetch(
    `${API_URL}/orders/${orderId}/return`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Failed to request return"
    );
  }

  return data;
}


export async function requestOrderRefund(
  orderId
) {
  const response = await fetch(
    `${API_URL}/orders/${orderId}/refund`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Failed to request refund"
    );
  }

  return data;
}


export async function reorderOrder(orderId) {
  const response = await fetch(
    `${API_URL}/orders/${orderId}/reorder`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Failed to reorder"
    );
  }

  window.dispatchEvent(
    new Event("cartUpdated")
  );

  return data;
}


export async function updateOrderStatus(
  orderId,
  status
) {
  const response = await fetch(
    `${API_URL}/orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        status
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Failed to update order status"
    );
  }

  return data;
}


export async function downloadOrderInvoice(
  orderId
) {
  const response = await fetch(
    `${API_URL}/orders/${orderId}/invoice`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  if (!response.ok) {
    let message =
      "Failed to download invoice";

    try {
      const data = await response.json();

      message =
        data.detail || message;
    } catch {
      // Response was not JSON.
    }

    throw new Error(message);
  }

  const blob =
    await response.blob();

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `invoice-${orderId}.pdf`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
}