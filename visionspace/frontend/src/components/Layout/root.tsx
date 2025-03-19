import Navbar from 'components/Navbar/navbar';
import Sidebar from 'components/Sidebar/sidebar';
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

export default function Layout() {
    return (
        <main className="relative w-screen h-screen">
            <div className="flex">
                <Sidebar />
                <section className="flex h-screen flex-1 flex-col overflow-visible">
                    <Navbar />
                    <div className={`w-full h-full px-4 pt-4 pb-6 max-md:pb-10 sm:px-10 overflow-hidden max-lg:overflow-auto`}>
                        <Outlet />
                    </div>
                </section>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                draggable
                pauseOnHover
                theme="dark"
            />
        </main>
    )
}