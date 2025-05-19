import Header from "../components/Header";
import Footer from "../components/Footer";
import { CiUser } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { PiPackageLight } from "react-icons/pi";
import { PiUserCircleThin } from "react-icons/pi";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { IoNewspaperOutline, IoChevronBack, IoChevronForward } from "react-icons/io5";


const Account = () => {
    const [showModal, setShowModal] = useState(false);
    const { section } = useParams();
    const { user, logout } = useAuth();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [orders, setOrders] = useState([]);
    const [username, setUsername] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalDocs, setTotalDocs] = useState(0);
    const [pagingCounter, setPagingCounter] = useState(0);
    const [hasPrevPage, setHasPrevPage] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [orderDetail, setOrderDetail] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        if (section === "orderstatus") {
            const fetchOrders = async () => {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_URL}/api/order`,
                        {
                            params: {
                                startDate: startDate,
                                endDate: endDate,
                                status: statusFilter,
                                page: page,
                                limit: 5
                            },
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    console.log(response.data.docs);
                    
                        setOrders(response.data.docs);
                        setHasPrevPage(response.data.hasPrevPage);
                        setHasNextPage(response.data.hasNextPage);
                        setTotalDocs(response.data.totalDocs);
                        setPagingCounter(response.data.pagingCounter);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                    setOrders([]);
                    // toast.error("Lỗi khi tải đơn hàng");
                }
            };
            fetchOrders();
        }
        if (section === "myaccount") {
            const fetchUser = async () => {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_URL}/api/user/profile`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    if (response.status === 200) {
                        setFullName(response.data.name);
                        setEmail(response.data.email);
                        setUsername(response.data.username);
                    }
                } catch (error) {
                    console.error("Error fetching user:", error);
                    toast.error("Lỗi khi tải thông tin người dùng");
                }
            };
            fetchUser();
        }
    }, [section, startDate, endDate, statusFilter, user, page]);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu không khớp");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/changePassword`, {
                username: username,
                oldPassword: oldPassword,
                newPassword: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.status === 200) {
                toast.success("Đổi mật khẩu thành công");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error("Mật khẩu cũ không đúng");
            }
            console.error(error);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/updateUser`, {
                name: fullName,
                email: email
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.status === 200) {
                toast.success("Cập nhật thông tin thành công");

            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error("Cập nhật thông tin thất bại");
            }
            console.error(error);
        }
    };

    const handleLogout = () => {
        console.log("User logged out");
        logout();
        navigate("/");
        setShowModal(false);
    };

    const handleOrderDetail = (order) => {
        setOrderDetail(order);
        setShowDetail(true);
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className='sticky z-10 top-0'>
                <Header />
            </div>
            <div className="flex px-4 md:px-20 gap-8 my-8 md:my-20 flex-1">
                <div className="w-1/5 flex flex-col max-h-max">
                    <div className="w-full flex items-center p-4">
                        <PiUserCircleThin size={50} />
                        <div className="ml-4">
                            <div className=" md:text-xl">{user.name}</div>
                            <div className="text-lg md:text-xl text-gray-600">{username}</div>
                        </div>
                    </div>
                    <div className="mt-8 w-full">
                        <Link to={`/account/myaccount`} className={`flex items-center w-full p-4 gap-2 rounded-lg transition-all ${section === "myaccount" ? "bg-[#F1EDED] border-l-4 border-l-[#A78A8A] text-[#A78A8A]" : "hover:bg-gray-100"}`}>
                            <CiUser size={24} />
                            <span className="text-lg md:text-xl">My Account</span>
                        </Link>
                        <Link to={`/account/orderstatus`} className={`flex items-center w-full p-4 gap-2 rounded-lg transition-all ${section === "orderstatus" ? "bg-[#F1EDED] border-l-4 border-l-[#A78A8A] text-[#A78A8A]" : "hover:bg-gray-100"}`}>
                            <PiPackageLight size={24} />
                            <span className="text-lg md:text-xl">Order Status</span>
                        </Link>
                        <button
                            className="flex items-center w-full p-4 gap-2 rounded-lg hover:bg-gray-100 transition-all"
                            onClick={() => setShowModal(true)}
                        >
                            <IoIosLogOut size={24} />
                            <span className="text-lg md:text-xl">Logout</span>
                        </button>
                    </div>
                </div>

                <div className="w-4/5 rounded-2xl">
                    {section === "myaccount" && (
                        <div className="flex flex-col md:flex-row my-6 mx-4 md:mx-16 lg:mx-32 gap-16">
                            <div className="w-full md:w-1/2">
                                <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-xl shadow-lg w-full p-6 animate-fadeIn border border-white border-opacity-30">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Cập nhật thông tin</h2>
                                    <form className="space-y-4" onSubmit={handleUpdateUser}>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Username</label>
                                            <input
                                                type="text"
                                                value={username}
                                                readOnly
                                                className="mt-1 block w-full rounded-md bg-gray-100 border border-gray-300 p-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-2 pt-4">
                                            <button
                                                type="button"

                                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Cập nhật
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2">
                                <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-xl shadow-lg w-full p-6 animate-fadeIn border border-white border-opacity-30">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Đổi mật khẩu</h2>
                                    <form className="space-y-4" onSubmit={handleChangePassword}>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Old password</label>
                                            <input
                                                type="password"
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">New password</label>
                                            <input
                                                type="password"
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Confirm password</label>
                                            <input
                                                type="password"
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-2 pt-4">
                                            <button
                                                type="button"

                                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Cập nhật
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {section === "orderstatus" && (
                        <div className="bg-white bg-opacity-60 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden border border-white border-opacity-30">
                            <div className="p-4 bg-white bg-opacity-80 flex flex-col md:flex-row gap-4 items-center justify-between">
                                {/* Bộ lọc ngày */}
                                <div className="flex flex-col md:flex-row gap-2 items-center">
                                    <span className="text-sm font-medium text-gray-800">Lọc theo ngày:</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="p-2 border border-gray-300 rounded-lg text-sm bg-white bg-opacity-90 shadow-inner transition focus:ring-2 focus:ring-[#A78A8A]"
                                        />
                                        <span className="text-gray-700">đến</span>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            min={startDate}
                                            className="p-2 border border-gray-300 rounded-lg text-sm bg-white bg-opacity-90 shadow-inner transition focus:ring-2 focus:ring-[#A78A8A]"
                                        />
                                    </div>
                                </div>

                                {/* Bộ lọc trạng thái */}
                                <div className="flex flex-col md:flex-row gap-2 items-center">
                                    <span className="text-sm font-medium text-gray-800">Trạng thái:</span>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="p-2 border border-gray-300 rounded-lg text-sm bg-white bg-opacity-90 transition focus:ring-2 focus:ring-[#A78A8A]"
                                    >
                                        <option value="all">Tất cả</option>
                                        <option value="pending">Đang xử lý</option>
                                        <option value="delivered">Hoàn thành</option>
                                        <option value="cancelled">Đã hủy</option>
                                        <option value="shipping">Đang giao</option>
                                    </select>
                                </div>

                                {/* Nút xóa bộ lọc */}
                                {/* <button className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-800 hover:bg-gray-200 transition shadow-md">
                                    Xóa bộ lọc
                                </button> */}
                            </div>

                            {/* Bảng đơn hàng */}
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr className="bg-[#A78A8A] bg-opacity-90 text-white">
                                        <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider uppercase">Sản phẩm</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider uppercase">Địa chỉ</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider uppercase">SĐT</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider uppercase">Ngày</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider uppercase">Tổng</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider uppercase">Trạng thái</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider uppercase">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white bg-opacity-50 divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-white hover:bg-opacity-80 transition duration-200">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 text-sm text-gray-800">
                                                    {order.item.map((product, index) => (
                                                        <div key={index}>
                                                            {product.name} × {product.qty}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4  text-sm text-gray-700">{order.deliveryInfo.address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.deliveryInfo.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString("vi-VN", {
                                                timeZone: "Asia/Ho_Chi_Minh",
                                            })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.totalPrice.toLocaleString()} VND</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 text-xs rounded-full font-medium ${order.status === 'pending' ? 'bg-yellow-200 text-yellow-900'
                                                        : order.status === 'delivered' ? 'bg-green-200 text-green-900'
                                                            : order.status === 'cancelled' ? 'bg-red-200 text-red-900'
                                                                : 'bg-blue-200 text-blue-900'
                                                        }`}
                                                >
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

                            {/* Pagination */}
                            {orders.length > 0 && (
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        Showing <span className="font-medium">{pagingCounter}</span> to <span className="font-medium">{orders.length + pagingCounter - 1}</span> of{' '}
                                        <span className="font-medium">{totalDocs}</span> orders
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

                    )}
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-white/50 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Bạn có muốn đăng xuất?</h3>
                            <p className="text-gray-600 mb-6">
                                Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng hệ thống.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    onClick={() => setShowModal(false)}
                                >
                                    Không
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    onClick={handleLogout}
                                >
                                    Có
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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
                                        {new Date(orderDetail.deliveryInfo.deliveryDate).toLocaleDateString("vi-VN", {
                                            timeZone: "Asia/Ho_Chi_Minh",
                                        })}
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
            <ToastContainer />
            {/* <Footer /> */}
        </div>
    );
}

export default Account;