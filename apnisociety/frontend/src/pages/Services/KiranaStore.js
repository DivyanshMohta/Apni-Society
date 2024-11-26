import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import axios from "axios";
import "./KiranaStore.css";

const KiranaStore = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showSection, setShowSection] = useState("products"); // 'products', 'cart', 'orders'

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, "orders");
      const q = query(ordersCollection, where("email", "==", "testuser@example.com"));
      const orderSnapshot = await getDocs(q);
      const orderList = orderSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setOrders(orderList);
    };

    fetchOrders();
  }, []);

  const handleAddToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct.quantity > 1) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      setCart(cart.filter((item) => item.id !== product.id));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  const handleCheckout = async () => {
    try {
      const totalAmount = calculateTotal();
      const response = await axios.get(`http://localhost:5000/pay?amount=${totalAmount}`);
      const { orderId, key_id, amount, currency } = response.data;

      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: "Kirana Store",
        description: "Order Payment",
        order_id: orderId,
        handler: async (response) => {
          await addDoc(collection(db, "orders"), {
            products: cart,
            totalAmount,
            orderId: response.razorpay_order_id,
            email: "testuser@example.com",
            status: "Processing",
            createdAt: new Date(),
          });
          alert("Payment Successful! Order placed.");
          setCart([]);
        },
        prefill: {
          name: "Test User",
          email: "testuser@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || product.category === selectedCategory)
  );

  return (
    <div className="kirana-store">
      <header className="store-header">
        <h1>Kirana Store</h1>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Groceries">Groceries</option>
          <option value="Personal Care">Personal Care</option>
          <option value="Household">Household</option>
        </select>
        <button onClick={() => setShowSection("cart")}>
          Cart ({cart.length})
        </button>
        <button onClick={() => setShowSection("orders")}>Orders</button>
      </header>

      {showSection === "products" && (
        <div className="product-list">
          {filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
            <img 
              src={`/Images/kirana/${product.name}.jpg`} 
              alt={product.name} 
              onError={(e) => {
                if (!e.target.src.includes("/placeholder.png")) {
                  e.target.src = "/Images/kirana/placeholder.png";
                }
              }}
            />
            <h3>{product.name}</h3>
            <p>Price: ₹{product.price}/{product.unit}</p>
            <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
          </div>
          
          ))}
        </div>
      )}

      {showSection === "cart" && (
        <div className="cart-section">
          <h2>Shopping Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <p>{item.name}</p>
                  <p>Price: ₹{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <button onClick={() => handleRemoveFromCart(item)}>-</button>
                  <button onClick={() => handleAddToCart(item)}>+</button>
                </div>
              ))}
              <h3>Total: ₹{calculateTotal()}</h3>
              <button onClick={handleCheckout}>Checkout</button>
            </>
          )}
          <button onClick={() => setShowSection("products")}>Return to Store</button>
        </div>
      )}

      {showSection === "orders" && (
        <div className="order-section">
          <h2>Order History</h2>
          {orders.length === 0 ? (
            <p>No orders placed yet.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="order-card">
                <p>Order ID: {order.orderId}</p>
                <p>Total: ₹{order.totalAmount}</p>
                <p>Status: {order.status}</p>
                <p>Ordered on: {new Date(order.createdAt.seconds * 1000).toLocaleString()}</p>
              </div>
            ))
          )}
          <button onClick={() => setShowSection("products")}>Return to Store</button>
        </div>
      )}
    </div>
  );
};

export default KiranaStore;
