import { IoNewspaperOutline, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const NewOrder = () => {
    const [orders, setOrders] = useState([]);
    const [orderDetail, setOrderDetail] = useState({});
    const [showDetail, setShowDetail] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                console.log(localStorage.getItem("user"));
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                const filteredOrders = response.data.docs.filter(order =>
                    order.status !== "cancelled" && order.status !== "delivered"
                );

                setOrders(filteredOrders);
            }
            catch (error) {
                console.error("Error fetching orders:", error);
            }
        }
        fetchOrders();
    }, []);

    const handleOrderDetail = (order) => {
        setOrderDetail(order);
        setShowDetail(true);
    }



    const handleUpdateOrderStatus = async (id, newStatus) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/order/${id}`, { status: newStatus }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                toast.success(`Order status updated to ${newStatus}`);
                setOrders(prevOrders =>
                    prevOrders
                        .map(order =>
                            order._id === id ? { ...order, status: newStatus } : order
                        )
                        // Nếu đơn hàng đã "cancelled" hoặc "delivered", thì loại bỏ khỏi danh sách
                        .filter(order =>
                            order.status !== "cancelled" && order.status !== "delivered"
                        )
                );
            }
        }
        catch (error) {
            console.error("Error updating order status:", error);
        }

    }

    return (
        <div className="ml-80 w-full bg-gray-50 rounded-2xl p-6 shadow-sm">
            {/* Header with sales summary */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">New Orders</h1>
                    <p className="text-gray-500">Manage pending and processing orders</p>
                </div>

            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#F8E9E7]">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Customer</th>
                                {/* <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Contact</th> */}
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Products</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Delivery Date</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{order.customerId.name}</div>
                                    </td>
                                    {/* <td className="px-6 py-4 whitespace-normal max-w-xs break-words">
                                        <div className="text-gray-900 font-medium">{order.deliveryInfo.phone}</div>
                                        <div className="text-gray-500 text-sm">{order.deliveryInfo.address}</div>
                                    </td> */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col space-y-1">
                                            {order.item.map((product, index) => (
                                                <div key={index} className="text-sm text-gray-800">
                                                    <span className="font-medium">{product.name}</span> × {product.qty}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {order.deliveryInfo.deliveryDate}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                                        {parseInt(order.totalPrice).toLocaleString()} VND
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col space-y-2">
                                            {order.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateOrderStatus(order._id, "confirmed")}
                                                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-1.5 rounded-full font-medium text-sm transition duration-200"
                                                    >
                                                        ✅ Xác nhận
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateOrderStatus(order._id, "cancelled")}
                                                        className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-1.5 rounded-full font-medium text-sm transition duration-200"
                                                    >
                                                        ❌ Từ chối
                                                    </button>
                                                </>
                                            )}

                                            {order.status === "confirmed" && (
                                                <button
                                                    onClick={() => handleUpdateOrderStatus(order._id, "shipping")}
                                                    className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-1.5 rounded-full font-medium text-sm transition duration-200"
                                                >
                                                    🚚 Vận chuyển
                                                </button>
                                            )}

                                            {order.status === "shipping" && (
                                                <button
                                                    onClick={() => handleUpdateOrderStatus(order._id, "delivered")}
                                                    className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-1.5 rounded-full font-medium text-sm transition duration-200"
                                                >
                                                    🏁 Hoàn thành
                                                </button>
                                            )}

                                            {order.status === "delivered" && (
                                                <span className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                                                    ✅ Đã giao
                                                </span>
                                            )}

                                            {order.status === "cancelled" && (
                                                <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-sm font-semibold">
                                                    ❌ Đã hủy
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        <button
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                            onClick={() => handleOrderDetail(order)}
                                        >
                                            <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Chi tiết
                                        </button>
                                    </td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {orders.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{orders.length}</span> of{' '}
                            <span className="font-medium">{orders.length}</span> orders
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50" disabled>
                                <IoChevronBack />
                            </button>
                            <button className="px-4 py-2 rounded-md bg-[#A78A8A] text-white font-medium">1</button>
                            <button className="p-2 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50" disabled>
                                <IoChevronForward />
                            </button>
                        </div>
                    </div>
                )}

                {orders.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No orders found. Start by creating a new order.
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {showDetail && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/50 ">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng</h2>
                            <button
                                onClick={() => setShowDetail(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Thông tin khách hàng */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold text-lg text-gray-700 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Thông tin khách hàng
                            </h3>
                            <div className="space-y-2 text-gray-600">
                                <p className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">Tên:</span>
                                    {orderDetail.customerId?.name || "Không có thông tin"}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">SĐT:</span>
                                    {orderDetail.deliveryInfo?.phone || "Không có thông tin"}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">Địa chỉ:</span>
                                    {orderDetail.deliveryInfo?.address || "Không có thông tin"}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">Ngày nhận:</span>
                                    {orderDetail.deliveryInfo?.deliveryDate || "Không có thông tin"}
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">Giờ nhận:</span>
                                    {orderDetail.deliveryInfo?.deliveryTime || "Không có thông tin"}
                                </p>
                                {orderDetail.deliveryInfo?.note && (
                                    <p className="flex items-start gap-2">
                                        <span className="font-medium text-gray-700">Ghi chú:</span>
                                        <span className="italic">{orderDetail.deliveryInfo.note}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg text-gray-700 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                Sản phẩm đã đặt
                            </h3>
                            <div className="space-y-4">
                                {orderDetail.item?.map((product, index) => (
                                    <div key={index} className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <img
                                            src={product.photo || "/placeholder-product.jpg"}
                                            alt={product.name}
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                            onError={(e) => {
                                                e.target.src = "/placeholder-product.jpg";
                                            }}
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">{product.name}</p>
                                            <div className="flex justify-between mt-1 text-sm text-gray-500">
                                                <span>Số lượng: {product.qty}</span>
                                                <span>{parseInt(product.price).toLocaleString()} VND</span>
                                            </div>
                                            <div className="mt-1 text-right font-medium">
                                                {(product.qty * product.price).toLocaleString()} VND
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tổng tiền */}
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="font-semibold text-gray-700">Tổng cộng:</span>
                            <span className="text-xl font-bold text-[#C75146]">
                                {parseInt(orderDetail.totalPrice).toLocaleString()} VND
                            </span>
                        </div>

                        <button
                            onClick={() => setShowDetail(false)}
                            className="mt-6 w-full py-3 bg-[#C75146] hover:bg-[#A8433A] text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}


            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}

export default NewOrder;