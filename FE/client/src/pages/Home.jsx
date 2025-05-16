import Footer from '../components/Footer';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
const Home = () => {
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    if (!user && !loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <div className='text-2xl font-merienda'>
                    Loading....
                </div>
            </div>
        )
    }
    return (
        <div>
            <div className=' sticky z-10 top-0'>
                <Header />
            </div>
            {/* <Header /> */}
            {/* banner */}
            <div className='mb-20'>
                <div className='relative w-full bg-[url(../../public/banner.png)] bg-cover bg-center h-[680px]'>
                    <div className='absolute left-1/3 top-1/4 right-1/3'>
                        <div className='absolute '>
                            <h3 className='text-3xl font-mandali text-white py-8'>A delicious variety of sweet and savory pastries and donuts, freshly baked every day.</h3>
                            <Link to="/menu/ALL" className='border-2 px-6 py-3 text-white
                            '>More Products</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className='text-center text-4xl font-merienda mt-10 mb-30'>
                Our Products
            </div>

            {/* Your Products */}
            <div className='mx-60 flex flex-col h-500 justify-between mb-8'>
                <div className='flex justify-around'>
                    <img src='../../public/Pastry.png' alt='Pastry' className='w-2/5' />
                    <div className='flex flex-col'>
                        <div className='text-3xl font-merienda text-black mt-10'>
                            Pastry
                        </div>
                        <div className='text-black mt-10 font-merienda'>
                            Discover the art of cake-making with our stunning and delicious creations, crafted to perfection for any occasion. From birthdays to weddings, our cakes are masterpieces of flavor and design, tailored to your unique preferences. Using only premium ingredients, we ensure each cake is as delightful to taste as it is to behold. Make your celebrations truly extraordinary with our signature cakes, where elegance and taste come together in perfect harmony.
                        </div>
                        {/* <button className='px-6 py-3 bg-[#F8E9E7] rounded-[8px] text-xl font-merienda mt-10 w-1/4'>
                            <Link to="/menu/pastry">Order Now</Link>
                        </button> */}

                        <button className="relative border-2 border-[#F8E9E7] px-6 py-3 bg-white text-black rounded-[8px] text-xl font-merienda mt-10 w-1/4
                        overflow-hidden transition-all duration-500 before:absolute before:left-0 before:top-0 before:h-full before:w-0
                        before:bg-[#F8E9E7] before:transition-all before:duration-500 hover:before:w-full hover:text-black">
                            <Link to="/menu/PASTRY" className="relative z-10">Order Now</Link>
                        </button>

                    </div>
                </div>
                {/* Cookies */}
                <div className='flex justify-around'>
                    <div className='flex flex-col'>
                        <div className='text-3xl font-merienda text-black mt-10'>
                            Cookies
                        </div>
                        <div className='text-black mt-10 font-merienda'>
                            Indulge in the irresistible charm of our freshly baked cookies, crafted with love and the finest ingredients. Each bite delivers a perfect balance of crunch and gooeyness, loaded with decadent chocolate chips that melt in your mouth. Ideal for gifting, snacking, or pairing with your favorite beverage, our cookies are a treat for all occasions. Experience the joy of premium flavors and exceptional quality with every bite.
                        </div>
                        <button className="relative border-2 border-[#F8E9E7] px-6 py-3 bg-white text-black rounded-[8px] text-xl font-merienda mt-10 w-1/4
                        overflow-hidden transition-all duration-500 before:absolute before:left-0 before:top-0 before:h-full before:w-0
                        before:bg-[#F8E9E7] before:transition-all before:duration-500 hover:before:w-full hover:text-black">
                            <Link to="/menu/COOKIE" className="relative z-10">Order Now</Link>
                        </button>

                    </div>
                    <img src='../../public/Cookie.png' alt='Cookies' className='w-2/5' />
                </div>
                {/* Bread */}
                <div className='flex justify-around'>
                    <img src='../../public/Bread.png' alt='Pastry' className='w-2/5' />
                    <div className='flex flex-col'>
                        <div className='text-3xl font-merienda text-black mt-10'>
                            Bread
                        </div>
                        <div className='text-black mt-10 font-merienda'>
                            Experience the warmth of freshly baked bread, made with care and the finest ingredients. From soft and fluffy loaves to crusty artisan delights, our bread is crafted to perfection for every meal. Whether paired with butter, used for sandwiches, or enjoyed on its own, each bite offers a taste of homemade goodness. Elevate your daily dining with our fresh, flavorful, and wholesome bread!
                        </div>
                        <button className="relative border-2 border-[#F8E9E7] px-6 py-3 bg-white text-black rounded-[8px] text-xl font-merienda mt-10 w-1/4
                        overflow-hidden transition-all duration-500 before:absolute before:left-0 before:top-0 before:h-full before:w-0
                        before:bg-[#F8E9E7] before:transition-all before:duration-500 hover:before:w-full hover:text-black">
                            <Link to="/menu/BREAD" className=' relative z-10'>Order Now</Link>
                        </button>

                    </div>
                </div>
                {/* BirthDay Cake */}
                <div className='flex justify-around'>
                    <div className='flex flex-col'>
                        <div className='text-3xl font-merienda text-black mt-10'>
                            Birthday Cake
                        </div>
                        <div className='text-black mt-10 font-merienda'>
                            Celebrate life’s special moments with our beautifully crafted birthday cakes, designed to bring joy and sweetness to your celebrations. Whether you prefer classic flavors or custom creations, each cake is made with love and the finest ingredients. From vibrant decorations to rich, moist layers, our birthday cakes are as delightful to look at as they are to taste. Make every birthday unforgettable with a cake that’s as unique as you are!
                        </div>
                        <button className="relative border-2 border-[#F8E9E7] px-6 py-3 bg-white text-black rounded-[8px] text-xl font-merienda mt-10 w-1/4
                        overflow-hidden transition-all duration-500 before:absolute before:left-0 before:top-0 before:h-full before:w-0
                        before:bg-[#F8E9E7] before:transition-all before:duration-500 hover:before:w-full hover:text-black">
                            <Link to="/menu/BIRTHDAY CAKE" className=' relative z-10'>Order Now</Link>
                        </button>

                    </div>
                    <img src='../../public/BirthdayCake.png' alt='Pastry' className='w-2/5' />
                </div>
            </div>
            {/* About Us */}
            <div className='relative'>
                <img src="../../public/AboutUs.png" alt="" />
                <div className=' absolute top-10 right-20 flex flex-col justify-center items-center left-200'>
                    <div className='text-4xl font-merienda mt-10'>
                        About Us
                    </div>
                    <div className='font-merienda mt-10'>
                        At HP Cakes, we turn sweet dreams into reality! Specializing in beautifully crafted cakes for birthdays, weddings, and all occasions, we blend creativity with premium ingredients to deliver unforgettable flavors and designs. Our passionate team ensures every cake is a masterpiece, tailored to your unique vision. Celebrate life’s special moments with HP Cakes, where elegance meets indulgence!
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default Home;