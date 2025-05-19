import { useState } from "react";
import { VscSearch, VscEdit, VscTrash } from "react-icons/vsc";
import { useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const ProductAdmin = () => {
  const [Products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectId, setSelectId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addItem, setAddItem] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
  });
  const [editingProduct, setEditingProduct] = useState({
    id: null,
    name: "",
    category: "",
    price: "",
    image: null,
    description: "",
  });

  useEffect(() => {
    // window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/menu`,
          {
            params: {
              _page: currentPage,
              _limit: 12,
              _sort: "price",
              _category: selectedCategory,
              _search: searchTerm,
              _order: sortOption,
            },
          }
        );
        setProducts(response.data.docs);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        setProducts([]);
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [searchTerm, selectedCategory, sortOption, currentPage, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  // Hàm mở form edit và điền dữ liệu sản phẩm vào form
  const handleEditClick = (product) => {
    console.log(product);
    setEditingProduct({
      id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description
    });
    setShowEdit(true);
  };

  // Hàm xử lý cập nhật sản phẩm
  const handleUpdateProduct = async () => {
    if (!editingProduct.name || !editingProduct.category || !editingProduct.price) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("name", editingProduct.name);
    formData.append("category", editingProduct.category);
    formData.append("price", editingProduct.price);
    formData.append("description", editingProduct.description);
    if (editingProduct.image) {
      formData.append("image", editingProduct.image);
    } // đây là File object

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/menu/${editingProduct.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.status === 200) {
        toast.success("Cập nhật sản phẩm thành công!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false
        });
        // Cập nhật danh sách sản phẩm nếu cần thiết
        setTimeout(() => {
          setLoading(true); // Trigger useEffect fetch lại
        }, 3000); // Trigger useEffect fetch lại
      }
    }
    catch (error) {
      console.error("Error updating product:", error);
    }
    // Reset form
    setEditingProduct({
      id: null,
      name: "",
      category: "",
      price: "",
      image: "",
      description: "",
    });
    setShowEdit(false);
  };

  // Hàm xử lý thay đổi dữ liệu trong form edit
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  const handleDeleteClick = (id) => {
    setSelectId(id);
    setShowConfirm(true);
  }

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/menu/${selectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        toast.success("Xóa sản phẩm thành công!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false
        });

        setTimeout(() => {
          setLoading(true); // Trigger useEffect fetch lại
        }, 3000); // Trigger useEffect fetch lại
      }
    }
    catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Xóa sản phẩm thất bại!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false
      });
    }
    setShowConfirm(false);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddItem = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.image) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("category", newProduct.category);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("image", newProduct.image); // đây là File object

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/menu`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 201) {
        toast.success("Thêm sản phẩm thành công!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false
        });
      }
      // Cập nhật danh sách sản phẩm nếu cần thiết bg-[#F8E9E7]
      setTimeout(() => {
        setLoading(true); // Trigger useEffect fetch lại
      }, 3000); // Trigger useEffect fetch lại
    } catch (error) {
      console.error("Error adding product:", error);
      if(error.response.status === 400) {
        toast.error("Sản phẩm đã tồn tại!", {
          position: "top-right",
          autoClose: 2000,})
      }
    }

    setAddItem(false);
    setNewProduct({
      name: "",
      category: "",
      price: "",
      image: "",
      description: "",
    });
  };


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="ml-80 w-full bg-gray-50 rounded-2xl p-6 shadow-sm relative flex flex-col min-h-screen">
      {addItem === true && (
        <div className="fixed inset-0 bg-white/50 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Add New Product</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddItem();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Category</label>
                  {/* <input
                    type="text"
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  /> */}
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="BIRTHDAY CAKE">BIRTHDAY CAKE</option>
                    <option value="COOKIE">COOKIE</option>
                    <option value="BREAD">BREAD</option>
                    <option value="PASTRY">PASTRY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Product Image</label>
                  <div className="flex items-center">
                    {newProduct.image && (
                      <img
                        src={URL.createObjectURL(newProduct.image)}
                        alt="Preview"
                        className="w-16 h-16 object-cover mr-2 rounded"
                      />
                    )}

                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setNewProduct({
                          ...newProduct,
                          image: file, // giữ nguyên là file object
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded h-24"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setAddItem(false);
                    setNewProduct({
                      name: "",
                      category: "",
                      price: "",
                      image: "",
                      description: "",
                    });
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {/* Title section */}
        <div className="order-1 md:order-none">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-500 text-sm md:text-base">Manage your bakery products</p>
        </div>

        {/* Search bar */}
        <div className="order-2 md:order-none w-full md:w-auto">
          <div className="relative">
            <VscSearch
              size={20}
              className="text-gray-600 absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <input
              type="search"
              placeholder="Search for preferred products"
              className="w-full md:w-64 placeholder-gray-500 h-10 pl-10 pr-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#A78A8A]"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Filters and Add Product button */}
        <div className="order-3 md:order-none w-full md:w-auto flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Category filter */}
          <div className="w-full md:w-auto">
            <label htmlFor="categoryFilter" className="sr-only">Filter by category</label>
            <select
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-40 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#A78A8A]"
            >
              <option value="ALL">All Categories</option>
              <option value="BIRTHDAY CAKE">Birthday Cake</option>
              <option value="COOKIE">Cookie</option>
              <option value="BREAD">Bread</option>
              <option value="PASTRY">Pastry</option>
            </select>
          </div>

          {/* Add Product button */}
          <button
            className="w-full md:w-auto bg-[#A78A8A] text-white font-medium py-2 px-6 rounded-md text-sm hover:bg-[#8a6d6d] focus:outline-none focus:ring-1 focus:ring-[#A78A8A] focus:ring-offset-1 transition-colors"
            onClick={() => setAddItem(true)}
          >
            <span className="flex items-center justify-center">
              Add Product
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white mb-6 ml-6 mr-6 shadow-md rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {Products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-300 rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              <img
                src={product.photo}
                alt={product.name}
                className="w-full h-54 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                <p className="text-gray-600 mt-1">{product.price} VND</p>
                <div className="mt-4 flex justify-center gap-4">
                  <button
                    onClick={() => handleDeleteClick(product._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <VscTrash size={24} />
                  </button>
                  {/* <button
                    onClick={() => handleEditClick(product)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <VscEdit size={24} />
                  </button> */}
                  <button 
                    onClick={() => handleEditClick(product)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                    title="Edit"
                  >
                    <FiEdit2 size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {Products.length === 0 && (
          <div className="text-center py-6 text-gray-500">No products found.</div>
        )}
        <div>
          <div className="flex justify-center items-center gap-1 mt-10 mb-10">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="flex items-center justify-center px-3 h-8 ms-0 text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
              </svg>
            </button>

            {/* Always show first page */}
            <button
              onClick={() => setCurrentPage(1)}
              className={`flex items-center justify-center px-3 h-8 leading-tight ${1 === currentPage
                ? "text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700"
                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"}`}
            >
              1
            </button>

            {/* Show ellipsis if current page is far from start */}
            {currentPage > 3 && (
              <span className="px-2">...</span>
            )}

            {/* Show pages around current page */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => page > 1 && page < totalPages && Math.abs(page - currentPage) <= 1)
              .map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight ${page === currentPage
                    ? "text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"}`}
                >
                  {page}
                </button>
              ))}

            {/* Show ellipsis if current page is far from end */}
            {currentPage < totalPages - 2 && (
              <span className="px-2">...</span>
            )}

            {/* Always show last page if there's more than 1 page */}
            {totalPages > 1 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`flex items-center justify-center px-3 h-8 leading-tight ${totalPages === currentPage
                  ? "text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"}`}
              >
                {totalPages}
              </button>
            )}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="flex items-center justify-center px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showConfirm === true && (
        <div className="fixed inset-0 bg-white/50 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-md mt-20 w-96 border border-gray-200 animate-slide-down">
            {/* Header */}
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Confirm deletion</h3>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 text-red-500 mt-0.5">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    This action will permanently delete the product. Are you sure?
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded border border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDelete()}
                className="px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showEdit === true && (
        <div className="fixed inset-0 bg-white/50 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Product</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateProduct();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editingProduct.name || ""}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Category</label>
                  {/* <input
                    type="text"
                    name="category"
                    value={editingProduct.category || ""}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  /> */}
                  <select
                    name="category"
                    value={editingProduct.category || ""}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="BIRTHDAY CAKE">BIRTHDAY CAKE</option>
                    <option value="COOKIE">COOKIE</option>
                    <option value="BREAD">BREAD</option>
                    <option value="PASTRY">PASTRY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={editingProduct.price || ""}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Product Image</label>
                  <div className="flex items-center">
                    {editingProduct.image && (
                      <img
                        src={URL.createObjectURL(editingProduct.image)}
                        alt="Preview"
                        className="w-16 h-16 object-cover mr-2 rounded"
                      />
                    )}

                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setEditingProduct({
                          ...editingProduct,
                          image: file, // giữ nguyên là file object
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={editingProduct.description || ""}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border border-gray-300 rounded h-24"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default ProductAdmin;