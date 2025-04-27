import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
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
    reset,
  } = useForm<IRegisterProps>();
  const [isRegistered, setIsRegistered] = useState(false);

  const registerSubmit = async (data: IRegisterProps) => {
    // Валидация на клиенте
    if (!data.firstname || !data.lastname || !data.email || !data.password) {
      toast.error("Заполните все поля");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(data.email)) {
      toast.error("Некорректный email");
      return;
    }

    if (data.password.length < 8) {
      toast.error("Пароль должен быть не менее 8 символов");
      return;
    }

    setButtonState(true);
    setProgressbar(40);
    UserService.removeUser();
    TokensService.clear();

    try {
      const response = await AuthService.register(data);

      if (!response || !response.user || !response.tokens) {
        throw new Error("Ошибка авторизации после регистрации");
      }

      login(response.user);
      TokensService.setTokens(response.tokens);

      toast.success("Регистрация успешна, добро пожаловать!");
      setIsRegistered(true);
      reset();
      navigate("/", { replace: true });
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.email ||
        error?.response?.data?.password ||
        "Ошибка регистрации, попробуйте снова";
      toast.error(errMsg);
    } finally {
      setProgressbar(0);
      setButtonState(false);
    }
  };

  return (
    <main className="flex flex-col items-center content-center justify-center h-screen p-24">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
        theme="dark"
      />

      <form
        onSubmit={handleSubmit(registerSubmit)}
        className="flex flex-col gap-4 border border-gray-3 border-opacity-10 p-10 shadow-slate-800 shadow-md rounded-md pb-15"
      >
        <img src="/icons/favicon.ico" alt="Logo" width={60} height={60} className="mb-10" />
        <h1 className="text-2xl font-bold">Регистрация</h1>

        {!isRegistered && (
          <>
            <p className="text-sm">Заполните форму, чтобы создать аккаунт</p>

            <label className="flex flex-col gap-1 border border-gray-3 border-opacity-10 bg-gray-2 px-4 py-3 rounded-md">
              <span className="uppercase text-sm text-white/50">Имя</span>
              <input
                {...register("firstname")}
                type="text"
                placeholder="Иван"
                className="bg-gray-2 outline-none"
                autoComplete="off"
              />
            </label>

            <label className="flex flex-col gap-1 border border-gray-3 border-opacity-10 bg-gray-2 px-4 py-3 rounded-md">
              <span className="uppercase text-sm text-white/50">Фамилия</span>
              <input
                {...register("lastname")}
                type="text"
                placeholder="Петров"
                className="bg-gray-2 outline-none"
                autoComplete="off"
              />
            </label>

            <label className="flex flex-col gap-1 border border-gray-3 border-opacity-10 bg-gray-2 px-4 py-3 rounded-md">
              <span className="uppercase text-sm text-white/50">Почта</span>
              <input
                {...register("email")}
                type="email"
                placeholder="vision@space.ru"
                className="bg-gray-2 outline-none"
                autoComplete="off"
              />
            </label>

            <label className="flex flex-col gap-1 border border-gray-3 border-opacity-10 bg-gray-2 px-4 py-3 rounded-md">
              <span className="uppercase text-sm text-white/50">Пароль</span>
              <input
                {...register("password")}
                type="password"
                placeholder="●●●●●●"
                className="bg-gray-2 outline-none"
                autoComplete="off"
              />
            </label>

            <button
              disabled={buttonState}
              type="submit"
              className={`uppercase text-sm border border-gray-3 border-opacity-10 bg-gray-2 px-4 py-4 rounded-md flex ${
                buttonState ? "justify-between" : "justify-center"
              } items-center gap-2 cursor-pointer hover:bg-opacity-45 disabled:cursor-default disabled:border-opacity-5 transition-transform duration-500 ease-in-out`}
            >
              <span className="font-bold text-sm">Зарегистрироваться</span>
              {buttonState && (
                <div className="w-[100px] h-[8px] bg-dark-1">
                  <div
                    className="h-full bg-blue-1 rounded-sm"
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
