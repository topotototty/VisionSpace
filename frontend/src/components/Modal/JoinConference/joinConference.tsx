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
import { validateUrl } from "lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const JoinConferenceDialog = (
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
    const [conferenceId, setConferenceId] = useState("");
    const [error, setError] = useState("");
    const [disabled, setDisabled] = useState(true);
    const navigate = useNavigate();

    function handleConfirm(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        
        if (conferenceId.length === 0) {
            setError("Введите ID или ссылку");
            return;
        }
        const meetingId = validateUrl(conferenceId);
        if (meetingId !== false && meetingId !== undefined) {
            navigate(`/meeting/${meetingId}`);
        } else {
            setError("Неверная ссылка или идентификатор конференции");
            setConferenceId("");
        }
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
                    <p>Подключение к конференции</p>
                    <AlertDialogCancel onClick={setOpen} className="p-0 bg-transparent border-white border-opacity-10 w-[30px] h-[30px] hover:bg-opacity-10 hover:bg-white">
                        <img src="/icons/close.svg" alt="close" style={{ filter: 'invert(100%)' }} width={40} height={20} />
                    </AlertDialogCancel>
                </AlertDialogTitle>

                <AlertDialogDescription className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Ссылка или идентификатор конференции"
                        className="w-full text-white rounded-[10px] text-center bg-inherit h-12 p-0 outline-none border-[0.01px] border-white border-opacity-10 text-[0.865rem] font-[600]"
                        onChange={(e) => {
                            setConferenceId(e.target.value);

                            if (e.target.value === '') {
                                setDisabled(true);
                                setError('');
                            } else {
                                setDisabled(false);
                            }
                        }}
                    />
                    {error && (
                        <span className="text-red-1 font-semibold w-full text-center text-red-500 ">{error}</span>
                    )}
                </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
                <AlertDialogAction
                    disabled={disabled}
                    className="bg-blue-1 w-full p-2 rounded-[8px] hover:bg-red-1 font-bold hover:bg-opacity-50 border-[0.01px] border-gray-3 border-opacity-10"
                    onClick={handleConfirm}>Подключиться</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    );
}


export default JoinConferenceDialog;
