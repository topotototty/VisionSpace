import { AUTH_MODE } from "constants/index";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import { ILoginProps } from "models/User";
import AuthService from "services/auth/service";
import TokensService from "services/token/service";
import UserService from "services/user/service";

const SignIn = () => {
  const [progressbar, setProgressbar] = useState(0);
  const [buttonState, setButtonState] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    new URLSearchParams(location.search).get("redirectTo") ||
    localStorage.getItem("redirectTo") ||
    "/";
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<ILoginProps>();

  const [isLogin, setIsLogin] = useState(false);

  const loginSubmit = async (data: ILoginProps) => {
    if (!data.email || !data.password) {
      toast.error("Заполните все поля");
      return;
    }

    setButtonState(true);
    setProgressbar(40);
    UserService.removeUser();
    TokensService.clear();

    try {
      const response = await AuthService.login(AUTH_MODE, data);
      login(response.user);
      TokensService.setTokens(response.tokens);

      toast.success("Добро пожаловать");
      setIsLogin(true);
      localStorage.removeItem("redirectTo");
      navigate(redirectTo, { replace: true });
      reset();
    } catch (error: any) {
      toast.error("Неверная почта или пароль");
      setError("email", { type: "manual", message: "Неверная почта" });
      setError("password", { type: "manual", message: "Неверный пароль" });
    } finally {
      setProgressbar(0);
      setButtonState(false);
    }
  };

  return (
    <main className="flex flex-col items-center content-center justify-center h-screen p-24">
      <form
        onSubmit={handleSubmit(loginSubmit)}
        className="flex flex-col gap-4 border border-gray-3 border-opacity-10 p-10 shadow-slate-800 shadow-md rounded-md pb-15"
      >
        <img src="/icons/favicon.ico" alt="Logo" width={60} height={60} className="mb-10" />
        <h1 className="text-2xl font-bold">Добро пожаловать</h1>

        {!isLogin && (
          <>
            <p className="text-sm">Войдите в систему, чтобы продолжить</p>

            {/* Email */}
            <label className="flex flex-col gap-1 border border-gray-3 border-opacity-10 bg-gray-2 px-4 py-3 rounded-md">
              <span className="uppercase text-sm text-white/50">Почта</span>
              <div className="flex flex-row gap-2">
                <img src="/icons/envelope.svg" alt="Email Icon" width={30} />
                <input
                  {...register("email", {
                    required: "Введите почту",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Некорректный формат почты",
                    },
                  })}
                  type="email"
                  placeholder="vision@space.ru"
                  className="bg-gray-2 outline-none overflow-auto w-full"
                  autoComplete="off"
                />
              </div>
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email.message}</span>
              )}
            </label>

            {/* Пароль */}
            <label className="flex flex-col gap-1 border border-gray-3 border-opacity-10 bg-gray-2 px-4 py-3 rounded-md">
              <span className="uppercase text-sm text-white/50">Пароль</span>
              <div className="flex flex-row gap-2">
                <img src="/icons/unlock-filled.svg" alt="Password Icon" width={30} />
                <input
                  {...register("password", {
                    required: "Введите пароль",
                    minLength: {
                      value: 8,
                      message: "Минимум 8 символов",
                    },
                  })}
                  type="password"
                  placeholder="●●●●●●"
                  className="bg-gray-2 outline-none overflow-auto w-full"
                  autoComplete="off"
                />
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password.message}</span>
              )}
            </label>

            {/* Кнопка входа */}
            <button
              disabled={buttonState}
              type="submit"
              className={`uppercase text-sm border border-gray-3 border-opacity-10 bg-gray-2 px-4 py-4 rounded-md flex ${
                buttonState ? "justify-between" : "justify-center"
              } items-center gap-2 cursor-pointer hover:bg-opacity-45 disabled:hover:cursor-default disabled:border-opacity-5 transition-transform duration-500 ease-in-out`}
            >
              <span className="font-bold text-sm">Войти</span>
              {buttonState && (
                <div className="w-[100px] h-[8px] bg-dark-1">
                  <div
                    className="h-full bg-blue-1 rounded-sm"
                    style={{ width: `${progressbar}%` }}
                  ></div>
                </div>
              )}
            </button>

            {/* Переходы */}
            <p className="text-sm text-center mt-4">
              Нет аккаунта?{" "}
              <button
                type="button"
                onClick={() => navigate("/sign-up")}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Зарегистрируйтесь
              </button>
            </p>

            <p className="text-sm text-center mt-2">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Забыли пароль?
              </button>
            </p>
          </>
        )}
      </form>

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
    </main>
  );
};

export default SignIn;
