import { useEffect, useState } from "react";
import { IConference } from "models/Conference";
import HomeButtonMeet from "components/Button/HomeButtonMeet";
import MeetingCard from "components/Card/HomeMeetCard";
import { useAuth } from "hooks/useAuth";
import { useConferences } from "hooks/useConferences";
import { filterConferencesByTag } from "lib/date";
import JoinConferenceDialog from "components/Modal/JoinConference/joinConference";
import UniversalFormConference from "components/Modal/UniversalFormConference/universalFormConference";
import CreateFastConferenceDialog from "components/Modal/CreateFastConference/createFastConference";


const Home = () => {
	const [now, setNow] = useState(new Date());
    const [openCreateFastMeet, setOpenCreateFastMeet] = useState(false);
	const [openCreateMeet, setOpenCreateMeet] = useState(false);
	const [openJoinMeet, setOpenJoinMeet] = useState(false);
    const [todayConferences, setTodayConferences] = useState<IConference[]>([]);
    const {user} = useAuth();
    const {
        loading: loadingConferences,
        getConferencesByDate,
        conferences,
    } = useConferences();

	// useEffect для часов
	useEffect(() => {
		const timeInterval = setInterval(() => {
			setNow(new Date());
		}, 1000);
		return () => clearInterval(timeInterval);
	}, [now])


    const updateTodayConferences = () => {
        const today = new Date().toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "numeric",
            year: "numeric"
        });
        const todayConferences = getConferencesByDate(today);
        const activeTodayConferences = filterConferencesByTag(todayConferences)[0];
        setTodayConferences(activeTodayConferences);
    }

    useEffect(() => {
        updateTodayConferences();
    }, [loadingConferences, user, conferences])


    function openCreateFastDialog() {
        setOpenCreateFastMeet(true);
    }


	function joinToMeet() {
		// Будем показывать окно для подключения к конференции
		setOpenJoinMeet(true);
	}


	function createPlannedMeet() {
		// Будем показывать окно для подключения к конференции
		setOpenCreateMeet(true);
	}


	return (
		<section className="w-full h-full grid grid-cols-2 gap-4 mt-4
            max-lg:grid-cols-1 max-lg:h-auto 
        ">
            {/* Кнопки конференций */}
            <div className="w-full h-full overflow-hidden
            ">
                <div className="w-full h-min grid grid-cols-2 gap-4 max-2xl:grid-cols-1 max-2xl:h-full max-2xl:overflow-y-auto
                    max-sm:grid-cols-2
                    max-sm:h-min
                    max-lg:grid-cols-2
                    max-lg:h-min
                    max-md:grid-cols-1
                ">
                { user &&
                    <CreateFastConferenceDialog
                        open={openCreateFastMeet}
                        setOpen={() => {setOpenCreateFastMeet(!openCreateFastMeet)}}
                        button={
                            <HomeButtonMeet
                                color="orange"
                                title="Создать встречу"
                                description="и подключиться"
                                icon="/images/meeting.svg"
                                ref={null}
                                onClick={() => {openCreateFastDialog()}}
                            />
                        }
                    />
                }
                <JoinConferenceDialog
                    open={openJoinMeet}
                    setOpen={() => {setOpenJoinMeet(!openJoinMeet)}}
                    button={
                        <HomeButtonMeet
                            color="blue"
                            title="Присоединиться"
                            description="к уже начавшейся встрече"
                            icon="/images/join.svg"
                            onClick={() => {joinToMeet()}}
                            ref={null}
                        />
                    }
                />
                { user &&
                    <HomeButtonMeet
                        color="blue"
                        title="Запланировать"
                        description="новую встречу"
                        icon="/images/calendar.svg"
                        ref={null}
                        onClick={() => {createPlannedMeet()}}
                    />
                }
                </div>
            </div>

            {/* Блок с данными */}
            <div className="flex flex-col gap-2 w-full h-full overflow-hidden max-lg:overflow-auto">
                {/* Блок со временем */}
                <div className="min-h-[300px] noselect w-full rounded-[20px] bg-gray-1 bg-card bg-no-repeat bg-cover max-lg:hidden">
                    <div className="flex h-full flex-col justify-end gap-[10px]
                    lg:p-11
                    max-lg:p-11
                    max-md:p-10
                    max-sm:p-10">
                        <h2 className="py-2 rounded
                         font-extrabold text-6xl">
                            {now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </h2>
                        <div className="flex flex-col gap-2">
							{now.toLocaleDateString('ru-RU', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* Блок с конференциями */}
                <div className="h-full mt-2 flex flex-col gap-2 overflow-scroll">
                    {user && loadingConferences
                        ? (
                        <div className="text-lg flex justify-center">
                            Загрузка...
                        </div>
                        ) : (
                            todayConferences.map((conference, index) => (
                                <MeetingCard 
                                    key={index}
                                    conference={conference}
                                />
                            ))
                        )
                    }
                </div>
            </div>

			<UniversalFormConference
                open={openCreateMeet}
                setOpen={() => {setOpenCreateMeet(!openCreateMeet)}}
			/>
        </section>
	)
}

export default Home