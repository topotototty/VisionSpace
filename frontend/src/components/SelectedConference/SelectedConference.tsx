import { useConferences } from "hooks/useConferences";
import { IConference } from "models/Conference";
import { Button } from "components/Button/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationDialog from "components/Modal/ConfirmationDialog/ConfirmationDialog";
import { useAuth } from "hooks/useAuth";
import { getBadgeText, getConferenceColor } from "lib/utils";
import { durationToText } from "lib/date";


const SelectedConference = (
    {conference, onDelete} : {conference: IConference, onDelete: () => void}
) => {

	const {deleteConference} = useConferences();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    
    function checkStatus() {
        switch (conference?.status) {
            case "FINISHED":
                return true
            case "CANCELED":
                return true
            default:
                return false
        }
    }


    useEffect(() => {
        if (conference) {
            setIsDisabled(checkStatus())
        }
    }, [conference])


    function handleCopyInvite() {
        const message = `Тема: ${conference.title}
    
Подключиться в браузере по ссылке:
${location.origin}/meeting/${conference.id}

Для подключения по коду конференции:
Код конференции: ${conference.id}`
        navigator.clipboard.writeText(message)
        toast.info("Приглашение скопировано в буфер обмена!")
    }

    function handleCopyLink() {
        const message = `${location.origin}/meeting/${conference.id}`
        navigator.clipboard.writeText(message)
        toast.info("Ссылка скопирована в буфер обмена!")
    }


    function handleJoin() {
        if (isDisabled) {
            toast.error("Вы не можете присоединиться к конференции")
            return
        }
        navigate(`/meeting/${conference.id}`)
    }


    function handleRemove() {
        if (conference) {
            setOpenConfirmDialog(false);
            try {
                deleteConference(conference.id);
                onDelete();
                toast.success("Конференция успешно удалена");
            } catch {
                toast.error("Ошибка при удалении конференции");
            }
        }
    }


    function getStatus() {
        switch (conference?.status) {
            case "CREATED":
                return "Создана"
            case "CANCELED":
                return "Отменена"
            case "STARTED":
                return "Начата"
            case "FINISHED":
                return "Завершена"
            default:
                return "Неизвестно"
        }
    }

    
    return conference ? (
        <div className="w-full min-w-fit h-full flex flex-col max-xl:hidden border border-white border-opacity-10">
            <div className="p-8 bg-dark-1 flex flex-col h-full justify-between">
                {/* Информаия о конференции */}
                <div className="p-4 flex flex-col">
                    {/* Название конференции */}
                    <h3 className="text-3xl font-bold flex-wrap word-wrap flex flex-row items-center">
                        {conference.title}
                    </h3>

                    {/* Описание конференции */}
                    <div className="h-[80px] mb-8">
                        <div className="w-full h-[1px] mt-2 bg-opacity-20 bg-gray-3 mr-5 max-xl:mr-1 max-md:mr-1" />
                        <div className="h-full text-gray-3 text-opacity-60 text-[16px]">
                            {conference.description ? (
                                <span>{conference.description}</span>
                            ) : (
                                <span>У конференции отсутствует описание.</span> 
                            )}
                        </div>
                        <div className="w-full h-[1px] mt-2 bg-opacity-20 bg-gray-3 mr-5 max-xl:mr-1 max-md:mr-1" />
                    </div>

                    {/* Информация о конференции */}
                    <div className="grid grid-cols-3 items-center gap-1 mb-10">

                        {/* Организатор */}
                        <div className="flex min-w-full flex-col bg-opacity-[0%] bg-gray-500 rounded-lg p-2">
                            <span className="font-semibold text-opacity-60 text-[16px]">
                                Организатор
                            </span>
                            <p className="text-gray-3 text-opacity-60 text-[16px] cursor-pointer">
                                {conference.creator.lastname} {conference.creator.firstname}
                            </p>
                        </div>

                        {/* Тип конференции */}
                        <div className="flex min-w-full flex-col bg-opacity-[20%] bg-gray-500 rounded-lg p-2">
                            <span className="font-semibold text-opacity-60 text-[16px]">
                                Тип конференции
                            </span>
                            <p className="text-gray-3 text-opacity-60 text-[16px]">
                                {getBadgeText(conference.type)}
                            </p>
                        </div>

                        {/* Статус */}
                        <div className="flex min-w-full flex-col bg-opacity-[0%] bg-gray-500 rounded-lg p-2">
                            <span className="font-semibold text-opacity-60 text-[16px]">
                                Статус
                            </span>
                            <p className="text-opacity-60 text-[16px]">
                                <span className={`rounded-sm text-${getConferenceColor(conference.status)} font-bold`}>{ getStatus() }</span>
                            </p>
                        </div>

                        {/* Время начала */}
                        <div className="flex min-w-full flex-col bg-opacity-[20%] bg-gray-500 rounded-lg p-2">
                            <span className="font-semibold text-opacity-60 text-[16px]">
                                Время начала
                            </span>
                            <p className="text-gray-3 text-opacity-60 text-[16px]">
                                {new Date(conference.started_at).toLocaleTimeString("ru-RU",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>

                        {/* Дата начала */}
                        <div className="flex min-w-full flex-col bg-opacity-[0%] bg-gray-500 rounded-lg p-2">
                            <span className="font-semibold text-opacity-60 text-[16px]">
                                Дата начала
                            </span>
                            <p className="text-gray-3 text-opacity-60 text-[16px]">
                                {new Date(conference.started_at).toLocaleDateString(
                                    "ru-RU", {
                                        day: "numeric",
                                        month: "long",
                                    }
                                )}
                            </p>
                        </div>

                        {/* Длительность */}
                        <div className="flex min-w-full flex-col bg-opacity-[22%] bg-gray-500 rounded-lg p-2">
                            <span className="font-semibold text-opacity-60 text-[16px]">
                                Длительность
                            </span>
                            <p className="text-gray-3 text-opacity-60 text-[16px]">
                                {durationToText(conference.duration)}
                            </p>
                        </div>
                    </div>

                    {/* Кнопки */}
                    <div className="flex gap-2 w-full min-w-fit items-center justify-between">
                        <div className="flex gap-2">
                            <Button
                                className="bg-blue-1
                                hover:bg-blue-1 border-2 border-white border-opacity-10 font-bold text-[16px]
                                hover:bg-opacity-50 p-6"
                                onClick={handleJoin}
                                disabled={isDisabled}
                                >
                                Подключиться
                            </Button>
                            <Button className="bg-dark-1
                                hover:bg-gray-1
                                border-white p-6
                                border-2 text-[16px]
                                font-bold
                                border-opacity-10"
                                onClick={handleCopyInvite}>
                                Копировать приглашение
                            </Button>
                            <Button className="bg-dark-1
                                hover:bg-gray-1
                                border-white p-6
                                border-2 text-[16px]
                                font-bold
                                border-opacity-10"
                                onClick={handleCopyLink}>
                                Копировать ссылку
                            </Button>
                        </div>

                        {conference.creator.id === user?.id && (
                            <div className="flex gap-4">
                                {/* <Button className="px-0 py-6 bg-dark-1
                                    hover:bg-gray-1 border-white
                                    border-2 text-[16px] font-bold min-w-[50px] overflow-hidden border-opacity-10"
                                    onClick={() => {
                                        console.log('openDialog edit in SelectedConference')
                                    }}>
                                    <img 
                                        src={'/icons/edit.svg'}
                                        alt="Изменить"
                                        width={62}
                                        height={65}
                                        style={{ filter: 'invert(100%)' }}
                                        className="cursor-pointer font-bold"
                                    />
                                </Button> */}

                                <ConfirmationDialog
                                    open={openConfirmDialog}
                                    button={
                                        <Button className="px-0 py-6 bg-dark-1
                                            hover:bg-gray-1 border-white min-w-[50px]
                                            border-2 text-[16px] font-bold border-opacity-10"> 
                                            <img 
                                                src={'/icons/delete.svg'}
                                                alt="Удалить"
                                                width={50}
                                                height={50}
                                                style={{ filter: 'invert(100%)' }}
                                                className="cursor-pointer font-bold"
                                            />
                                        </Button>
                                    }
                                    setOpen={() => {setOpenConfirmDialog(!openConfirmDialog);}}
                                    onConfirm={() => {handleRemove()}}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Нижний заголовок */}
                <div className="w-full min-w-fit items-center flex flex-col justify-end">
                    <div className="w-full flex flex-col justify-center items-center">
                        <p className="text-gray-3 text-opacity-60 text-[14px]">Цифровой идентификатор конференции</p>
                        <span className="text-gray-3 text-opacity-60 text-center text-xl font-bold cursor-pointer" onClick={() => {
                            navigator.clipboard.writeText(conference.id)
                            toast("Ссылка скопирована")
                        }}>{conference.id}</span>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="w-full h-full flex justify-center items-center max-xl:hidden">
            <p className="text-gray-3 text-opacity-60 text-[1.4rem]">
                Конференция не выбрана
            </p>
        </div>
    )
}


export default SelectedConference