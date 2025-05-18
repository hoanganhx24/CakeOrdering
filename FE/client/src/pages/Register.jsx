import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useRef } from "react";
import Lottie from 'lottie-react';
import animationData from '../../public/Animation - 1746086106206.json';
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";


const Register = () => {
    const lottieRef = useRef();
    const { login } = useAuth();
    const navigate = useNavigate();
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
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            toast.error("Passwords do not match");
            
            return;
        }
        console.log(fullName, email, username, password);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                name: fullName,
                email: email,
                username: username,
                password: password,
            });
            console.log(response.data);
            if (response.status === 201) {
                const { user, token } = response.data;
                login(user, token);
                toast.success("Registration successful!", {
                    position: "top-center",
                    autoClose: 2000,
                }
                );
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } catch (error) {
            console.error("Registration error:", error);
            if (error.response && error.response.status === 400) {
                setError("User already exists");
                toast.error("User already exists");
            } else {
                setError("Registration failed. Please try again.");
                toast.error("Registration failed. Please try again.");
            }
        }
    }
    return (
        <div>
            <div className=''>
                <Header />
            </div>
            <div className="flex justify-center items-center h-180">
                <div className=" flex justify-center items-center h-140 shadow-2xl rounded-lg">
                    <div className="bg-gray-100 p-12 flex flex-col justify-center items-center w-100 h-140 rounded-r-lg">
                        <div className="text-2xl font-bold text-[#705959]">Let Us Know You!</div>

                        <div className="mt-8">
                            <form action="" onSubmit={handleRegister} className="w-80">
                            <label htmlFor="username" className=" text-gray-500  font-bold">Username</label>
                                <div className="flex items-center rounded-lg  border border-gray-300 bg-white mb-4">
                                    <FaUser className="text-[#F16464] text-2xl mx-3" />
                                    <input
                                        type="text"
                                        id="username"
                                        onChange={(e) => setUsername(e.target.value)}
                                        value={username}
                                        className="py-2 px-1 w-full focus:outline-none text-gray-500 bg-transparent"
                                        pattern="[A-Za-z0-9]+"
                                        required
                                        placeholder="Enter your username"

                                    />
                                </div>
                                {/* Email */}
                                <label htmlFor="email" className=" text-gray-500 font-bold">Email</label>
                                <div className="flex items-center rounded-lg  border border-gray-300 bg-white mb-4">
                                    <MdOutlineAlternateEmail className="text-[#F16464] text-2xl mx-3" />
                                    <input
                                        type="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        id="email"
                                        className="py-2 px-1 w-full focus:outline-none text-gray-500 bg-transparent"
                                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                        placeholder="Enter your email"
                                        required

                                    />
                                </div>


                                
                                <label htmlFor="fullName" className=" text-gray-500 font-bold">Fullname</label>
                                <div className="flex items-center rounded-lg  border border-gray-300 bg-white mb-4">
                                    <FaUser className="text-[#F16464] text-2xl mx-3" />
                                    <input
                                        type="text"
                                        id="fullName"
                                        onChange={(e) => setFullName(e.target.value)}
                                        value={fullName}
                                        className="py-2 px-1 w-full focus:outline-none  text-gray-500 bg-transparent"
                                        pattern="[A-Za-z]+"
                                        required
                                        placeholder="Enter your full name"

                                    />
                                </div>

                                {/* Password */}
                                <label htmlFor="passWord" className=" text-gray-500 font-bold">Password</label>
                                <div className=" flex items-center rounded-lg  border border-gray-300 bg-white">
                                    <FaLock className="text-[#F16464] text-2xl mx-3" />
                                    <input
                                        type="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        id="passWord"
                                        className=" py-2 px-1 w-full focus:outline-none text-gray-500 bg-transparent"
                                        pattern="[A-Za-z0-9]{8,}"
                                        placeholder="Enter your password"
                                        required

                                    />
                                </div>

                                <label htmlFor="confirmPassWord" className=" text-gray-500 font-bold ">Confirm Password</label>
                                <div className=" flex items-center rounded-lg  border border-gray-300 bg-white">
                                    <FaLock className="text-[#F16464] text-2xl mx-3" />
                                    <input
                                        type="password"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        value={confirmPassword}
                                        id="confirmPassWord"
                                        className=" py-2 px-1 w-full focus:outline-none  text-gray-500 bg-transparent"
                                        pattern="[A-Za-z0-9]{8,}"
                                        placeholder="Confirm your password"
                                        required

                                    />
                                </div>

                                {/* Login Button */}
                                <div className="">
                                    <button className="mt-8 bg-[#705959] text-white w-full py-2 rounded-lg font-merienda text-2xl"
                                        type="submit" autoComplete="current-password"
                                    >Register</button>
                                </div>

                                {/* <div className="mt-4 w-full">
                                    <button
                                        onClick={loginWithGoogle}
                                        className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        <FcGoogle className="text-xl" />
                                        <span>Đăng ký nhanh với Google</span>
                                    </button>
                                </div> */}
                            </form>


                        </div>
                    </div>
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
                            <span className="text-black font-medium">Have an account?</span>
                            <button className="bg-[#705959]/40 text-black px-4 py-1 rounded-lg font-semibold hover:bg-white/60 transition">
                                <Link to="/login">Login</Link>
                            </button>
                        </div>

                    </div>
                </div>

            </div>
            <ToastContainer />
            {/* Footer */}
            <Footer />
        </div>
    );
}
export default Register;