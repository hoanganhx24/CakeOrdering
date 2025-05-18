import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, Navigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { IoTodayOutline } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';

const Cart = () => {
    const { orders, addOrder } = useOrder();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [deliveryDate, setDeliveryDate] = useState("");
    const [deliveryTime, setDeliveryTime] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [note, setNote] = useState("");


    const token = localStorage.getItem("token");
    const [cart, setCart] = useState([]);
    const [totalCostAll, setTotalCostAll] = useState(0);


    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setCart(response.data.item);
                setTotalCostAll(response.data.totalPrice);
            } catch (error) {
                console.error("Error fetching cart:", error);
                setCart([]);
                setTotalCostAll(0);
            }
        };
        fetchCart();
    }, [token]);

    const deleteItemCart = async (productId)=>{
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/${productId}`, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
            });
            console.log(response.data);
            setCart(response.data.item);
            setTotalCostAll(response.data.totalPrice);
        }
        catch (error) {
            console.error("Error deleting item from cart:", error);
        }
    }

    const changeQuantityProduct = async (productId, quantity) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/cart/${productId}`,
                {
                    qty: quantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            console.log(response.data);
            setCart(response.data.item);
            setTotalCostAll(response.data.totalPrice);
        }
        catch (error) {
            console.error("Error changing quantity of product:", error);
        }
    }
    const handleClickOrder =  async (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert("Cart is empty!");
            return;
        }

        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/order`, {
                deliveryDate: deliveryDate,
                deliveryTime: deliveryTime,
                phone: phone,
                address: address,
                note: note,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            if (response.status === 201){
                toast.success("Đặt hàng thành công!", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false
                    , closeOnClick: true,
                    pauseOnHover: true,});
                setTimeout(() => {
                    navigate("/ordersuccess");
                }, 3000);
            }
        }
        catch (error) {
            console.error("Error placing order:", error);
            alert("Đặt hàng thất bại!");
        }
    }

    console.log(deliveryDate);
    console.log(deliveryTime);
    console.log(phone);
    console.log(address);
    console.log(note);
    return (
        <div className="">
            <div className=' sticky z-10 top-0'>
                <Header />
            </div>
            <div className="flex mx-10 gap-16 my-10 ">
                <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-1/3">
                    <h2 className="text-2xl font-bold mb-6 text-amber-800">Thông tin nhận hàng</h2>

                    <form className="space-y-4" onSubmit={handleClickOrder}>
                        {/* Ngày nhận */}
                        <div>
                            <label htmlFor="deliveryDate" className="block text-sm font-medium text-amber-900 mb-1">
                                Ngày nhận hàng <span className="text-red-500">*</span>
                            </label>
                            <input
                                onChange={(e) => setDeliveryDate(e.target.value)}
                                value={deliveryDate}
                                type="date"
                                id="deliveryDate"
                                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-[#F8E9E7]"
                                min={new Date().toISOString().split('T')[0]} // Chỉ cho phép chọn từ ngày hiện tại
                                required
                            />
                        </div>

                        {/* Giờ nhận */}
                        <div>
                            <label htmlFor="deliveryTime" className="block text-sm font-medium text-amber-900 mb-1">
                                Giờ nhận hàng <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="deliveryTime"
                                onChange={(e) => setDeliveryTime(e.target.value)}
                                value={deliveryTime}
                                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-[#F8E9E7]"
                                required
                            >
                                <option value="">-- Chọn giờ --</option>
                                <option value="08:00-10:00">8:00 - 10:00</option>
                                <option value="10:00-12:00">10:00 - 12:00</option>
                                <option value="13:00-15:00">13:00 - 15:00</option>
                                <option value="15:00-17:00">15:00 - 17:00</option>
                            </select>
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-amber-900 mb-1">
                                Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                onChange={(e) => setPhone(e.target.value)}
                                value={phone}
                                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-[#F8E9E7]"
                                placeholder="0987 654 321"
                                pattern="0[0-9]{9}"
                                required
                            />
                        </div>

                        {/* Địa chỉ */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-amber-900 mb-1">
                                Địa chỉ nhận hàng <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="address"
                                rows={3}
                                onChange={(e) => setAddress(e.target.value)}
                                value={address}
                                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-[#F8E9E7]"
                                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                                required
                            />
                        </div>

                        {/* Ghi chú */}
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-amber-900 mb-1">
                                Ghi chú
                            </label>
                            <textarea
                                id="notes"
                                onChange={(e) => setNote(e.target.value)}
                                value={note}
                                rows={2}
                                className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-[#F8E9E7]"
                                placeholder="Yêu cầu đặc biệt, hướng dẫn giao hàng..."
                            />
                        </div>

                        {/* Nút submit */}
                        <button
                            type="submit"
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg font-medium transition-colors mt-6"
                        >
                            Đặt hàng
                        </button>
                    </form>
                </div>
                <div className="px-8 bg-gray-50 py-6 w-3/5 mx-auto shadow-lg self-start">
                    {/* Header */}
                    <div className="bg-white grid grid-cols-12 gap-2 p-4 font-bold text-lg border-b">
                        <div className="col-span-5 text-center">Product</div>
                        <div className="col-span-2 text-center">Quantity</div>
                        <div className="col-span-3 text-center">Total</div>
                        <div className="col-span-2 text-center">Action</div>
                    </div>

                    {/* Cart Items */}
                    <div className="bg-white divide-y">
                        {cart.map((item) => (
                            <div key={item.productId} className="grid grid-cols-12 gap-2 p-4 items-center">
                                {/* Product Image & Name */}
                                <div className="col-span-5 flex items-center space-x-4">
                                    <div className="p-1 rounded">
                                        <Link to={`/detail/${item.productId}`}>
                                            <img
                                                src={item.photo}
                                                alt={item.name}
                                                className="w-16 h-16 object-contain"
                                            />
                                        </Link>
                                    </div>
                                    <Link
                                        to={`/detail/${item.productId}`}
                                        className="text-lg hover:text-blue-600 line-clamp-2"
                                    >
                                        {item.name}
                                    </Link>
                                </div>

                                {/* Quantity */}
                                <div className="col-span-2 flex justify-center">
                                    <div className="relative w-20">
                                        <input
                                            onChange={(e) => changeQuantityProduct(item.productId, e.target.value)}
                                            type="number"
                                            min="1"
                                            defaultValue={item.qty}
                                            className="w-full p-2 border border-gray-300 rounded text-center"
                                        />
                                    </div>
                                </div>

                                {/* Total Price */}
                                <div className="col-span-3 text-center font-medium text-lg text-amber-700">
                                    {(item.price * item.qty).toLocaleString()} VND
                                </div>

                                {/* Delete Button */}
                                <div className="col-span-2 text-center">
                                    <button
                                        onClick={() => deleteItemCart(item.productId)}
                                        className="bg-red-100 hover:bg-red-200 text-red-700 py-1 px-3 rounded-lg text-sm transition-colors flex items-center mx-auto"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="bg-white p-4 mt-4 flex justify-between items-center rounded-b-lg">
                        <div className="text-xl font-bold text-gray-800">
                            Total: <span className="text-amber-700">{totalCostAll.toLocaleString()}</span> VND
                        </div>
                        <div className="space-x-3">
                            {/* <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg font-medium transition-colors"
                            >
                                Continue Shopping
                            </button> */}
                            <button
                                className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                            >
                                <Link to="/menu/ALL">Continue Shopping</Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer />

        </div>
    );
}
export default Cart;