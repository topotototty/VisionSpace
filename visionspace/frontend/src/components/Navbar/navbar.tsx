import { navbarLinks } from 'constants/index';
import { memo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MobileNavBar from 'components/Navbar/mobile/navbar';
import NotifyModal from 'components/Modal/Notify/notify';
import { useAuth } from 'hooks/useAuth';
import { useInvitations } from 'hooks/useInvitations';
import DropdownMenu from 'components/DropDownMenu/page';


const Navbar = () => {
    const pathname = useLocation().pathname;

    // Если не найден текущий путь, то подставить 404
    const currentPath = navbarLinks.find(
        link => link.route === pathname
    )?.label || 'Не найдено';

    // Возможность зайти и выйти
    const {user} = useAuth();
    const {
        invitations,
        pendingInvitations
    } = useInvitations();

    // Уведомления
    const [openNotify, setOpenNotify] = useState<boolean>(false);

    function handleNotifyClick() {
        setOpenNotify(!openNotify)
    }

    return (
        <nav className="flex-between overflow-hidden min-h-[80px] h-[80px] w-full bg-dark-1 px-6 py-[10px] md:px-10 lg:px-10 border-b-[0.01px] border-gray-3 border-opacity-10">
            <p className="text-[28px] font-[600] my-2 cursor-pointer">
                {currentPath}
            </p>
            <div className="flex flex-row flex-between h-full gap-4 ">
                { user && (
                    <div className="relative h-full border-[0.01px] min-w-[60px] border-white border-opacity-10 hover:border-[1px] rounded-lg max-lg:mr-2 max-sm:hidden justify-center flex items-center" onClick={handleNotifyClick}>
                        <img
                            src="/images/notify.svg"
                            alt="notify"
                            width={32}
                            height={32}
                            className="cursor-pointer rounded-[12px] max-sm:w-[24px] max-sm:h-[24px]"
                            style={{ filter: 'invert(100%)'}}
                        />
                        {pendingInvitations.length > 0 && (
                            <span className="absolute top-1 right-1 bg-red-400 flex justify-center 
                            cursor-pointer items-center text-white rounded-full w-[20px] h-[20px] text-[12px]
                            max-sm:w-[20px] max-sm:h-[20px] max-sm:right-1 max-xl:text-[10px] max-sm:p-[4px]">
                                {pendingInvitations.length}
                            </span>
                        )}
                    </div>
                )}

                <div className='hidden max-sm:block'>
                    <MobileNavBar />
                </div>
                <div className='max-sm:hidden'>
                    <DropdownMenu />
                </div>
            </div>

            {/* Модальное окно для Уведомлений */}
            <NotifyModal open={openNotify} notifications={invitations!} onClose={() => setOpenNotify(false)} />
        </nav>
    )
}

export default memo(Navbar);