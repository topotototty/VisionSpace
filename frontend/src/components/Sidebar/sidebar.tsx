import { cn } from "lib/utils";
import { Link, useLocation } from "react-router-dom";
import { sidebarLinks } from "constants/index";
import { memo } from "react";
import UserService from "services/user/service";


const Sidebar = () => {
    const pathname = useLocation().pathname;
    const permissions = UserService.getPermissions();

    return (
        <section className="sticky top-0 left-0 flex h-screen min-w-[264px] w-[264px] flex-col 
        justify-around bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]
        border-r-[0.01px] border-gray-3 border-opacity-10
        ">
            <Link to="/" className="flex gap-1 items-center fixed top-6 pt-0 ml-auto">
                <img
                    src="/icons/favicon.ico"
                    alt="Vision Logo"
                    width={40}
                    height={40}
                    className="max-sm:size-40 max-lg:size-[40px]"
                />
                <p className="text-[24px] text-white pl-2">
                    VISIONSPACE
                </p>
            </Link>
            <div className="flex flex-1 flex-col gap-6">
                {sidebarLinks
                    .filter((link) => link.label !== "Плагины") // Удаляем "Плагины" из списка
                    .map((link) => {
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
                        )
                })}
            </div>
        </section>
    )
}

export default memo(Sidebar);
