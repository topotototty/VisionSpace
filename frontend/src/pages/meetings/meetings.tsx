import { useEffect, useState } from "react";
import { IConference } from "models/Conference";
import Loader from "components/Loader/loader";
import UniversalFormConference from "components/Modal/UniversalFormConference/universalFormConference";
import { formatDate, parseDate } from "lib/date";
import { useAuth } from "hooks/useAuth";
import { useConferences } from "hooks/useConferences";
import MeetingCard from "components/Card/MeetCard";
import FilterForm from "components/FilterConferences/FilterForm";
import SelectedConference from "components/SelectedConference/SelectedConference";


const Meetings = () => {
    const [openCreateMeet, setOpenCreateMeet] = useState(false);
    const [searchField, setSearchField] = useState("");
    const { user, loading: authLoading } = useAuth();
    const {
        conferences,
        fillteredConferences,
        loading: conferencesLoading,
        getConferences,
        getConferencesByDates,
        setFilter,
    } = useConferences();

    // Сделать общий список для сортировки, там будет словарь с датами, и массивом из конференций в этот день
    const [conferencesDict, setConferencesDict] = useState<Map<string, IConference[]>>(new Map());
    const [selectedConference, setSelectedConference] = useState<IConference>();

    const getConferencesDict = () => {
        if (user && conferences && fillteredConferences) {
            const conferencesByDateAndByTag = getConferencesByDates(fillteredConferences);
            setConferencesDict(conferencesByDateAndByTag);
        }
    };


    useEffect(() => {
        getConferencesDict();
    }, [fillteredConferences]);


    useEffect(() => {
        if (searchField === "") {
            setFilter("search", null);
        } else {
            setFilter("search", searchField);
        }
    }, [searchField])


    if (authLoading || conferencesLoading) {
        return <div className="h-full w-full flex justify-center items-center">
            <div>
                {Loader({text: "Загрузка..."})}
            </div>
        </div>
    }

    
    return (
        <section className="w-full h-full grid grid-cols-[1fr_2fr] overflow-hidden gap-4 max-xl:grid-cols-1
        ">
            {/* Список конференций border-r-[0.01px] */}
            <div className="h-full min-w-[500px] flex flex-col gap-2 pr-4 border-gray-3 border-opacity-10 overflow-hidden max-xl:border-none"> 
                {/* Блок с фильтрами */}
                <div className="min-w-fit h-[60px] items-center m-1 bg-dark-1 border-b-[0.4px] pb-4 border-white border-opacity-10 bg-opacity-0
                mb-2 flex justify-between gap-2">
                    <input
                        type="text"
                        placeholder="Поиск"
                        value={searchField}
                        // Правильно отправлять запрос на сервер и получать результат
                        onChange={(e) => setSearchField(e.target.value)}
                        onMouseEnter={() => setFilter("search", searchField)}
                        className="w-full border-white focus:border-[1.5px] border-opacity-10 h-[45px] outline-none bg-gray-2 rounded-[5px] px-4 text-sm"
                    />
                    <div className="flex flex-row gap-2">
                        <FilterForm />
                        <div className="flex items-center justify-center bg-gray-2 rounded-[5px] p-[0.01rem] cursor-pointer hover:bg-gray-3 hover:bg-opacity-10 transition-all duration-300">
                            <img
                                src="/images/join.svg"
                                alt="join"
                                width={60}
                                height={60}
                                className="cursor-pointer"
                                onClick={() => {
                                    console.log("Открыть форму создания конференции")
                                    setOpenCreateMeet(true)
                                }}
                                style={{ filter: 'invert(100%)' }}
                            />
                        </div>
                    </div>
                </div>


                {/* Блок с конференциями */}
                <div className="w-full h-full overflow-y-auto flex flex-col gap-4 pl-2">
                    {conferencesDict.size === 0 ? (
                        <div className="w-full h-full flex justify-center">
                            <p className="text-gray-3 text-opacity-60 text-[1rem] mt-2">
                                Конференции не найдены
                            </p>
                        </div>
                    ) : (
                        Array.from(conferencesDict.entries()).map(
                            ([date, conferencesInDate], index) => (
                                <div key={index}>
                                    <h4 className="text-3xl font-bold pl-2 pb-2">
                                        {
                                            date === new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "numeric", year: "numeric" })
                                                ? "Сегодня"
                                                : (
                                                    date === new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString("ru-RU", { day: "numeric", month: "numeric", year: "numeric" })
                                                        ? "Завтра"
                                                        : (
                                                            date === new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString("ru-RU", { day: "numeric", month: "numeric", year: "numeric" })
                                                            ? "Вчера"
                                                            : formatDate(parseDate(date))
                                                        )
                                                )
                                        }
                                        <br />
                                    </h4>
                                    <div className="flex flex-col w-full gap-4">
                                        {conferencesInDate.map((conference, confIndex) => (
                                            <MeetingCard
                                                key={confIndex}
                                                conference={conference}
                                                isSelected={conference.id === selectedConference?.id}
                                                onClick={() => setSelectedConference(conference)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        )
                    )}
                </div>
            </div>

            <SelectedConference
                conference={selectedConference!}
                onDelete={() => {
                    setSelectedConference(undefined)
                    getConferences()
                }}
            />
            <UniversalFormConference
                open={openCreateMeet}
                setOpen={() => {
                    setOpenCreateMeet(false)
                    getConferences()
                }}
                button={<></>}
            />
        </section>
    )
}

export default Meetings