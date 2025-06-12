import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./ProductPage.css";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const ProductPage = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  // Fetch products once on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Debounce filter trigger
  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Derived values
  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;
      const matchesSearch =
        !term ||
        product.title.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const cartTotal = useMemo(() => {
    return cart
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
  }, [cart]);

  // Handlers
  const addToCart = useCallback((product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }, []);

  // Render helpers
  const renderProductCard = useCallback(
    (product) => (
      <div key={product.id} className="product-card">
        <img src={product.image} alt={product.title} loading="lazy" />
        <h3>{product.title}</h3>
        <p>${product.price.toFixed(2)}</p>
        <button onClick={() => addToCart(product)}>Add to Cart</button>
      </div>
    ),
    [addToCart]
  );

  const renderCartItem = useCallback(
    (item) => (
      <div key={item.id} className="cart-item">
        <span>
          {item.title} x {item.quantity}
        </span>
        <span>${(item.price * item.quantity).toFixed(2)}</span>
        <button onClick={() => removeFromCart(item.id)}>Remove</button>
      </div>
    ),
    [removeFromCart]
  );

  const renderLoadingSkeleton = () => (
    <div className="product-grid">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="product-skeleton">
          <div className="skeleton-image" />
          <div className="skeleton-title" />
          <div className="skeleton-price" />
          <div className="skeleton-button" />
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Products</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Product List */}
      {isLoading ? (
        renderLoadingSkeleton()
      ) : (
        <div className="product-grid">
          {filteredProducts.map(renderProductCard)}
        </div>
      )}

      {/* Cart */}
      <div className="cart">
        <h2>Shopping Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {cart.map(renderCartItem)}
            <div className="cart-total">
              <strong>Total: ${cartTotal}</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
