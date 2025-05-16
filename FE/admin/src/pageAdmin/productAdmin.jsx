import { useState } from "react";
import { VscSearch, VscEdit, VscTrash } from "react-icons/vsc";
import { useEffect } from "react";
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
    image: "",
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
    setEditingProduct({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.photo,
      description: product.description
    });
    setShowEdit(true);
  };

  // Hàm xử lý cập nhật sản phẩm
  const handleUpdateProduct = () => {
    if (!editingProduct.name || !editingProduct.category || !editingProduct.price || !editingProduct.image) {
      alert("Please fill in all required fields!");
      return;
    }

    setProducts(Products.map(product =>
      product.id === editingProduct.id ? editingProduct : product
    ));
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

  const handleConfirmDelete = () => {
    setProducts(Products.filter(product => product.id !== selectId));
    setShowConfirm(false);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddItem = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.image) {
      alert("Please fill in all required fields!");
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

      // Cập nhật danh sách sản phẩm nếu cần thiết bg-[#F8E9E7]
      setLoading(true); // Trigger useEffect fetch lại
    } catch (error) {
      console.error("Error adding product:", error);
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
      <div className="mt-8 ml-6 mr-6">

        <div className="border-3 bg-white border-black flex items-center mb-8">
          <VscSearch size={20} className="text-gray-600 ml-3" />
          <input
            type="search"
            placeholder="Search for preferred products"
            className="placeholder-gray-500 h-10 outline-none ml-4 w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <button
              className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl font-medium py-3 px-8 mb-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-600 hover:to-blue-700 active:scale-95 active:shadow-inner transform-gpu"
              onClick={() => setAddItem(true)}
            >
              <span className="relative z-10 flex items-center justify-center">
                Add more products
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
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
          <div className="relative w-full max-w-xs mb-8">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block appearance-none w-full bg-white border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 rounded-lg px-4 py-3 pr-8 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm"
            >
              <option
                className="py-2 text-lg hover:bg-blue-100"
                value="ALL"
              >
                ALL
              </option>
              <option
                className="py-2 text-lg hover:bg-blue-100"
                value="BIRTHDAY CAKE"
              >
                BIRTHDAY CAKE
              </option>
              <option
                className="py-2 text-lg hover:bg-blue-100"
                value="COOKIE"
              >
                COOKIE
              </option>
              <option
                className="py-2 text-lg hover:bg-blue-100"
                value="BREAD"
              >
                BREAD
              </option>
              <option
                className="py-2 text-lg hover:bg-blue-100"
                value="PASTRY"
              >
                PASTRY
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
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
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                <p className="text-gray-600 mt-1">${product.price}</p>
                <div className="mt-4 flex justify-center gap-4">
                  <button
                    onClick={() => handleDeleteClick(product.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <VscTrash size={24} />
                  </button>
                  <button
                    onClick={() => handleEditClick(product)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <VscEdit size={24} />
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
        <div className="fixed top-5 left-10 h-50 right-10 flex justify-center items-center">
          <div className="flex flex-col bg-white shadow-2xl h-44 items-center">
            <div className="mx-4 mt-10 text-xl w-72 text-center">
              Are you sure you want to delete this product?
            </div>
            <div className="flex mt-4 gap-10">
              <button
                className="border-2 p-2 w-16 bg-green-600 text-white"
                onClick={() => handleConfirmDelete()}
              >
                YES
              </button>
              <button
                className="border-2 p-2 w-16 bg-red-700 text-white"
                onClick={() => setShowConfirm(false)}
              >
                NO
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
                        src={editingProduct.image}
                        alt="Preview"
                        className="w-16 h-16 object-cover mr-2 rounded"
                      />
                    )}
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditingProduct({
                              ...editingProduct,
                              image: reader.result,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded"
                      accept="image/*"
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
    </div>
  );
}

export default ProductAdmin;