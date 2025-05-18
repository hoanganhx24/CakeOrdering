import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const OrderSuccess = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div>
<div className=' sticky z-10 top-0'>
        <Header />
        </div>
            <div className="bg-[url(../../public/bg-thanks.png)] bg-cover bg-center h-[500px] flex justify-center items-center flex-col mx-30 my-20">
                <div className="font-merienda text-5xl">Thank you for ordering!</div>
                <div className="text-2xl mt-10">Your order has been confirmed!</div>
                <div className="flex mt-20 gap-20 items-center">
                    <div className="border-2 px-6 py-3">
                        <Link to="/menu">Continue shopping</Link></div>
                    <div className="border-2 px-6 py-3">
                    <Link to={`/account/orderstatus`}>Check the status</Link></div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default OrderSuccess;