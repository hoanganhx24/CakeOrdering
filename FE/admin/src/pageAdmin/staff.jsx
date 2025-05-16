import { useState } from "react";
import { VscSearch } from "react-icons/vsc";
const Staff = () => {
    // const [users, setuser] = useState(staffs);
    // const [showConfirm, setShowConfirm] = useState(false);
    // const [selectId, setSelectId] = useState(null);

    // const handleDeleteClick = (id, position) =>{
    //     if(position !== "Manager"){
    //         setSelectId(id);
    //         setShowConfirm(true);
    //     }
    // }

    // const handleConfirmDelete = () =>{
    //     setuser(users.filter(user => user.id != selectId));
    //     setShowConfirm(false);
    // }

    return (
        <div className="w-4/5 bg-[#F8E9E7] h-150 rounded-2xl relative">
            {/* <div className=" border-3 bg-white border-black absolute flex items-center mt-8 left-6 right-6">
                <VscSearch size={20} className="text-gray-600 ml-3" />
                <input type="search" placeholder="Search for preferred products" className="placeholder-gray-500 h-10 outline-none ml-6 mr-6"
                />
            </div>
            <div className=" absolute bg-white top-25 bottom-6 left-6 right-6 ">
                <table className="min-w-full border-b-2 border-gray-300">
                    <thead>
                        <tr className="bg-[#A78A8A] text-2xl text-white">
                            <th className=" p-4 font-normal">No</th>
                            <th className=" p-4 font-normal">Name</th>
                            <th className=" p-4 font-normal">Phone Number</th>
                            <th className=" p-4 font-normal">Email</th>
                            <th className=" p-4 font-normal">Position</th>
                            <th className=" p-4 font-normal">Action</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {users.map((staff, index) => (
                            <tr className="border-b-2 border-gray-300" key={staff.id}>
                                <td className=" p-2 text-center">{staff.id}</td>
                                <td className=" p-2 text-center">
                                    <div className="border-2 border-[#A78A8A] h-10 text-center flex justify-center flex-col">{staff.name}</div></td>
                                <td className=" p-2 text-center flex items-center justify-center"><div className="border-2 border-[#A78A8A] h-10 text-center flex justify-center flex-col w-2/3">{staff.phoneNumber}</div></td>
                                <td className=" p-2 text-center"><div className="border-2 border-[#A78A8A] h-10 text-center flex justify-center flex-col">{staff.email}</div></td>
                                <td className=" p-2 text-center items-center flex justify-center"><div className="border-2 border-[#A78A8A] h-10 text-center flex justify-center flex-col w-2/3">{staff.position}</div></td>
                                <td className=" p-2 text-center">
                                    <button className="w-24 h-10  bg-red-800 text-white rounded-md"
                                        onClick={() => handleDeleteClick(staff.id, staff.position)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center items-center mb-5">
                    <button className=" text-2xl font-bold hover:text-red-600"> &lt;&lt; </button>
                    <div className=" text-2xl m-5">1</div>
                    <button className=" text-2xl font-bold hover:text-red-600"> &gt;&gt; </button>
                </div>
            </div>
            {showConfirm === true && (
                <div className=" fixed top-5 left-10 h-50 right-10 flex justify-center items-center">
                    <div className="flex flex-col bg-white shadow-2xl h-44 items-center">
                        <div className="mx-4 mt-10 text-xl w-72 text-center">
                            Are you sure you want to delete your account ?
                        </div>
                        <div className=" flex mt-4 gap-10">
                            <button className=" border-2 p-2 w-16 bg-green-600 text-white" onClick={() =>handleConfirmDelete()}>YES</button>
                            <button className=" border-2 p-2 w-16 bg-red-700 text-white" onClick={() => setShowConfirm(false)}>NO</button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
}
export default Staff;