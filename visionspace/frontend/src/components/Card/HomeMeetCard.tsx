import { Button } from "components/Button/button";
import { IConference } from "models/Conference";
import { useNavigate } from "react-router-dom";
import ConferencesService from "services/conference/service";
import { durationToText } from "lib/date";
import { toast } from "react-toastify";
import { useAuth } from "hooks/useAuth";


const MeetingCard = ( { conference }: { conference: IConference }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isOwner = conference.creator.id === user?.id;

    const timeStart = new Date(conference.started_at).toLocaleTimeString(
        "ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
        });


    const getConferenceColor = () => {
        switch (conference.status) {
            case "CREATED":
                return "bg-blue-500";
            case "CANCELED":
                return "bg-gray-500";
            case "STARTED":
                return "bg-green-600";
            case "FINISHED":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    }

    return (
        <div className={`h-min rounded-[12px] flex flex-col min-w-[400px] overflow-hiddenbg-gray-1 px-6 py-4 border-2 last:mb-0 cursor-pointer border-white border-opacity-10`}>
            <div className="flex flex-col gap-1">

                {/* Header */}

                <div className="flex justify-between items-center mt-2">
                    <div className="w-full h-full text-2xl font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                        {conference.title}
                    </div>
                    <div className="flex w-auto h-full mt-[0.5rem]">
                        <span className={`rounded-full w-[1rem] h-[1rem] ${getConferenceColor()}`}></span>
                    </div>
                </div>
                
                {/* Body */}
                <div className="grid grid-cols-2 justify-between w-full mt-4 mb-3 mx-0 p-0 text-white">
                    {/* Автор конференции */}
                    <div className="flex w-full items-center">
                        <img 
                            src={'/icons/users.svg'}
                            alt="Время"
                            width={40}
                            height={40}
                            style={{ filter: 'invert(100%)' }}
                            className="cursor-pointer font-bold"
                        />
                        <div className="text-[16px] font-[500] flex flex-col">
                            <span>Организатор</span>
                            <a href="#" className="text-gray-3 text-opacity-60 ">{conference.creator.lastname} {conference.creator.firstname}</a>
                        </div>
                    </div>
                
                    {/* Время конференции */}
                    <div className="flex w-full gap-2 items-center">
                        <img 
                            src={'/icons/meetings.svg'}
                            alt="Время"
                            width={20}
                            height={20}
                            style={{ filter: 'invert(100%)' }}
                            className="cursor-pointer font-bold mx-2"
                        />
                
                        {/* Если конференция еще не началась */}
                        {conference.status === "ENDED" || conference.status === "FINISHED" || conference.status === "CANCELED" ? (
                            <div className="text-gray-3 text-opacity-60 text-[16px]">
                                Была с {timeStart} от {new Date(conference.started_at).toLocaleDateString("ru-RU", {day: "numeric", month: "long"})}
                            </div>
                        ) : (
                            <div className="text-[16px] font-[500] flex flex-col">
                                <span>С {timeStart}</span>
                                <span className="text-gray-3 text-opacity-60">Длительность: {durationToText(conference.duration)}</span>
                            </div>
                        )}
                    </div>
                </div>
                

                {/* Footer */}
                <div className="flex justify-start gap-2 w-full items-center content-center">
                    <Button
                        className="
                        bg-blue-1 px-6
                        hover:bg-blue-1
                        hover:bg-opacity-50" onClick={() => {
                            if (isOwner) {
                                ConferencesService.setStatus(conference.id, "STARTED")
                            }
                            navigate(`/meeting/${conference.id}`)
                        }}>
                        Подключиться
                    </Button>
                    <Button
                        className="
                        bg-transparent px-6
                        hover:bg-gray-3
                        hover:bg-opacity-50" onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/meeting/${conference.id}`)
                            toast("Ссылка скопирована")
                        }}>
                        Копировать ссылку
                    </Button>
                </div>
            </div>
        </div>
    )
}


export default MeetingCard