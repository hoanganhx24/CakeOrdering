import { useState } from "react";
const Header = () =>{
    const [isOpen, setIsOpen] = useState(false);
    return(
        <div className="bg-[#F8E9E7] px-30 py-4 flex items-center justify-between">
            {/* Logo + Tên thương hiệu */}
            <div className="flex items-center gap-3">
                <img src="../../public/logo.png" alt="HP Cakes Logo" className="w-12 h-12" />
                <span className="text-xl font-merienda text-gray-800">HP CAKES</span>
            </div>

            {/* set menu */}
            <div>
                
            </div>



            <div className="flex items-center gap-6">
                <a href="#" className="text-xl font-merienda text-gray-800">Home</a>
                <a href="#" className="text-xl font-merienda text-gray-800">Menu</a>
                <a href="#" className="text-xl font-merienda text-gray-800">Contact</a>
                <button className="px-6 py-3 bg-white rounded-[8px] text-xl font-merienda text-gray-800">
                Login
                </button>
            </div>
        </div>
    )
}
export default Header;