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
import { FormEvent, useState } from "react";
import { useConferences } from "hooks/useConferences";
import { useMultiStepsForm } from "hooks/useMultiStepsForm";
import { InfoForm } from "components/Modal/UniversalFormConference/forms/InfoForm";
import { DateTimeForm } from "components/Modal/UniversalFormConference/forms/DateTimeForm";
import { ParticipantsForm } from "components/Modal/UniversalFormConference/forms/ParticipantsForm";
// import { PropertiesForm } from "components/Modal/UniversalFormConference/forms/Aboba";
import { IPropertiesForm } from "models/Conference";
import { toast } from "react-toastify";


type FormData = {
    title: string,
    description: string,
    started_at: string,
    duration: string,
    participants: string[],
    type: string,
    properties: IPropertiesForm,
    time: []
}


const UniversalFormConference = (
    { open, button, setOpen } :
    { open: boolean, button?: React.ReactNode, setOpen: () => void,}
) => {
    const {
        createFast,
        createScheduled,
        createRepetitive
    } = useConferences();

    const defaultEmptyData: FormData = {
        title: "",
        description: "",
        started_at: new Date().toISOString(),
        duration: "00:15:00",
        participants: [],
        type: "SCHEDULED",
        properties: {} as IPropertiesForm,
        time: [],
    };

    const [conferenceData, setConferenceData] = useState<FormData>(defaultEmptyData);


    function updateFields(fields: Partial<FormData>) {
        setConferenceData(
            prev => {
                return { ...prev, ...fields }
            }
        )
    }


    function validateStep(data: FormData, stepIndex: number) {
        let error;

        switch (stepIndex) {
            case 0:
                if (data.title === "") error = "Название конференции не может быть пустым";
                break;
            case 1:
                if (data.started_at === "") error = "Дата начала конференции не может быть пустой";
                break;
            default:
                break;
        }
        toast.error(error);
        return error === undefined;
    }


    async function handleConfirm(e: FormEvent) {
        e.preventDefault();

        if (!validateStep(conferenceData, currentIndex)) {
            return;
        }

        if (!isLast) return next();

        // В зависимости от типа конференции
        switch (conferenceData.type) {
            case "REPETITIVE":
                createRepetitive(conferenceData);
                break;
            case "SCHEDULED":
                createScheduled(conferenceData);
                break;
            case "FAST":
                createFast(conferenceData.title);
                break;
        }

        cancel();
    }


    function cancel() {
        setConferenceData(defaultEmptyData);
        goTo(0);
        setOpen();
    }


    const {
        step,
        steps,
        currentIndex,
        isFirst,
        isLast,
        next,
        previous,
        goTo
    } = useMultiStepsForm([
        <InfoForm {...conferenceData} updateFields={updateFields} />,
        <DateTimeForm {...conferenceData} updateFields={updateFields} />,
        <ParticipantsForm {...conferenceData} updateFields={updateFields} />,
        // <PropertiesForm {...conferenceData} updateFields={updateFields} />
    ]);


    return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        {button && (
            <AlertDialogTrigger asChild>
                {button ? button : (
                    <button onClick={setOpen}>Открыть</button>
                )}
            </AlertDialogTrigger>
        )} 
        <AlertDialogContent className="bg-gray-2 text-white border border-white border-opacity-10">
            <form onSubmit={handleConfirm}>

                <AlertDialogHeader>
                    {/* Header */}
                    <AlertDialogTitle className="justify-between flex">
                        <span>Создание конференции</span>
                        <AlertDialogCancel onClick={cancel} className="p-0 bg-transparent border-white border-opacity-10 w-[30px] h-[30px] hover:bg-opacity-10 hover:bg-white">
                            <img src="/icons/close.svg" alt="close" style={{ filter: 'invert(100%)' }} width={40} height={20} />
                        </AlertDialogCancel>
                    </AlertDialogTitle>

                    <AlertDialogDescription className="flex flex-col gap-2">
                        <div className="w-full flex flex-row mb-3 gap-1">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`
                                        ${i === currentIndex ? 'bg-blue-1' : 'bg-gray-3'}
                                        ${i <= currentIndex ? 'border-blue-1' : 'bg-gray-3'}
                                        h-[4px] rounded-full
                                        w-full flex flex-coll justify-left my-2 cursor-pointer
                                    `}
                                    onClick={() => {
                                        if (!validateStep(conferenceData, currentIndex)) {
                                            return;
                                        }
                                        goTo(i);
                                    }}>
                                    <span className={`
                                        my-1 font-bold text-[0.875rem]
                                        ${i == currentIndex && 'text-white'}
                                    `}>Шаг {i + 1}</span>
                                </div>
                            ))}
                        </div>

                        {/* Body */}
                        <div className="flex flex-col gap-2">
                            {step}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Footer */}
                <AlertDialogFooter className="mt-6">
                    {!isFirst && (
                        <AlertDialogAction
                            className="bg-gray-2 w-full p-2 rounded-[8px] hover:bg-red-1 font-bold hover:bg-gray-4 hover:bg-opacity-50 border-[0.01px] border-gray-3 border-opacity-10"
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                previous();
                            }}
                        >Вернуться</AlertDialogAction>
                    )}
                    <AlertDialogAction
                        type="submit"
                        className="bg-blue-1 w-full p-2 rounded-[8px] hover:bg-red-1 font-bold hover:bg-opacity-50 border-[0.01px] border-gray-3 border-opacity-10"
                        onClick={handleConfirm}>
                            {isLast ? 'Создать' : 'Продолжить'}
                        </AlertDialogAction>
                </AlertDialogFooter>
            </form>
        </AlertDialogContent>
    </AlertDialog>
    );
}


export default UniversalFormConference;
