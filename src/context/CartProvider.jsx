import React, {  useState, useEffect } from "react";
import { CartContext } from "./CartContext"; 

const CART_STORAGE_KEY = 'my-ecom-cart-items';

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem(CART_STORAGE_KEY);
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Error loading cart from Local Storage:", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
            console.log("Cart saved to Local Storage.");
        } catch (error) {
            console.error("Error saving cart to Local Storage:", error);
        }
    }, [cartItems]); 

    const addToCart = (item) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(i => i.id === item.id);

            if (existingItem) {
                return prevItems.map(i =>
                    i.id === item.id 
                        ? { ...i, quantity: i.quantity + item.quantity } 
                        : i 
                );
            } else {
                return [...prevItems, item];
            }
        });
    }

    const increaseQuantity = (itemId) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (itemId) => {
        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item.id === itemId) {
                    if (item.quantity > 1) {
                        return { ...item, quantity: item.quantity - 1 };
                    }
                }
                return item;
            }).filter(item => item.quantity > 0) 
        );
    };

    const removeFromCart = (itemId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    } 
    
    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity }}>
            {children}
        </CartContext.Provider>
    )
}