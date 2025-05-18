import Footer from '../components/Footer';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize AOS for scroll animations
        AOS.init({ duration: 1000, once: true });

        // Simulate loading state
        //const timer = setTimeout(() => setLoading(false), 1000);

        // Handle scroll for header visibility
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

            setPrevScrollPos(currentScrollPos);
            setVisible(isVisible);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            
        };
    }, [prevScrollPos]);

    if (!user && !loading) {
        return (
            <div className='flex justify-center items-center h-screen bg-gradient-to-br from-amber-100 to-rose-100'>
                <div className='text-3xl font-merienda text-[#5D4037] animate-pulse'>
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header with smooth scroll effect */}
            <div className={`fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-lg transition-all duration-500 z-50 ${visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                <Header />
            </div>

            {/* Banner Section */}
            <div className='mb-20'>
                <div className='relative w-full bg-[url(../../public/banner.png)] bg-cover bg-center h-[680px]'>
                    <div className='absolute left-1/3 top-1/4 right-1/3'>
                        <div className='absolute '>
                            <h3 className='text-3xl font-mandali text-white py-8  md:text-3xl font-mandali leading-tight drop-shadow-lg animate-fade-in' data-aos="fade-up">A delicious variety of sweet and savory pastries and donuts, freshly baked every day.</h3>
                            <Link
                                to="/menu/ALL"
                                className='inline-block px-8 py-4 text-lg font-merienda text-white rounded-full hover:border-orange-900 hover:scale-105 transition-all duration-300 shadow-lg border-2 border-white'
                                data-aos="fade-up"
                                data-aos-delay="200"
                            >
                                Explore Products
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Artisan Creations Title */}
            <h2
                className='text-5xl font-merienda text-center mb-20 text-[#5D4037] relative'
                data-aos="zoom-in"
            >
                Our Artisan Creations
            </h2>

            {/* Products Section */}
            <div className='container mx-auto px-4 md:px-8 lg:px-16 py-16 flex flex-col space-y-24'>
                {/* Pastry Section */}
                <div className='relative group max-w-5xl mx-auto' data-aos="fade-right"
                data-aos-once="false">
                    <div className='flex flex-col md:flex-row items-center gap-8 p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-amber-200/50 hover:-translate-y-2'>
                        <div className='w-full md:w-2/5 overflow-hidden rounded-2xl'>
                            <img
                                src='../../public/Pastry.png'
                                alt='Pastry'
                                className='w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1'
                            />
                        </div>
                        <div className='w-full md:w-3/5 flex flex-col space-y-6'>
                            <h2 className='text-4xl font-merienda text-[#5D4037] bg-clip-text bg-gradient-to-r from-amber-700 to-amber-500'>
                                Pastry
                            </h2>
                            <p className='text-gray-700 font-merienda leading-relaxed'>
                                Discover the art of pastry-making with our exquisite creations, crafted for any occasion. From birthdays to weddings, our pastries are masterpieces of flavor and design, made with premium ingredients to ensure every bite is a delight.
                            </p>
                            <Link
                                to="/menu/PASTRY"
                                className=' w-50 inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full text-white font-merienda text-lg hover:bg-gradient-to-r hover:from-amber-700 hover:to-amber-500 hover:scale-105 transition-all duration-300 shadow-md'
                            >
                                Order Now
                                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Cookies Section */}
                <div className='relative group max-w-5xl mx-auto' data-aos="fade-left"
                data-aos-once="false">
                    <div className='flex flex-col-reverse md:flex-row items-center gap-8 p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-amber-200/50 hover:-translate-y-2'>
                        <div className='w-full md:w-3/5 flex flex-col space-y-6'>
                            <h2 className='text-4xl font-merienda text-[#5D4037] bg-clip-text bg-gelato-to-r from-amber-700 to-amber-500'>
                                Cookies
                            </h2>
                            <p className='text-gray-700 font-merienda leading-relaxed'>
                                Indulge in our freshly baked cookies, crafted with love and premium ingredients. Each bite offers a perfect balance of crunch and gooeyness, loaded with decadent chocolate chips that melt in your mouth.
                            </p>
                            <Link
                                to="/menu/COOKIE"
                                className='w-50 inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full text-white font-merienda text-lg hover:bg-gradient-to-r hover:from-amber-700 hover:to-amber-500 hover:scale-105 transition-all duration-300 shadow-md'
                            >
                                Order Now
                                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </Link>
                        </div>
                        <div className='w-full md:w-2/5 overflow-hidden rounded-2xl'>
                            <img
                                src='../../public/Cookie.png'
                                alt='Cookies'
                                className='w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-1'
                            />
                        </div>
                    </div>
                </div>

                {/* Bread Section */}
                <div className='relative group max-w-5xl mx-auto' data-aos="fade-right"
                data-aos-once="false">
                    <div className='flex flex-col md:flex-row items-center gap-8 p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-amber-200/50 hover:-translate-y-2'>
                        <div className='w-full md:w-2/5 overflow-hidden rounded-2xl'>
                            <img
                                src='../../public/Bread.png'
                                alt='Bread'
                                className='w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1'
                            />
                        </div>
                        <div className='w-full md:w-3/5 flex flex-col space-y-6'>
                            <h2 className='text-4xl font-merienda text-[#5D4037] bg-clip-text bg-gradient-to-r from-amber-700 to-amber-500'>
                                Bread
                            </h2>
                            <p className='text-gray-700 font-merienda leading-relaxed'>
                                Experience the warmth of freshly baked bread, crafted with care and the finest ingredients. From soft loaves to crusty artisan delights, our bread is perfect for any meal, offering a taste of homemade goodness.
                            </p>
                            <Link
                                to="/menu/BREAD"
                                className='w-50 inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full text-white font-merienda text-lg hover:bg-gradient-to-r hover:from-amber-700 hover:to-amber-500 hover:scale-105 transition-all duration-300 shadow-md'
                            >
                                Order Now
                                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Birthday Cake Section */}
                <div className='relative group max-w-5xl mx-auto' data-aos="fade-left"
                data-aos-once="false">
                    <div className='flex flex-col-reverse md:flex-row items-center gap-8 p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-amber-200/50 hover:-translate-y-2'>
                        <div className='w-full md:w-3/5 flex flex-col space-y-6'>
                            <h2 className='text-4xl font-merienda text-[#5D4037] bg-clip-text bg-gradient-to-r from-amber-700 to-amber-500'>
                                Birthday Cake
                            </h2>
                            <p className='text-gray-700 font-merienda leading-relaxed'>
                                Celebrate life's special moments with our beautifully crafted birthday cakes, designed to bring joy and sweetness. Made with love and premium ingredients, each cake is a unique masterpiece.
                            </p>
                            <Link
                                to="/menu/BIRTHDAY CAKE"
                                className='w-50 inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full text-white font-merienda text-lg hover:bg-gradient-to-r hover:from-amber-700 hover:to-amber-500 hover:scale-105 transition-all duration-300 shadow-md'
                            >
                                Order Now
                                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </Link>
                        </div>
                        <div className='w-full md:w-2/5 overflow-hidden rounded-2xl'>
                            <img
                                src='../../public/BirthdayCake.png'
                                alt='Birthday Cake'
                                className='w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-1'
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* About Us Section */}

            <Footer />
        </div>
    );
};

export default Home;