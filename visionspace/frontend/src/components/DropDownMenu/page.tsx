import { useAuth } from "hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";


const DropdownMenu = () => {
    const {user, logout, loading} = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [menuWidth, setMenuWidth] = useState<number>(0);
    const menuRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();


    function handleAvatarClick() {
        if (!user) {
            navigate('/sign-in')
        }
        setIsDropdownOpen(!isDropdownOpen)
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
        ) {
            setIsDropdownOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    }, [])

    useEffect(() => {
        if (menuRef.current) {
            setMenuWidth(menuRef.current.offsetWidth);
        }
    }, [menuRef.current]);


    return !user ? (
        <button
            className='text-white bg-blue-1 hover:bg-opacity-80 rounded-[12px] px-4 py-4'
            onClick={() => navigate('/sign-in')}>
            Войти в аккаунт
        </button>
    ) : (
        <div
            ref={menuRef}
            className="
                flex justify-between items-center
                border-[0.01px] border-white border-opacity-10
                cursor-pointer uppercase relative
                noselect gap-2 font-semibold
                px-4 w-full h-[60px] rounded-[12px]
                max-sm:w-[160px]
                text-wrap
                "
            onClick={handleAvatarClick}>
            <span className="h-full flex items-left justify-center flex-col">
                {loading ? 'Загрузка...' : `${user?.lastname} ${user?.firstname}`}
                {/* <span className="">{user?.role}</span> */}
            </span>
            <span className={`triangle ${isDropdownOpen ? 'up' : 'down'}`}></span>
            {isDropdownOpen && 
                ReactDOM.createPortal(
                    <div
                        ref={dropdownRef}
                        style={{width: `${menuWidth}px`}}
                        className="absolute z-10 top-[75px] right-[40px] w-full min-w-[200px] py-2 text-left bg-gray-2 shadow-lg rounded-lg">
                        <ul>
                            <li className="px-6 py-2 bg-transparent hover:bg-opacity-50 hover:bg-dark-1 cursor-pointer" onClick={() => navigate('/profile')}>Профиль</li>
                            <li className="px-6 py-2 bg-transparent hover:bg-opacity-50 hover:bg-dark-1 cursor-pointer" onClick={() => {logout()}}>Выйти</li>
                        </ul>
                    </div>,
                    document.body
                )
            }
        </div>
    )
}

export default DropdownMenu