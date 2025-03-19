import Loader from "components/Loader/loader";
import { useAuth } from "hooks/useAuth";
import { useState } from "react";


const Profile = () => {
    const { user, loading } = useAuth();
    const [currentPage, setCurrentPage] = useState(0);

    const pages = [
        // Страница профиля
        <>
            <div className="flex flex-row justify-left items-center gap-2">
                <h1 className="font-bold text-[30px]">{user?.firstname} {user?.lastname}</h1>
            </div>
            <div className="flex flex-col gap-2 mt-4 text-[20px]">
                <span>Идентификационный номер: {user?.id}</span>
                <span>Почта: {user?.email}</span>
            </div>
        </>,
        // Страница Безопасности
        <>
            <div className="flex flex-row justify-left items-center gap-2">
                <h1 className="font-bold text-[30px]">Безопасность</h1>
            </div>
            <div className="flex flex-col gap-2 mt-4 text-[20px]">
                <span className="text-[22px] font-bold">Мои устройства</span>
                <div className="flex flex-col gap-2 *:border w-[200px] text-[16px]">
                    <button>Привязанные устройства</button>
                    <button>История активности</button>
                    <button>Выйти из всех устройств</button>
                </div>
            </div>
        </>,
    ]

    return (loading && user)
        ?
        <div className="h-full flex flex-col justify-center items-center">
            {Loader({text: "Загрузка..."})}
        </div>
        :
        <section className="flex size-full mt-5">
            <div className=" w-[220px]">
                <ul className="flex flex-col gap-2 text-[1.35rem] pt-2 pr-4 cursor-pointer font-bold noselect">
                    <li className={`cursor-pointer hover:text-blue-1 ${currentPage === 0 ? 'text-blue-1' : ''}`} onClick={() => setCurrentPage(0)}>Профиль</li>
                    <li className={`cursor-pointer hover:text-blue-1 ${currentPage === 1 ? 'text-blue-1' : ''}`} onClick={() => setCurrentPage(1)}>Безопасность</li>
                </ul>
            </div>

            <div className="w-full">
                {pages[currentPage]}
            </div>
        </section>
}

export default Profile