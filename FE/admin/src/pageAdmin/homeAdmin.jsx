import Staff from "./staff";
import { GoPeople } from "react-icons/go";
import { CgBox } from "react-icons/cg";
import { LuNewspaper } from "react-icons/lu";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineManageAccounts } from "react-icons/md";
import { AiOutlineCustomerService } from "react-icons/ai";
import { useState } from "react";
import { Link } from "react-router-dom";
import AccountAdmin from "./accountadmin";
import ProductAdmin from "./productAdmin";
import NewOrder from "./newOrder";
import Dashboard from "./dashboard";
import Customer from "./customer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const HomeAdmin = () => {
    const { section } = useParams();
    const { user, logout, loading } = useAuth();
    const [activeTab, setActiveTab] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    useEffect(() => {
        if (!user && !loading) {
            navigate("/");
        }
    }, [user, loading]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative">
            <div className="bg-[#A78A8A] flex h-20 items-center sticky top-0 z-10">
                <div className="ml-30">
                    <button
                        className="px-6 py-3 bg-white rounded-[8px] text-xl text-gray-800"
                        onClick={() => handleLogout()}
                    >
                        Logout
                    </button>
                </div>
                <div className="flex flex-col ml-30 text-3xl font-bold">
                    ADMIN
                </div>
            </div>
            <div className="flex mr-10 my-20">
                <div className="w-64 fixed top-20 left-0 h-[calc(100vh-5rem)] overflow-y-auto bg-white shadow-md z-20">
                    <div className="mt-8 w-full px-4 sticky top-20 z-10">
                        {/* <img
                            src="../../public/logo.png"
                            alt="logo"
                            className="w-40 h-40 mx-auto mb-6"
                        /> */}

                        <button
                            className={`flex items-center w-full h-16 gap-2 px-4 rounded-md transition-all ${section === "product"
                                ? "bg-[#F1EDED] border-l-4 border-[#A78A8A] text-[#A78A8A]"
                                : "hover:bg-[#f5f5f5]"
                                }`}
                            onClick={() => navigate("/homeadmin/product")}
                        >
                            <CgBox size={28} className="mr-2" />
                            <div className="text-xl font-medium">Product</div>
                        </button>

                        <button
                            className={`flex items-center w-full h-16 gap-2 px-4 rounded-md transition-all ${section === "neworders"
                                ? "bg-[#F1EDED] border-l-4 border-[#A78A8A] text-[#A78A8A]"
                                : "hover:bg-[#f5f5f5]"
                                }`}
                            onClick={() => navigate("/homeadmin/neworders")}
                        >
                            <LuNewspaper size={28} className="mr-2" />
                            <div className="text-xl font-medium">New Orders</div>
                        </button>

                        <button
                            className={`flex items-center w-full h-16 gap-2 px-4 rounded-md transition-all ${section === "dashboard"
                                ? "bg-[#F1EDED] border-l-4 border-[#A78A8A] text-[#A78A8A]"
                                : "hover:bg-[#f5f5f5]"
                                }`}
                            onClick={() => navigate("/homeadmin/dashboard")}
                        >
                            <LuLayoutDashboard size={28} className="mr-2" />
                            <div className="text-xl font-medium">Dashboard</div>
                        </button>

                        <button
                            className={`flex items-center w-full h-16 gap-2 px-4 rounded-md transition-all ${section === "customer"
                                ? "bg-[#F1EDED] border-l-4 border-[#A78A8A] text-[#A78A8A]"
                                : "hover:bg-[#f5f5f5]"
                                }`}
                            onClick={() => navigate("/homeadmin/customer")}
                        >
                            <AiOutlineCustomerService size={28} className="mr-2" />
                            <div className="text-xl font-medium">Customer</div>
                        </button>

                        {/* <button
                            className={`flex items-center w-full h-16 gap-2 px-4 rounded-md transition-all ${activeTab === "account"
                                    ? "bg-[#F1EDED] border-l-4 border-[#A78A8A] text-[#A78A8A]"
                                    : "hover:bg-[#f5f5f5]"
                                }`}
                            onClick={() => setActiveTab("account")}
                        >
                            <MdOutlineManageAccounts size={28} className="mr-2" />
                            <div className="text-xl font-medium">Account</div>
                        </button> */}
                    </div>
                </div>

                {section === "product" && <ProductAdmin />}
                {section === "neworders" && <NewOrder />}
                {section === "dashboard" && <Dashboard />}
                {section === "customer" && <Customer />}
                {/* {activeTab === "account" && <AccountAdmin />} */}
            </div>
        </div>
    );
};

export default HomeAdmin;