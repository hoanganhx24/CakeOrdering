import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoCartOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const handleLogout = () => {
        // Thực hiện hành động đăng xuất (ví dụ: xóa token, chuyển hướng)
        console.log("User logged out");
        logout();
        navigate("/");
    };


    useEffect(() => {
        if (isAuthenticated) {
            const fetchCart = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setCart(response.data.item);
                    setLoading(true);
                } catch (error) {
                    console.error("Error fetching cart:", error);
                }
            };

            fetchCart();
        }
    }, [isAuthenticated, cart]);

    return (
        <div className="bg-[#F8E9E7] px-30 py-4 flex items-center justify-between">
            {/* Logo + Tên thương hiệu */}
            <div className="flex items-center gap-3">
                <img src="../../public/logo.png" alt="HP Cakes Logo" className="w-12 h-12" />
                <span className="text-xl font-merienda text-gray-800">HP CAKES</span>
            </div>
            <div className="flex items-center gap-6">
                <Link to="/" className="text-xl font-merienda text-gray-800">Home</Link>
                <Link to="/menu/ALL" className="text-xl font-merienda text-gray-800">Menu</Link>
                <Link to="/contact" className="text-xl font-merienda text-gray-800">Contact</Link>
                <div>
                    {user ? (
                        <div className="flex items-center gap-6">
                            <div className="relative group inline-block">
                                {/* Nút bấm */}
                                <div className="px-4 py-2">
                                    <FaRegUserCircle size={32} />
                                </div>

                                {/* Dropdown menu */}
                                <div className=" absolute top-12 left-0 w-48 bg-white border border-gray-50 rounded-lg shadow-lg opacity-0 invisible translate-y-5 
                                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 
                                hover:opacity-100 hover:visible hover:translate-y-0 transition-all duration-300 z-50">
                                    {/* <h3 className="font-bold border-b pb-2">Account information</h3> */}
                                    <ul className="py-2">
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            <Link to={`/account/myaccount`}>My Account</Link></li>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                            <Link to={`/account/orderstatus`}>Order Status</Link></li>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleLogout()}>Logout</li>
                                    </ul>
                                </div>
                            </div>
                            {/* <FaRegUserCircle size={32} /> */}
                            <div className="relative">
                                <Link to="/cart">
                                    <IoCartOutline size={40} />

                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-sm rounded-full w-5 h-5 flex items-center justify-center">
                                        {cart.length}
                                    </span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <button className="px-6 py-3 bg-white rounded-[8px] text-xl font-merienda text-gray-800">
                                <Link to="/login" className="text-xl font-merienda text-gray-800">Login</Link>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Header;