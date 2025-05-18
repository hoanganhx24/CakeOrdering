import { useState } from "react";
import { VscSearch } from "react-icons/vsc";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { IoNewspaperOutline, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Customer = () => {
    const [users, setUsers] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectId, setSelectId] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [pagingCounter, setPagingCounter] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
                    params: {
                        _page: page,
                        _limit: limit,
                        _search: searchTerm,
                        _role: "customer"
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                console.log(response.data);
                console.log(response.status);
                if (response.status === 200) {
                    setUsers(response.data.docs);
                    setTotalPages(response.data.totalDocs);
                    setHasPrevPage(response.data.hasPrevPage);
                    setHasNextPage(response.data.hasNextPage);
                    setPagingCounter(response.data.pagingCounter);
                } else {
                    setUsers([]);
                    setTotalPages(0);
                }
            }
            catch (error) {
                if (error.status === 404){
                    setUsers([]);
                    setTotalPages(0);
                }
            }
        }
        fetchUsers();
    }, [page, limit, searchTerm, loading]);

    const handleDeleteClick = (id) => {
        setSelectId(id);
        setShowConfirm(true);
    }

    const handleConfirmDelete = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/${selectId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.status === 200) {
                toast.success("Đã xóa tài khoản thành công", {
                    autoClose:3000
                });
                setTimeout(() => {
                    setPage(1);
                }
                , 4000); 
            }
        }
        catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user");
        }
        finally {
            setSelectId(null);
        setShowConfirm(false);
        }
    }

    // const filteredUsers = users.filter(user =>
    //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     user.phoneNumber.includes(searchTerm)
    // );


    return (
        <div className="ml-80 w-full bg-gray-50 rounded-2xl p-6 shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
                    <p className="text-gray-500">View and manage customer accounts</p>
                </div>
                <div className="relative">
                    <VscSearch size={20} className="text-gray-600 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="search"
                        placeholder="Search customers..."
                        className="placeholder-gray-500 h-10 pl-10 pr-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#A78A8A] w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#F8E9E7]">
                            <tr>
                                {/* <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">ID</th> */}
                                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">Username</th>
                                {/* <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">Password</th> */}
                                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.id}
                                    </td> */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        {user.username}
                                    </td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        0926325371
                                    </td> */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium items-cente">
                                        <div className="flex justify-center space-x-2 items-center">
                                            {/* <button className="text-[#A78A8A] hover:text-[#8a6e6e] p-1 rounded">
                                                <FiEdit2 size={18} />
                                            </button> */}
                                            <button
                                                className="text-red-600 hover:text-red-800 p-1 rounded"
                                                onClick={() => handleDeleteClick(user._id)}
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.length > 0 ? (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium">{pagingCounter}</span> to{' '}
                            <span className="font-medium">{pagingCounter + limit - 1}</span> of{' '}
                            <span className="font-medium">{totalPages}</span> customers
                        </div>
                        <div className="flex space-x-2">
                            <button
                                className="p-2 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
                                onClick={() => setPage(page - 1)}
                                disabled={!hasPrevPage}
                            >
                                <IoChevronBack />
                            </button>
                            <button className="px-4 py-2 rounded-md bg-[#A78A8A] text-white font-medium">
                                {page}
                            </button>
                            <button
                                className="p-2 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
                                onClick={() => setPage(page + 1)}
                                disabled={!hasNextPage}
                            >
                                <IoChevronForward />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No customers found. Try adjusting your search.
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-white/50 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this customer account? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                onClick={handleConfirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        <ToastContainer />
        </div>

    );
}

export default Customer;