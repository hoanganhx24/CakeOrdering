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


const Account = () => {
    const [showModal, setShowModal] = useState(false);
    const { section } = useParams();
    const { user, logout } = useAuth();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [orders, setOrders] = useState([]);
    const [username, setUsername] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
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
                                page: 1,
                                limit: 5
                            },
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    if (response.status === 200) {
                        setOrders(response.data.docs);
                    }
                } catch (error) {
                    console.error("Error fetching orders:", error);
                    toast.error("Lỗi khi tải đơn hàng");
                }
            };
            fetchOrders();
        }
        if(section === "myaccount"){
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
    }, [section, startDate, endDate, statusFilter, user]);

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
                                <button className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-800 hover:bg-gray-200 transition shadow-md">
                                    Xóa bộ lọc
                                </button>
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.deliveryInfo.address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.deliveryInfo.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.createdAt}</td>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Phân trang */}
                            <div className="bg-white bg-opacity-40 px-6 py-4 flex items-center justify-between border-t border-gray-300">
                                <button className="px-4 py-2 bg-white bg-opacity-90 border border-gray-300 rounded-md text-sm text-gray-800 hover:bg-opacity-100 transition">
                                    Previous
                                </button>
                                <div className="hidden md:flex gap-1">
                                    {[1, 2, 3].map((page) => (
                                        <button
                                            key={page}
                                            className={`px-4 py-2 border text-sm rounded-md transition 
                                                    ${page === 1
                                                    ? 'bg-[#A78A8A] text-white border-[#A78A8A]'
                                                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button className="px-4 py-2 bg-white bg-opacity-90 border border-gray-300 rounded-md text-sm text-gray-800 hover:bg-opacity-100 transition">
                                    Next
                                </button>
                            </div>
                        </div>

                    )}
                </div>

                {showModal && (
                    <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 flex justify-center items-center z-50">
                        <div className="bg-white bg-opacity-90 backdrop-blur-lg p-6 rounded-xl shadow-2xl text-center border border-white border-opacity-30">
                            <p className="text-lg font-medium mb-4">Bạn có muốn đăng xuất?</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    className="px-4 py-2 bg-red-500 bg-opacity-90 text-white rounded-lg hover:bg-opacity-100 transition shadow-md"
                                    onClick={handleLogout}
                                >
                                    Có
                                </button>
                                <button
                                    className="px-4 py-2 bg-gray-200 bg-opacity-90 text-gray-800 rounded-lg hover:bg-opacity-100 transition shadow-md"
                                    onClick={() => setShowModal(false)}
                                >
                                    Không
                                </button>
                            </div>
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