import { IoNewspaperOutline, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";


const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [hasPrevPage, setHasPrevPage] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [filterStatus, setFilterStatus] = useState("");
    const [orderDetail, setOrderDetail] = useState({});
    const [showDetail, setShowDetail] = useState(false);


    const totalSales = 100000000000;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                console.log(localStorage.getItem("user"));
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/all`, {
                    params: {
                        _page: page,
                        _limit: limit,
                        _status: filterStatus,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setOrders(response.data.docs);
                setHasPrevPage(response.data.hasPrevPage);
                setHasNextPage(response.data.hasNextPage);
            }
            catch (error) {
                console.error("Error fetching orders:", error);
            }
        }
        fetchOrders();
    }, [page, limit, filterStatus]);

    // Status configuration for consistent styling
    const statusConfig = {
        pending: {
            label: "Pending",
            color: "bg-yellow-100 text-yellow-800",
            icon: <FiClock className="mr-1" />
        },
        confirmed: {
            label: "Confirmed",
            color: "bg-blue-100 text-blue-800",
            icon: <FiAlertCircle className="mr-1" />
        },
        shipping: {
            label: "Shipping",
            color: "bg-orange-100 text-orange-800",
            icon: <IoNewspaperOutline className="mr-1" />
        },
        delivered: {
            label: "Delivered",
            color: "bg-green-100 text-green-800",
            icon: <FiCheckCircle className="mr-1" />
        },
        cancelled: {
            label: "Cancelled",
            color: "bg-red-100 text-red-800",
            icon: <FiXCircle className="mr-1" />
        }
    };
    const handleOrderDetail = (order) => {
        setOrderDetail(order);
        setShowDetail(true);
    }


    return (
        <div className="ml-80 w-full bg-gray-50 rounded-2xl p-6 shadow-sm">
            {/* Header with sales summary */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Order Dashboard</h1>
                    <p className="text-gray-500">Manage and track customer orders</p>
                </div>
                <div className="ml-4">
                    <label className="text-sm text-gray-700 mr-2">Filter by status:</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setPage(1); // reset về trang đầu khi lọc
                            setFilterStatus(e.target.value);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#A78A8A]"
                    >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipping">Shipping</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                    <div className="bg-[#F8E9E7] p-3 rounded-full mr-4">
                        <IoNewspaperOutline size={24} className="text-[#A78A8A]" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Sales</p>
                        <p className="text-2xl font-bold">{totalSales.toLocaleString()} VND</p>
                    </div>
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
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Status</th>
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
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status]?.color}`}>
                                            {statusConfig[order.status]?.icon}
                                            {order.status}
                                        </span>


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
                            <button className="p-2 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50" onClick={() => setPage(page - 1)} disabled={!hasPrevPage}>
                                <IoChevronBack />
                            </button>
                            <button className="px-4 py-2 rounded-md bg-[#A78A8A] text-white font-medium">{page}</button>
                            <button className="p-2 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50" onClick={() => setPage(page + 1)} disabled={!hasNextPage}>
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
        </div>
    );
}

export default Dashboard;