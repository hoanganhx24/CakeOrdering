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
        <div>
            <div className=' sticky z-10 top-0'>
                <Header />
            </div>
            <div className="flex justify-center items-center h-150 relative">
                <div className=" bg-gray-50 w-3/5 absolute top-0 flex h-3/4 shadow-2xl rounded-lg">
                    <img src={product.photo} alt="cake" className="w-3/8 mx-8 my-8" />
                    <div className="w-2/3 my-8 mr-8 flex flex-col relative">
                        <div className="text-3xl font-bold">{product.name}</div>
                        <div className="text-xl mt-4 font-bold">
                            Price: {product.price} VND
                        </div>
                        <div className="text-xl mt-4">
                            Soft, fluffy, and perfectly balanced in flavor, this treat offers a delightful sweetness with every bite. With a golden, slightly crisp exterior and a tender, airy interior, it melts in your mouth effortlessly. Made from the finest ingredients, it delivers rich taste and irresistible aroma.
                        </div>
                        <div className="text-xl mt-4">
                            <label htmlFor="quantity" className="text-xl font-bold">Quantity:</label>
                            <input type="number"
                                id="quantity"
                                min={1}
                                className="border-2 border-gray-400 ml-4 w-16 text-center focus:outline-gray-400"
                                defaultValue={1}
                                onChange={(e) => { setquantity(parseInt(e.target.value)) }} />
                        </div>
                        <div className="h-14 flex gap-30 absolute bottom-0">

                            <button
                                onClick={() => handleAddToCart(product._id, quantity)}
                                className='px-6 bg-[#F8E9E7] rounded-[8px] text-xl font-bold '>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer
            />
        </div>
    );
};
export default DetailProduct;