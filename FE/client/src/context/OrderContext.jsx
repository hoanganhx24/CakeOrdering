import { useContext, useState, createContext } from "react";
import { order } from "../demo/order";

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({children}) => {
    const [orders, setOrders] = useState(order);

    const addOrder = (order) => {
        setOrders([...orders, order]);
    }

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(orders.map(order => 
            order.id === orderId ? { ...order, orderStatus: newStatus } : order
        ));
    };

    return (
        <OrderContext.Provider value={{orders, addOrder, updateOrderStatus}}>
            {children}
        </OrderContext.Provider>
    );
}