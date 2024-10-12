import React, { useState, useEffect } from "react";
import "./KiranaStore.css";

const KiranaStore = () => {
  const [products, setProducts] = useState([
    { name: "Rice", price: "₹100/kg", id: 1 },
    { name: "Wheat Flour", price: "₹40/kg", id: 2 },
    { name: "Sugar", price: "₹50/kg", id: 3 },
    { name: "Oil", price: "₹150/ltr", id: 4 },
  ]);

  return (
    <div className="kirana-store-section">
      <h2>Kirana Store</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KiranaStore;
