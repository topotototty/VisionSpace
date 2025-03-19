import { Button } from "components/Button/button";
import { useConferences } from "hooks/useConferences";
import { useInvitations } from "hooks/useInvitations";
import { IInvitation } from "models/Invitation";
import { useState } from "react";


const NotificationCard = ({notify }: {notify: IInvitation}) => {
    const [open, setOpen] = useState<boolean>(false)
    const {getConferences} = useConferences();
    const {acceptInvitation, declineInvitation} = useInvitations();
    // const isPending = notify.invitation_status === "PENDING"

    function accept() {
        acceptInvitation(notify.id)
        getConferences();
    }

    function decline() {
        declineInvitation(notify.id)
    }

    return (
        <div className="h-min rounded-[8px] flex flex-col
         bg-gray-1 mb-4 pl-4 pr-6 pt-5 pb-6 border-white border-2
         border-opacity-10 last:mb-0 cursor-pointer" onClick={() => setOpen(!open)}>
            <div className="flex flex-col gap-1 pl-4">

                {/* Header */}
                <div className="flex flex-col justify-between w-full items-start mt-2">
                    <div className="text-[1.22rem] font-bold">
                        {notify.conference.title}
                    </div>
                    {notify.conference.description && (
                        <div className={` ${open === true ? 'word-wrap text-balance min-h-[30px]' : 'min-h-[30px] hidden text-ellipsis text-wrap overflow-hidden'} w-full text-sm mt-1`}>
                            {notify.conference.description}
                        </div>
                    )}
                    <div className="text-ml w-full text-right mt-1">
                        от {notify.conference.creator.lastname} {notify.conference.creator.firstname}
                    </div>
                </div>

                {/* Footer */}
                { notify.invitation_status !== "ACCEPTED" && notify.invitation_status !== "DECLINED" && (
                    <div className={`${open === true ? 'flex' : 'hidden'} w-full items-center content-center mt-4 p-0 gap-4`}>
                        <Button
                            className="
                            bg-blue-1
                            hover:bg-blue-1
                            hover:bg-opacity-50 w-full" onClick={accept}>
                                Принять
                        </Button>
                        <Button
                            className="
                            bg-red-500
                            hover:bg-red-500
                            hover:bg-opacity-50 w-full" onClick={decline}>
                                Отклонить
                        </Button>
                    </div>
                )}

                { notify.invitation_status === "ACCEPTED" && (
                    <div className="flex w-full items-center content-center mt-4 p-0 gap-4">
                        ✔ Приглашение принято
                    </div>
                )}

                { notify.invitation_status === "DECLINED" && (
                    <div className="flex w-full items-center content-center mt-4 p-0 gap-4">
                        ✖ Приглашение отменено
                    </div>
                )}
            </div>
        </div>
    )
}
// Название
// Время от и до
// Дата

export default NotificationCard