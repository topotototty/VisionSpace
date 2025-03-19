import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger} from "components/Sheet/sheet";
import { sidebarLinks } from "constants/index";
import { link } from "fs";
import { cn } from "lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserService from "services/user/service";


const MobileNavBar = () => {
    const pathname = useLocation().pathname;
    const permissions = UserService.getPermissions();
    const navigate = useNavigate();


    return (
        <section className="
        w-full max-w-[264px] max-xl:hidden max-sm:block max-sm:ml-2 mr-0">
            <Sheet>
                <SheetTrigger asChild>
                    <img
                        src="/icons/hamburger.svg"
                        alt="menu"
                        width={36}
                        height={36}
                        className="cursor-pointer sm:hidden"
                        style={{ filter: 'invert(100%)' }}
                    />
                </SheetTrigger>

                <SheetContent side="left" className="border-none w-fit bg-dark-1">
                    <SheetTitle></SheetTitle>
                    <SheetDescription></SheetDescription>
                    <Link to="/" className="flex gap-1 items-center pr-[4rem]">
                        <img
                            src="/icons/favicon.ico"
                            alt="Vision Logo"
                            width={32}
                            height={32}
                            className="max-sm:size-10"
                        />
                        <p className="text-[24px] font-bold text-white cursor-pointer">
                            VISIONSPACE
                        </p>
                    </Link>

                    <div className="flex h-[calc(100vh-72px)] flex-col
                    justify-between overflow-y-auto">
                        <SheetClose asChild>
                            <section className="flex h-full w-full flex-col
                            text-white gap-6 pt-16">
                                {sidebarLinks.map((link) => {
                                    if (link.permissions.length > 0) {
                                        // Проверить, что пользователь имеет доступ
                                        const hasAccess = link.permissions.some(
                                            permission => permissions.includes(permission)
                                        );

                                        if (!hasAccess) {
                                            return null;
                                        }
                                    }

                                    const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`);

                                    return (
                                        <SheetClose asChild key={link.route}>
                                            <Link
                                                to={link.route}
                                                key={link.label}
                                                className={cn('flex gap-4 items-center p-4 rounded-lg justify-start', {
                                                    'bg-white bg-opacity-20 border-[0.01px] border-gray-3 border-opacity-10': isActive,
                                                })}>
                                                    <img 
                                                        src={link.icon}
                                                        alt={link.label}
                                                        width={24}
                                                        height={24}
                                                        style={{ filter: 'invert(100%)' }}
                                                        className="min-w-[24px] min-h-[24px]"
                                                    />
                                                    <p className="text-lg font-semibold">
                                                        {link.label}
                                                    </p>
                                            </Link>
                                        </SheetClose>
                                    )

                                })}

                                { UserService.getUser() ? (
                                    <SheetClose asChild>
                                        <Link
                                            onClick={() => {
                                                navigate('/profile');
                                            }}
                                            to={'#'}
                                            className={cn('flex gap-4 items-center p-4 rounded-lg justify-start', {
                                                'bg-white bg-opacity-20 border-[0.01px] border-gray-3 border-opacity-10': pathname === '/profile',
                                            })}>
                                                <img 
                                                    src="/icons/users.svg"
                                                    alt="Вход"
                                                    width={20}
                                                    height={20}
                                                    style={{ filter: 'invert(100%)' }}
                                                    className="min-w-[20px] min-h-[20px]"
                                                />
                                            <p className="font-semibold">
                                                Профиль
                                            </p>
                                        </Link>
                                    </SheetClose>
                                ) : (
                                    <Link
                                        to={'/sign-in'}
                                        onClick={() => {
                                            navigate('/sign-in');
                                        }}
                                        className={cn('flex gap-4 items-center p-4 rounded-lg justify-start', {
                                            'bg-white bg-opacity-20 border-[0.01px] border-gray-3 border-opacity-10': pathname === '/sign-in',
                                        })}>
                                            <img 
                                                src="/icons/sign-in.svg"
                                                alt="Провель"
                                                width={20}
                                                height={20}
                                                style={{ filter: 'invert(100%)' }}
                                                className="min-w-[20px] min-h-[20px]"
                                            />
                                            <p className="text-lg font-semibold">
                                                Вход
                                            </p>
                                    </Link>
                                )}
                            </section>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    )
}

export default MobileNavBar