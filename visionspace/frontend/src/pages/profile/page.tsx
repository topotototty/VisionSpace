import { useEffect, useState } from "react";
import Loader from "components/Loader/loader";
import { useAuth } from "hooks/useAuth";
import { apiClientWithAuth } from "services/api/service";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface IUserActivity {
  timestamp: string;
  action: string;
}

interface IPasswordChangeForm {
  old_password: string;
  new_password: string;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [activities, setActivities] = useState<IUserActivity[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  const pageSize = 10;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IPasswordChangeForm>();

  const getActivities = async (page = 1) => {
    setLoading(true);
    try {
      const res = await apiClientWithAuth.get(`users/me/activities/?page=${page}&page_size=${pageSize}`);
      setActivities(res.data.results);
      setCount(res.data.count);
    } catch (error) {
      console.error("Ошибка получения активности", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (data: IPasswordChangeForm) => {
    try {
      await apiClientWithAuth.post("users/profile/change-password/", data);
      toast.success("Пароль успешно изменён");
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Ошибка при смене пароля");
    }
  };

  useEffect(() => {
    getActivities(currentPage);
  }, [currentPage]);

  const renderActivityList = () => {
    if (loading) return <span className="text-[16px] text-white/60">Загрузка активности...</span>;
    if (activities.length === 0) return <span className="text-[16px] text-white/40">Нет действий</span>;

    return (
      <div className="flex flex-col gap-4">
        <ul className="flex flex-col gap-2">
          {activities.map((a, i) => (
            <li key={i} className="bg-gray-2 rounded-md p-3 border border-white border-opacity-5 text-sm text-white/90">
              <span className="block font-semibold text-blue-1">
                {new Date(a.timestamp).toLocaleString("ru-RU")}
              </span>
              <span className="block mt-1">{a.action}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-center items-center gap-2 mt-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-sm px-3 py-1 bg-gray-2 rounded hover:bg-gray-3 disabled:opacity-40"
          >
            Назад
          </button>
          <span className="text-white/70 text-sm">
            Страница {currentPage} из {Math.ceil(count / pageSize)}
          </span>
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage >= Math.ceil(count / pageSize)}
            className="text-sm px-3 py-1 bg-gray-2 rounded hover:bg-gray-3 disabled:opacity-40"
          >
            Вперёд
          </button>
        </div>
      </div>
    );
  };

  if (authLoading || !user) {
    return (
      <div className="h-full flex flex-col justify-center items-center">
        {Loader({ text: "Загрузка..." })}
      </div>
    );
  }

  return (
    <section className="flex size-full mt-5">
      <div className="w-[220px]">
        <ul className="flex flex-col gap-2 text-[1.35rem] pt-2 pr-4 cursor-pointer font-bold noselect">
          <li
            className={`cursor-pointer hover:text-blue-1 ${activeTab === "profile" ? 'text-blue-1' : ''}`}
            onClick={() => setActiveTab("profile")}
          >
            Профиль
          </li>
          <li
            className={`cursor-pointer hover:text-blue-1 ${activeTab === "security" ? 'text-blue-1' : ''}`}
            onClick={() => setActiveTab("security")}
          >
            Безопасность
          </li>
        </ul>
      </div>

      <div className="w-full px-6">
        {activeTab === "profile" && (
          <>
            <div className="flex flex-row items-center gap-2">
              <h1 className="font-bold text-[30px]">{user.firstname} {user.lastname}</h1>
            </div>

            <div className="flex flex-col gap-2 mt-4 text-[18px] text-white/90">
              <span className="text-white/60">Идентификационный номер:</span>
              <span className="font-mono">{user.id}</span>
              <span className="text-white/60 mt-2">Почта:</span>
              <span className="font-mono">{user.email}</span>
            </div>

            <div className="mt-8 max-h-[450px] overflow-y-auto pr-2">
              <h2 className="font-semibold text-[22px] mb-3 sticky top-0 bg-dark-1 z-10">Последние действия</h2>
              {renderActivityList()}
            </div>
          </>
        )}

        {activeTab === "security" && (
          <>
            <div className="flex flex-row items-center gap-2">
              <h1 className="font-bold text-[30px]">Безопасность</h1>
            </div>

            <form
              onSubmit={handleSubmit(handlePasswordChange)}
              className="mt-6 flex flex-col gap-4 max-w-md"
            >
              <label className="flex flex-col text-white/80 text-sm gap-1">
                Текущий пароль
                <input
                  type="password"
                  {...register("old_password", { required: "Обязательное поле" })}
                  className="bg-gray-2 p-2 rounded border border-white/10 outline-none"
                />
                {errors.old_password && <span className="text-red-500 text-xs">{errors.old_password.message}</span>}
              </label>

              <label className="flex flex-col text-white/80 text-sm gap-1">
                Новый пароль
                <input
                  type="password"
                  {...register("new_password", {
                    required: "Обязательное поле",
                    minLength: { value: 8, message: "Минимум 8 символов" }
                  })}
                  className="bg-gray-2 p-2 rounded border border-white/10 outline-none"
                />
                {errors.new_password && <span className="text-red-500 text-xs">{errors.new_password.message}</span>}
              </label>

              <button
                type="submit"
                className="bg-blue-1 text-white font-semibold py-2 rounded hover:bg-blue-2 transition-all"
              >
                Сменить пароль
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
};

export default Profile;
