import { useState } from "react";
import Loader from "components/Loader/loader";
import { useAuth } from "hooks/useAuth";
import { useActivity } from "hooks/useActivity";

const Profile = () => {
    const { user, loading: authLoading } = useAuth();
    const [currentPage, setCurrentPage] = useState(0);

    const { activities, loading: activityLoading } = useActivity();

    const renderActivityList = () => {
        if (activityLoading) {
            return <span className="text-[16px] text-white/60">Загрузка активности...</span>;
        }

        if (activities.length === 0) {
            return <span className="text-[16px] text-white/40">Нет действий</span>;
        }

        return (
            <ul className="flex flex-col gap-2 mt-2">
                {activities.map((a, i) => (
                    <li key={i} className="bg-gray-2 rounded-md p-3 border border-white border-opacity-5 text-sm text-white/90">
                        <span className="block font-semibold text-blue-1">
                            {new Date(a.timestamp).toLocaleString("ru-RU")}
                        </span>
                        <span className="block mt-1">{a.action}</span>
                    </li>
                ))}
            </ul>
        );
    };

    const pages = [
        // Профиль
        <>
            <div className="flex flex-row items-center gap-2">
                <h1 className="font-bold text-[30px]">{user?.firstname} {user?.lastname}</h1>
            </div>

            <div className="flex flex-col gap-2 mt-4 text-[18px] text-white/90">
                <span className="text-white/60">Идентификационный номер:</span>
                <span className="font-mono">{user?.id}</span>
                <span className="text-white/60 mt-2">Почта:</span>
                <span className="font-mono">{user?.email}</span>
            </div>

            <div className="mt-8">
                <h2 className="font-semibold text-[22px] mb-3">Последние действия</h2>
                {renderActivityList()}
            </div>
        </>,

        // Безопасность
        <>
            <div className="flex flex-row items-center gap-2">
                <h1 className="font-bold text-[30px]">Безопасность</h1>
            </div>
        </>,
    ];

    if (authLoading || !user) {
        return (
            <div className="h-full flex flex-col justify-center items-center">
                {Loader({ text: "Загрузка..." })}
            </div>
        );
    }

    return (
        <section className="flex size-full mt-5">
            {/* Боковое меню */}
            <div className="w-[220px]">
                <ul className="flex flex-col gap-2 text-[1.35rem] pt-2 pr-4 cursor-pointer font-bold noselect">
                    <li
                        className={`cursor-pointer hover:text-blue-1 ${currentPage === 0 ? 'text-blue-1' : ''}`}
                        onClick={() => setCurrentPage(0)}
                    >
                        Профиль
                    </li>
                    <li
                        className={`cursor-pointer hover:text-blue-1 ${currentPage === 1 ? 'text-blue-1' : ''}`}
                        onClick={() => setCurrentPage(1)}
                    >
                        Безопасность
                    </li>
                </ul>
            </div>

            {/* Контент вкладки */}
            <div className="w-full px-6">
                {pages[currentPage]}
            </div>
        </section>
    );
};

export default Profile;
