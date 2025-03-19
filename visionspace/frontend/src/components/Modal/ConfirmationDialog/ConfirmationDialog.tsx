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


const ConfirmationDialog = (
    {
        open,
        button,
        setOpen,
        onConfirm,
    } : {
        open: boolean,
        button?: React.ReactNode,
        setOpen: () => void,
        onConfirm: () => void,
    }
) => {
    function handleOpen() {
        open = true;
    }

    function handleConfirm() {
        onConfirm();
        open = false;
    }

    function handleClose() {
        open = false;
    }


    return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
            {button ? button : (
                <button onClick={handleOpen} >Открыть</button>
            )}
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-gray-2 text-white border border-white border-opacity-10">
            <AlertDialogHeader>
            <AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
            <AlertDialogDescription className="text-white">
                Данное действие повлечёт за собой удаление записи и всех её зависимостей из базы данных. Данное действие необратимо.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose} className="bg-gray-2 rounded-[8px] hover:bg-red-1 hover:text-white font-bold hover:bg-gray-4 hover:bg-opacity-50 border-[0.01px] border-gray-3 border-opacity-10">Отменить</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className="bg-red-500 hover:bg-opacity-50 hover:bg-red-500 p-2 px-4 rounded-[8px] hover:bg-red-1 font-bold border-[0.01px] border-gray-3 border-opacity-10">Удалить</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    );
}


export default ConfirmationDialog;
