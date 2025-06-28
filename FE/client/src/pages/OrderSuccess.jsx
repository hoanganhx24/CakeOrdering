import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();

    const orderId = searchParams.get('vnp_OrderInfo');
    const paymentStatus = searchParams.get('vnp_ResponseCode');

    useEffect(() => {
        window.scrollTo(0, 0);

        const handlePaymentResponse = async () => {
            if (paymentStatus === '00') {
                const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/order/updateSPay`, {
                    idOrder: orderId,
                    paymentStatus: 1
                
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
            }
        }

        handlePaymentResponse();
    }, []);

    return (
        <div>
            <div className=' sticky z-10 top-0'>
                <Header />
            </div>
            <div className="bg-[url(../../public/bg-thanks.png)] bg-cover bg-center h-[500px] flex justify-center items-center flex-col mx-30 my-20">
                {searchParams.size < 1 ? (
                    <div className="items-center justify-center text-center">
                        <div className="font-merienda text-5xl">Thank you for ordering!</div>
                        <div className="text-2xl mt-10">Your order has been confirmed!</div>
                        {/* Các nút hành động */}
                        <div className="flex justify-between space-x-4 mt-20">
                            <Link
                                to="/menu/ALL"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Tiếp tục mua sắm
                            </Link>
                            <Link
                                to={`/account/orderstatus`}
                                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Theo dõi đơn hàng
                            </Link>
                        </div>
                    </div>
                ) : (
                    // Trường hợp có thông tin thanh toán
                    <div className="max-w-2xl mx-auto text-center py-12 px-4 sm:px-6 lg:px-8">
                        {/* Icon trạng thái */}
                        {searchParams.get('vnp_ResponseCode') === '00' ? (
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                                <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        ) : (
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                                <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        )}

                        {/* Tiêu đề */}
                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-4">
                            {searchParams.get('vnp_ResponseCode') === '00'
                                ? "Thanh toán thành công!"
                                : "Thanh toán thất bại!"}
                        </h2>

                        {/* Thông tin chi tiết */}
                        <div className={`p-6 rounded-lg mb-8 ${searchParams.get('vnp_ResponseCode') === '00' ? 'bg-green-50' : 'bg-red-50'}`}>
                            {searchParams.get('vnp_ResponseCode') === '00' ? (
                                <>
                                    <p className="text-lg text-green-700 mb-2">Cảm ơn bạn đã đặt hàng!</p>
                                    <p className="text-gray-600">Mã đơn hàng: {searchParams.get('vnp_TxnRef')}</p>
                                    <p className="text-gray-600">Số tiền: {(parseInt(searchParams.get('vnp_Amount')) / 100).toLocaleString()} VND</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-lg text-red-700 mb-2">Mã lỗi: {searchParams.get('vnp_ResponseCode')}</p>
                                    <p className="text-gray-600">Vui lòng thanh toán lại</p>
                                    <p className="text-gray-600 mt-2">Nếu bạn muốn thay đổi hình thức thanh toán hãy liên hệ với chúng tôi ngay!</p>
                                </>
                            )}
                        </div>

                        {/* Các nút hành động */}
                        <div className="flex justify-center space-x-4">
                            <Link
                                to="/menu/ALL"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Tiếp tục mua sắm
                            </Link>


                            <Link
                                to={`/account/orderstatus`}
                                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Theo dõi đơn hàng
                            </Link>

                            {/* {searchParams.get('vnp_ResponseCode') !== '00' && (
                                <Link
                                    to="/cart"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                                >
                                    Thử thanh toán lại
                                </Link>
                            )} */}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
export default OrderSuccess;