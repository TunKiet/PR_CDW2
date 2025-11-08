import { createContext, useState } from "react";

export const CartOrderContext = createContext();

export const CartOrderProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  return (
    <CartOrderContext.Provider value={{ cartItems, setCartItems, orders, setOrders }}>
      {children}
    </CartOrderContext.Provider>
  );
};
