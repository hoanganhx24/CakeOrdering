import Footer from '../components/Footer';
import Header from '../components/Header';
import { useEffect } from 'react';

const Contact = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div>
            <div className=' sticky z-10 top-0'>
                <Header />
            </div>
            <div className='mt-10 text-center mb-10 flex justify-evenly gap-20'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='text-4xl mb-8'>
                        CONTACT US
                    </div>
                    <div className='text-2xl'>
                        D/c: Km10, Đường Nguyễn Trãi, Q. Hà Đông, Hà Nội.
                    </div>
                    <div className='text-2xl'>
                        Hotline: 0977648291.
                    </div>
                    <div className='text-2xl'>
                        Email: supportHPCake@gmail.com
                    </div>
                    <div className='text-2xl'>
                        Fanpage: HoangPham Cake
                    </div>
                </div>
                <div>
                    <img src="../../public/chef.png" alt="chef" />
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default Contact;