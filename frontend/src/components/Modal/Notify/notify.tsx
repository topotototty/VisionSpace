import { memo, useEffect, useRef } from "react";
import NotificationCard from "components/Card/NotificationCard";
import { IInvitation } from "models/Invitation";


const NotifyModal = ({open, onClose, notifications}: { open: boolean, onClose: () => void, notifications: IInvitation[]}) => {

    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(
                event.target as Node
            )) {
                onClose();
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [open, onClose])

    if (!open) return null;

    return (
        <section className="absolute z-50 w-[450px] top-0 right-0 h-screen bg-gray-1 border-l-[2px] border-gray-3
        border-opacity-20 transition-all pt-14 pl-12 pr-6 pb-8 duration-1000 ease-in
        overflow-hidden flex flex-col max-md:w-[350px] max-sm:w-[400px]"
            ref={modalRef}
        >
            <div className="flex-shrink-0">
                <span className="text-3xl mt-2">Приглашения</span>
            </div>
            <div className="w-full h-full mt-10 overflow-y-scroll flex-grow">
                {notifications.length > 0 ? (
                    notifications.map((notify: IInvitation) => {
                        return <NotificationCard notify={notify} key={notify.id} />
                    })
                ) : (
                    <span className="text-xl">Уведомлений пока нет</span>
                )}
            </div>
        </section>
    )
}

export default memo(NotifyModal);