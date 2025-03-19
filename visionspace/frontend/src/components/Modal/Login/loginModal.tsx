import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "components/ui/alert-dialog";
import { IUser } from "models/User"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"


const ModalLogin = (
    {
        open,
        onSuccess,
        setOpen
    } : {
        open: boolean,
        onSuccess: (user: IUser) => void,
        setOpen: () => void
    }
) => {

    const [name, setName] = useState<string>("")
    const location = useLocation()

    const handleLoginGuest = () => {
        const user: IUser = {
            id: "none",
            firstname: name,
            lastname: "none",
            email: `${name}@vision.guests.ru`,
            last_login: "none",
            role: "MEMBER"
        }
        onSuccess(user as IUser)
        setOpen()
    }


    return <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-gray-2 text-white border border-white border-opacity-10 w-[400px]">
            <AlertDialogHeader>
                <AlertDialogTitle className="justify-between flex">
                    <span className="text-2xl font-bold">Вход в конференцию</span>
                    <AlertDialogCancel onClick={setOpen} className="p-0 bg-transparent border-white border-opacity-10 w-[30px] h-[30px]">
                        <img src="/icons/close.svg" alt="close" style={{ filter: 'invert(100%)' }} width={40} height={20} />
                    </AlertDialogCancel>
                </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="flex flex-col gap-2">
                <div className="flex flex-col my-1 gap-4">
                    <div className="font-[400] overflow-hidden">
                        <div className="flex flex-col gap-2 text-white font-[1.2rem]">
                            <p>Для участия в конференции необходимо войти в учётную запись, либо ввести ваше ФИО, которое будет отображено в конференции</p>
                        </div>
                    </div>
                    <input
                        type="text"
                        value={name}
                        maxLength={18}
                        onChange={e => setName(e.target.value)}
                        placeholder="Введите ваше имя"
                        className="p-2 w-full rounded-sm text-white font-[400] bg-gray-700 bg-opacity-50 outline-none border-1 border-gray-1"
                    />
                </div>
                
                    <div className="flex flex-col gap-2 mt-2 items-center">
                        <AlertDialogAction 
                            type="button"
                            onClick={handleLoginGuest}
                            className="bg-red-500 w-1/2 p-2 rounded-[8px] hover:bg-red-1 font-bold hover:bg-opacity-50 border-[0.01px] border-gray-3 border-opacity-10">
                                Войти как гость
                        </AlertDialogAction>
                        <Link to={`/sign-in?redirectTo=${location.pathname}`} className="text-white text-opacity-70 hover:text-red-500">
                            у меня есть аккаунт
                        </Link>
                    </div>
            </AlertDialogDescription>
        </AlertDialogContent>
    </AlertDialog>
}


export default ModalLogin