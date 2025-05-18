import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt, FaKey, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
const Login = () => {
    const { login, logout, user } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role === "admin") {
            navigate("/homeAdmin/product")
        }
    }, [user]);

    if (isLoading) {
        if (!user) {
            return (
                <div>
                    <>
                        <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        Đang đăng nhập...
                    </>
                </div>
            );
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                username: username,
                password: password
            })
            if (response.status === 200) {
                const { user, token } = response.data;
                if (user.role === "admin") {
                    login(user, token);
                    navigate("/homeAdmin/product")
                }
                else {
                    toast.error("Tài khoản của bạn không có quyền truy cập vào trang này!", {
                        position: "top-center",
                        autoClose: 2000,
                    });
                }

            }
        }
        catch (error) {
            console.log("Login error:", error);
            if (error.response && error.response.status === 401) {
                toast.error("Sai tài khoản hoặc mật khẩu!", {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        }

        console.log({ username, password });
        // Giả lập loading
        setTimeout(() => setIsLoading(false), 1500);
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Trang quản lý </h1>
                        <p className="text-gray-500">Đăng nhập để tiếp tục với tài khoản của bạn</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUserAlt className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                    placeholder="Nhập tên đăng nhập"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaKey className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                        Đang đăng nhập...
                                    </>
                                ) : 'Đăng nhập'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
export default Login;