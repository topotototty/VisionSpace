import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate} from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { toast } from "react-toastify";
import { IRegisterProps } from "models/User";
import AuthService from "services/auth/service";
import TokensService from "services/token/service";
import UserService from "services/user/service";

const SignUp = () => {
    const [progressbar, setProgressbar] = useState(0);
    const [buttonState, setButtonState] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<IRegisterProps>();
    const [isRegistered, setIsRegistered] = useState<boolean>(false);

    const registerSubmit = async (data: IRegisterProps) => {
        setButtonState(true);
        setProgressbar(40);
        UserService.removeUser();
        TokensService.clear();

        try {
            // Отправка данных на сервер
            const response = await AuthService.register(data);

            if (!response || !response.user || !response.tokens) {
                throw new Error("Ошибка авторизации после регистрации");
            }

            // Сохранение данных пользователя и токенов
            login(response.user);
            TokensService.setTokens(response.tokens);

            // Отображение уведомления
            toast.success("Регистрация успешна, добро пожаловать!");

            // Обновление состояния
            setIsRegistered(true);
            reset();

            // Перенаправление на главную страницу
            navigate("/", { replace: true });
        } catch (error: any) {
            console.error("Ошибка регистрации:", error);
            toast.error("Ошибка регистрации, попробуйте снова");
        
            setButtonState(false);
            setProgressbar(100);
        }
        finally {
            setProgressbar(0);
            setButtonState(false);
        }
    };

    return (
        <main className="flex flex-col items-center content-center justify-center h-screen p-24">
            <form
                onSubmit={handleSubmit(registerSubmit)}
                className="flex flex-col gap-4 border border-gray-3 border-opacity-10 p-10 shadow-slate-800 shadow-md rounded-md pb-15"
            >
                <img src="/icons/favicon.ico" alt="Logo" width={60} height={60} className="mb-10"/>
                <h1 className="text-2xl font-bold">Регистрация</h1>

                {!isRegistered && (
                    <>
                        <p className="text-sm">Заполните форму, чтобы создать аккаунт</p>

                        {/* Имя */}
                        <label className="flex flex-col gap-1 border border-gray-3 border-opacity-10 bg-gray-2 px-4 py-3 rounded-md">
                            <span className="uppercase text-sm text-white/50">Имя</span>
                            <input
                                {...register("firstname", { required: "Введите имя" })}
                                type="text"
                                placeholder="Иван"
                                className="bg-gray-2 outline-none"
                                autoComplete="off"
                            />
                            {errors.firstname && <span className="text-red-500 text-sm">{errors.firstname.message}</span>}
                        </label>

                        {/* Фамилия */}
                        <label className="flex flex-col gap-1 border border-gray-3 border-opacity-10 bg-gray-2 px-4 py-3 rounded-md">
                            <span className="uppercase text-sm text-white/50">Фамилия</span>
                            <input
                                {...register("lastname", { required: "Введите фамилию" })}
                                type="text"
                                placeholder="Петров"
                                className="bg-gray-2 outline-none"
                                autoComplete="off"
                            />
                            {errors.lastname && <span className="text-red-500 text-sm">{errors.lastname.message}</span>}
                        </label>

                        {/* Почта */}
                        <label className="flex flex-col gap-1 border border-gray-3 border-opacity-10 bg-gray-2 px-4 py-3 rounded-md">
                            <span className="uppercase text-sm text-white/50">Почта</span>
                            <input
                                {...register("email", { 
                                    required: "Введите почту", 
                                    pattern: { value: /^\S+@\S+$/i, message: "Некорректный email" } 
                                })}
                                type="email"
                                placeholder="vision@space.ru"
                                className="bg-gray-2 outline-none"
                                autoComplete="off"
                            />
                            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                        </label>

                        {/* Пароль */}
                        <label className="flex flex-col gap-1 border border-gray-3 border-opacity-10 bg-gray-2 px-4 py-3 rounded-md">
                            <span className="uppercase text-sm text-white/50">Пароль</span>
                            <input
                                {...register("password", { 
                                    required: "Введите пароль", 
                                    minLength: { value: 8, message: "Минимум 8 символов" } 
                                })}
                                type="password"
                                placeholder="●●●●●●"
                                className="bg-gray-2 outline-none"
                                autoComplete="off"
                            />
                            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                        </label>

                        <button 
                            disabled={buttonState} 
                            type="submit" 
                            className={`uppercase text-sm border-[0.01px] border-gray-3 
                                border-opacity-10 bg-gray-2 px-4 py-4 rounded-md flex 
                                ${buttonState ? 'justify-between' : 'justify-center'} 
                                items-center gap-2 cursor-pointer hover:bg-opacity-45 
                                disabled:hover:bg-opacity-80 disabled:cursor-default 
                                disabled:border-opacity-5 transition-transform 
                                duration-500 ease-in-out`}
                        >
                            <span className="font-bold text-sm">Зарегистрироваться</span>
                            {buttonState && (
                                <div className="w-[100px] h-[8px] bg-dark-1 transition-transform duration-500 ease-in-out">
                                    <div 
                                        className="max-w-full h-full bg-blue-1 rounded-sm transition-colors duration-500 ease-in-out"
                                        style={{ width: `${progressbar}%` }}
                                    ></div>
                                </div>
                            )}
                        </button>


                        <p className="text-sm text-center mt-4">
                            Уже есть аккаунт{" "}
                            <button 
                                type="button"
                                onClick={() => navigate("/sign-in")}
                                className="text-blue-500 hover:underline cursor-pointer"
                            >
                                Войти
                            </button>
                        </p>
                    </>
                )}
            </form>
        </main>
    );
};

export default SignUp;
