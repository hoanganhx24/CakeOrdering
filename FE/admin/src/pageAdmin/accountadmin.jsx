import { useAuth } from "../context/AuthContext";
import { useState } from "react";
const AccountAdmin = () => {
    const {user} = useAuth();
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [email, setEmail] = useState(user?.email || "");
    const [address, setAddress] = useState(user?.address || "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSaveChanges = () => {
        // Kiểm tra nếu người dùng muốn đổi mật khẩu
        if (oldPassword && newPassword) {
            if (oldPassword !== user.passWord) {
                alert("Mật khẩu cũ không đúng!");
                return;
            }
        }

        alert("Thông tin đã được cập nhật!");
    };
    return (
        <div className="ml-80 bg-[#F8E9E7] h-150 rounded-2xl relative overflow-y-auto">
            <div className=" absolute bg-white top-6 bottom-6 left-6 right-6 overflow-y-auto">
                <div className=" bg-[#A78A8A] w-full text-2xl h-16 flex justify-center items-center sticky top-0 z-10">
                    <div className="text-white">Change your information here</div>
                </div>
                <div className="p-4 max-w-xl mx-auto">
                <label className="block text-gray-700">Your ID</label>
                    <div className="w-full h-10 bg-gray-300 rounded mb-4 flex justify-between items-center"><div className="ml-2s px-2">10928301480237</div></div>


                    <label className="block text-gray-700">Username</label>
                    <div className="w-full h-10 bg-gray-300 rounded mb-4 flex justify-between items-center"><div className="ml-2s px-2">admin</div></div>

                    <label className="block text-gray-700">Position</label>
                    <div className="w-full h-10 bg-gray-300 rounded mb-4 flex justify-between items-center"><div className="ml-2s px-2">{user.position}</div></div>

                    <label className="block text-gray-700">Full name</label>
                    <input type="text" className="w-full border rounded p-2 mb-4" value={fullName} onChange={(e) => setFullName(e.target.value)}/>

                    <label className="block text-gray-700">Phone number</label>
                    <input type="text" className="w-full border rounded p-2 mb-4" value={phone} onChange={(e) => setPhone(e.target.value)}/>

                    <label className="block text-gray-700">Email</label>
                    <div className="w-full h-10 bg-gray-300 rounded mb-4 flex justify-between items-center"><div className="ml-2s px-2">admin@gmail.com</div></div>

                    <label className="block text-gray-700">Address</label>
                    <input type="text" className="w-full border rounded p-2 mb-4" value={address} onChange={(e) => setAddress(e.target.value)}/>

                    {/* <label className="block text-gray-700">Old Password</label>
                    <input type="password" className="w-full border rounded p-2 mb-4" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>

                    <label className="block text-gray-700">New Password</label>
                    <input type="password" className="w-full border rounded p-2 mb-4" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/> */}
                </div>
                <div className="flex justify-center mt-2 mb-5">
                    <button className="bg-blue-400 text-white text-2xl h-10 rounded-md px-2" onClick={() => handleSaveChanges()}>
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
}
export default AccountAdmin;