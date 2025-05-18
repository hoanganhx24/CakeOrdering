import { useState } from "react";
import { VscSearch } from "react-icons/vsc";
import { Link, Meta } from "react-router-dom";
import Footer from "../components/Footer"
import Header from "../components/Header"
// import {products} from "../demo/products.js"
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import AOS from 'aos';
import 'aos/dist/aos.css';


const categories = ["ALL", "BIRTHDAY CAKE", "COOKIE", "BREAD", "PASTRY"];

const Menu = () => {
    const { section } = useParams();
    const [selectedCategory, setSelectedCategory] = useState(section);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);


    useEffect(() => {
        window.scrollTo(0, 0);
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
                
            } catch (error) {
                setProducts([]);
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [searchTerm, selectedCategory, sortOption, currentPage]);
    useEffect(() => {
        setSelectedCategory(section);
    }, [section]);

    console.log(products);
    //console.log(sortOption)
    // const filteredByCategory = 
    //     section === "all" ? products : products.filter((product) => product.category.toLowerCase().replace(/\s+/g, '') === section);

    // const handlSelectCategory = (category) => {
    //     navigate(`/menu/${category}`)
    // }
    // const handleSearchChange = (e) => {
    //     setSearchTerm(e.target.value);
    // };


    // const filteredProducts = filteredByCategory.filter((product) => 
    //     product.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    return (
        <div>
            <div className=' sticky z-10 top-0'>
                <Header />
            </div>
            <div className="flex justify-center items-center ">
                <div className="flex flex-col items-center mx-40 mt-16 mb-16">
                    <div className="text-4xl text-gray-600 mb-10">
                        Joy baked into every bite
                    </div>
                    <div className="text-2xl text-gray-600 items-center text-center">
                        Enjoy a delightful selection of freshly baked birthday cakes, breads, cookies, and cakes, made with the finest ingredients and crafted to perfection every day.
                    </div>

                    {/* Search */}
                    <div className="w-full max-w-4xl relative mt-16 group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <VscSearch size={24} className="text-gray-500 group-hover:text-gray-700 transition-colors" />
                        </div>
                        <input
                            type="search"
                            placeholder="Search for preferred products..."
                            className="block w-full h-14 pl-14 pr-6 text-lg rounded-xl border-2 border-gray-300 bg-white shadow-sm hover:border-[#F16464] focus:border-[#F16464] focus:ring-2 focus:ring-[#F8E9E7] outline-none transition-all duration-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    

                    <div className="flex relative w-full justify-center items-center">
                        {/* Tag */}
                        <div className="flex gap-6 mt-20 text-gray-400 text-xl ">
                            {categories.map((category, index) => {
                                return (
                                    <button
                                        key={category}
                                        className={`border-2 border-gray-400 rounded-md px-4 py-2 hover:bg-[#F8E9E7] hover:text-black ${selectedCategory === category ? "bg-[#F8E9E7] text-black" : ""}`}
                                        onClick={() => {
                                            AOS.refresh()
                                            setSelectedCategory(category);
                                            navigate(`/menu/${category}`);
                                        }}
                                    >
                                        {category}
                                    </button>
                                );
                            })}
                        </div>
                        {/* Sort */}
                        <div className="flex gap-6 mt-20 justify-center items-center absolute right-8">
                            {/* <div className=" text-2xl ">Sap xep theo:</div> */}
                            <select className=" rounded-md h-10 w-40 bg-white border-2 border-gray-200 text-gray-600 text-lg font-medium focus:border-[#F16464] focus:outline-none focus:ring-2 focus:ring-[#F8E9E7] transition-all duration-300 hover:border-gray-300" onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
                                <option value="">Default sorting</option>
                                <option value="asc">Price: Low to High</option>
                                <option value="desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="grid grid-cols-4 gap-10 mt-20 p-10 rounded-lg">
                        {products.map((product, index) => {
                            return (
                                <Link to={`/detail/${product._id}`} key={product._id}>
                                    <div className="flex flex-col bg-[#F8E9E7] rounded-lg hover:scale-105 hover:bg-[#F16464]/30 transition-all duration-300 ease-in-out"
                                        data-aos="fade-up"
                                        data-aos-duration="800"
                                        data-aos-once="false"
                                    >
                                        <img src={product.photo} alt={product.name} className="mx-4 my-4 w-[243px] h-[247px]" />
                                        <div className="text-xl mt-4 mx-4">
                                            {product.name}
                                        </div>
                                        <div className="text-xl font-bold mt-2 mx-4 mb-4">
                                            {product.price.toLocaleString()} VND
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

            </div>
            {/* Pagination */}


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

                <Footer />
            </div>
        </div>
    );
}
export default Menu;

