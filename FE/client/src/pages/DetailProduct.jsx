import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
//import { products } from "../demo/products.js"
import { useCart } from "../context/CartContext.jsx";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const DetailProduct = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    // const { addToCart } = useCart();
    const [quantity, setquantity] = useState(1);
    const { id } = useParams();
    const [product, setProduct] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/menu/${id}`);
                console.log(response.data);
                setProduct(response.data);
            }
            catch (error) {
                console.error("Error fetching product:", error);
                setProduct(null);
                return <h1 className="text-center text-xl font-bold mt-10">Product Not Found</h1>;
            }
        }
        fetchProduct();
    }, [id]);

    console.log(token);

    const handleAddToCart = async (idProduct, quantity) => {
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/${idProduct}`,
                    {
                        qty: quantity
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                console.log(response.data);
                if (response.status === 201) {
                    toast.success("Add to cart successfully", {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }
            }
            catch (error) {
                console.error("Error adding to cart:", error);
                alert("Error adding to cart");
            }
        }
    }

    console.log(product);
    // const product = products.find((p) => p.id === parseInt(id));
    // if (!product) {
    //     return <h1 className="text-center text-xl font-bold mt-10">Product Not Found</h1>;
    // }
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky z-10 top-0 bg-white shadow-sm">
                <Header />
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {/* Product Section */}
                <section className="container mx-auto px-4 py-12">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto">
                        <div className="md:flex">
                            {/* Product Image */}
                            <div className="md:w-2/5 p-6 flex items-center justify-center bg-gray-50">
                                <img
                                    src={product.photo}
                                    alt={product.name}
                                    className="w-full h-auto max-h-96 object-contain"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="md:w-3/5 p-8">
                                <h1 className="text-3xl font-semibold text-gray-900 mb-4">{product.name}</h1>
                                <p className="text-2xl font-bold text-[#A78A8A] mb-6">{product.price} VND</p>

                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    Soft, fluffy, and perfectly balanced in flavor, this treat offers a delightful sweetness with every bite.
                                    With a golden, slightly crisp exterior and a tender, airy interior, it melts in your mouth effortlessly.
                                </p>

                                <div className="flex items-center mb-8">
                                    <label htmlFor="quantity" className="text-gray-700 font-medium mr-4">Quantity:</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        min={1}
                                        className="border border-gray-300 rounded px-3 py-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-[#A78A8A]"
                                        defaultValue={1}
                                        onChange={(e) => setquantity(parseInt(e.target.value))}
                                    />
                                </div>

                                <button
                                    onClick={() => handleAddToCart(product._id, quantity)}
                                    className="px-8 py-3 bg-[#A78A8A] text-white font-medium rounded-lg hover:bg-[#A78A8A]/30 hover:text-black transition-colors"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Similar Products */}
                {/* <section className="container mx-auto px-4 pb-16">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8">Similar Products</h2>

                </section> */}
            </main>

            {/* Footer */}
            <footer className="bg-gray-50">
                <Footer />
            </footer>

            <ToastContainer />
        </div>
    );
};
export default DetailProduct;