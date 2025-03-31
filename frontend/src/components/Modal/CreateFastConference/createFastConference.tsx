import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "components/ui/alert-dialog";
import { useState } from "react";
import { useConferences } from "hooks/useConferences";
import { generateRoomWithoutSeparator } from "lib/jitsi_func";


const CreateFastConferenceDialog = (
    {
        open,
        button,
        setOpen,
    } : {
        open: boolean,
        button?: React.ReactNode,
        setOpen: () => void,
    }
) => {
    const [conferenceTitle, setConferenceTitle] = useState(generateRoomWithoutSeparator);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [disabled, setDisabled] = useState(false)
    const {createFast} = useConferences();


    function handleConfirm(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (conferenceTitle.length === 0) {
            setError("Введите название конференции");
            return;
        }

        if (conferenceTitle.length <= 5) {
            setError("Название конференции должно быть больше 5 символов");
            return;
        }

        createFast(conferenceTitle);
        setConferenceTitle(generateRoomWithoutSeparator);
        setOpen();
    }


    return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
            {button ? button : (
                <button onClick={setOpen} >Открыть</button>
            )}
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-gray-2 text-white border border-white border-opacity-10">
            <AlertDialogHeader>
                <AlertDialogTitle className="justify-between flex">
                    <p>Создание быстрой конференции</p>
                    <AlertDialogCancel onClick={() => {
                        setOpen();
                        if (conferenceTitle === "") {
                            setConferenceTitle(generateRoomWithoutSeparator);
                        }
                        setError("");
                    }} className="p-0 bg-transparent border-white border-opacity-10 w-[30px] h-[30px] hover:bg-opacity-10 hover:bg-white">
                        <img src="/icons/close.svg" alt="close" style={{ filter: 'invert(100%)' }} width={40} height={20} />
                    </AlertDialogCancel>
                    {/*  */}
                </AlertDialogTitle>

                <AlertDialogDescription className="flex flex-col gap-2">

                    <span className="flex">
                        <input
                            type="text"
                            placeholder="Введите название конференции (не менее 5-ти символов)"
                            className="w-full text-white rounded-[10px] text-center bg-inherit h-12 p-0 outline-none border-[0.01px] border-white border-opacity-10 text-[0.865rem] font-[600]"
                            value={loading ? "Генерация..." : conferenceTitle}
                            onChange={(e) => {
                                setConferenceTitle(e.target.value);

                                if (e.target.value === '') {
                                    setDisabled(true);
                                    setError('');
                                } else {
                                    setDisabled(false);
                                }
                            }}
                        />
                        <img
                            src="/icons/reload.svg"
                            alt="Пересоздать"
                            className="cursor-pointer"
                            width={40}
                            height={40}
                            style={{ filter: 'invert(100%)' }}
                            onClick={() => {
                                setLoading(true);
                                const newRoomName = generateRoomWithoutSeparator();
                                setConferenceTitle(newRoomName);
                                setLoading(false);
                            }}
                        />
                    </span>

                    {error && (
                        <span className="text-red-1 text-sm w-full text-center text-red-500 ">{error}</span>
                    )}
                </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
                <AlertDialogAction
                    disabled={disabled}
                    className="bg-blue-1 w-full p-2 rounded-[8px] hover:bg-red-1 font-bold hover:bg-opacity-50 border-[0.01px] border-gray-3 border-opacity-10"
                    onClick={handleConfirm}>Создать</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    );
}


export default CreateFastConferenceDialog;
