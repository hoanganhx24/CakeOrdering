import { useState, useContext, createContext } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({children}) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product , quantity) => {
        setCart(
            (prevCart) => {
                const existingItem = prevCart.find((item) => item.id === product.id)

                if(existingItem){
                    return prevCart.map((item) => 
                    item.id === product.id ? {...item, quantity: parseInt(item.quantity) + parseInt(quantity)}:item
                    );
                }else{
                    return [...prevCart, {...product, quantity}];
                }
            }
        );
    }

    const removeFromCart = (id) => {
        setCart(cart.filter((item) => item.id !== id));
    }

    const clearCart = () =>{
        setCart([]);
    }
    const updateCart = (idProduct, quantity) => {
        
    }

    return (
        <CartContext.Provider value={{cart, addToCart, removeFromCart, clearCart}}>
            {children}
        </CartContext.Provider>
    );
}