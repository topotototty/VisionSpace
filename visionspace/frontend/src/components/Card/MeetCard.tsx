import { durationToText } from "lib/date";
import { getBadgeColor, getBadgeText, getConferenceColor } from "lib/utils";
import { IConference } from "models/Conference";

const MeetingCard = ({conference, onClick, isSelected}: {
    conference: IConference,
    onClick: () => void,
    isSelected: boolean
}) => {

    const timeStart = new Date(conference.started_at).toLocaleTimeString(
        "ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
        });

    const badge = getBadgeText(conference.type);
    const badgeColor = getBadgeColor(conference.type);
    const conferenceColor = getConferenceColor(conference.status);

    return (
        <div className={`
h-min rounded-[12px] flex flex-col min-w-[400px] overflow-hiddenbg-gray-1 px-6 py-4
${isSelected ? 'border-blue-1 border-opacity-70' : 'border-white border-opacity-10'}
border-2 last:mb-0 cursor-pointer`} onClick={onClick}>
            <div className="flex flex-col gap-1">

                {/* Header */}
                <div className="flex justify-between items-center mt-2">
                    <div className="w-full h-full text-2xl font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                        {conference.title}
                    </div>
                    <div className="flex w-auto h-full mt-[0.5rem]">
                        <span className={`rounded-full w-[1rem] h-[1rem] bg-${conferenceColor}`}></span>
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
                            className="cursor-pointer font-bold min-w-[40px]"
                        />
                        <div className="text-[16px] font-[500] flex flex-col min-w-fit">
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
                            className="cursor-pointer font-bold mx-2 min-w-[20px]"
                        />

                        {/* Если конференция еще не началась */}
                        {conference.status === "ENDED" || conference.status === "FINISHED" || conference.status === "CANCELED" ? (
                            <div className="text-gray-3 text-opacity-60 text-[16px]">
                                Была с {timeStart} от {new Date(conference.started_at).toLocaleDateString("ru-RU", {day: "numeric", month: "long"})}
                            </div>
                        ) : (
                            <div className="text-[16px] font-[500] flex flex-col">
                                <span>С {timeStart}</span>
                                <span className="text-gray-3 text-opacity-60 text-nowrap">Длительность: {durationToText(conference.duration)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="w-full flex justify-between mt-2 items-center">
                    <span className={`text-white text-opacity-80 bg-black-1 text-[12px] font-bold cursor-pointer ${badgeColor} px-2 py-1 rounded-[6px]`}>
                        {badge}
                    </span>
                    <span className="text-gray-3 text-opacity-80 bg-black-1 text-[12px] font-bold cursor-pointer">
                        #{conference.id}
                    </span>
                </div>
            </div>
        </div>
    )
};


export default MeetingCard;