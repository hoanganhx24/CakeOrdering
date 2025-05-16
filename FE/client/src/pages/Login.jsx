import { Link } from "react-router-dom";
import { useState } from "react";
import { useRef } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import Lottie from 'lottie-react';
import animationData from '../../public/Animation - 1746086106206.json';
import { useEffect } from "react";
import axios from "axios";

const Login = () => {
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [error, setError] = useState(null);
    const { login, logout } = useAuth();
    const lottieRef = useRef();
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                username,
                password
            });

            console.log(response.data);
            const { user, token } = response.data;

            if (user.role === "customer") {
                login(user, token);
                navigate("/");
            }
            else if (user.role === "admin") {
                logout();
                alert("Tài khoản của bạn không có quyền truy cập vào trang này!");
                navigate("/login");
            }

        }catch (error) {
            console.error("Login error:", error);
            setError("Login failed. Please check your credentials.");
        }
        // if (success) {
        //     navigate(username === "admin" ? "/homeAdmin" : "/");
        // } else {
        //     alert("Sai tài khoản hoặc mật khẩu!");
        // }
    };
    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (credentialResponse) => {
            const token = credentialResponse.credential;
            const success = await login(token, null, true);
            if (success) {
                navigate("/");
            } else {
                alert("Login failed!");
            }
        },
        onError: () => {
            console.log("Login Failed");
        },
    });
    return (
        <div>
            <div className=''>
                <Header />
            </div>
            <div className="flex justify-center items-center h-180">
                <div className=" flex justify-center items-center h-125 shadow-2xl rounded-lg">
                    <div className=" w-100 h-full bg-[#F16464]/10 rounded-l-lg">
                        <Lottie
                            lottieRef={lottieRef}
                            animationData={animationData}
                            loop={true}
                            autoplay={true}
                            style={{ height: '400px', width: '400px' }}
                            onDOMLoaded={() => console.log('Animation ready')}
                            onError={(e) => console.error('Animation error:', e)}
                        />
                        <div className="backdrop-blur-sm bg-white/30 rounded-xl p-4 flex justify-between items-center shadow-md mx-10">
                            <span className="text-black font-medium">Don't have an account?</span>
                            <button className="bg-[#705959]/40 text-black px-4 py-1 rounded-lg font-semibold hover:bg-white/60 transition">
                                <Link to="/register">Sign up</Link>
                            </button>
                        </div>

                    </div>
                    <div className="bg-gray-100 p-12 flex flex-col justify-center items-center w-100 h-125 rounded-r-lg">
                        <h2 className="text-2xl font-merienda font-bold text-[#705959]">Welcome Back!</h2>

                        <div className="mt-8">
                            <form action="" onSubmit={handleLogin}>
                                {/* Username */}
                                <label htmlFor="userName" className=" text-gray-500 font-merienda">Username</label>
                                <div className="flex items-center rounded-lg  border border-gray-300 bg-white mb-4">
                                    <FaUser className="text-[#F16464] text-2xl mx-3" />
                                    <input
                                        type="text"
                                        id="userName"
                                        className="py-2 px-1 w-full focus:outline-none font-merienda text-gray-500 bg-transparent"
                                        value={username}
                                        onChange={(e) => setusername(e.target.value)}
                                        placeholder="Enter your username"
                                    />
                                </div>

                                {/* Password */}
                                <label htmlFor="passWord" className=" text-gray-500 font-merienda">Password</label>
                                <div className=" flex items-center rounded-lg  border border-gray-300 bg-white">
                                    <FaLock className="text-[#F16464] text-2xl mx-3" />
                                    <input
                                        type="password"
                                        suggested="current-password"
                                        id="passWord"
                                        className=" py-2 px-1 w-full focus:outline-none font-merienda text-gray-500 bg-transparent"
                                        value={password}
                                        onChange={(e) => {
                                            setpassword(e.target.value);
                                        }}
                                    />
                                </div>

                                {/* Login Button */}
                                <div className="">
                                    <button className="mt-8 bg-[#705959] text-white w-full py-2 rounded-lg font-merienda text-2xl"
                                        type="submit" autoComplete="current-password"
                                    >Login</button>
                                </div>
                                <div className=" items-center w-full mt-4 flex justify-center">-- Hoặc đăng nhập với --</div>
                                {/* Google Login */}
                                <div className="mt-4 w-full">
                                    <button
                                        onClick={loginWithGoogle}
                                        className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        <FcGoogle className="text-xl" />
                                        <span>Continue with Google</span>
                                    </button>
                                </div>
                            </form>


                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
}
export default Login;