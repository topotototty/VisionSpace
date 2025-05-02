import { useEffect, useState } from "react";
import Loader from "components/Loader/loader";
import { useAuth } from "hooks/useAuth";
import { apiClientWithAuth } from "services/api/service";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import RecordingService from "services/recording/service";

interface IUserActivity {
  timestamp: string;
  action: string;
}

interface IPasswordChangeForm {
  old_password: string;
  new_password: string;
}

interface IRecording {
  id: number;
  created_at: string;
  file_url: string;
}


const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [activities, setActivities] = useState<IUserActivity[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "recordings">("profile");

  const [recordings, setRecordings] = useState<IRecording[]>([]);
  const [recordingsCount, setRecordingsCount] = useState(0);
  const [recordingsPage, setRecordingsPage] = useState(1);
  const [recordingsLoading, setRecordingsLoading] = useState(false);

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

  const getRecordings = async (page = 1) => {
    setRecordingsLoading(true);
    try {
      const res = await RecordingService.getMyRecordings(page, pageSize);
      setRecordings(res.results);
      setRecordingsCount(res.count);
    } catch (error) {
      console.error("Ошибка получения записей", error);
    } finally {
      setRecordingsLoading(false);
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

  useEffect(() => {
    if (activeTab === "recordings") {
      getRecordings(recordingsPage);
    }
  }, [activeTab, recordingsPage]);

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
          <li
            className={`cursor-pointer hover:text-blue-1 ${activeTab === "recordings" ? 'text-blue-1' : ''}`}
            onClick={() => setActiveTab("recordings")}
          >
            Мои записи
          </li>
        </ul>
      </div>

      <div className="w-full px-6">
        {activeTab === "profile" && (
          <>
            <h1 className="font-bold text-[30px]">{user.firstname} {user.lastname}</h1>
            <div className="flex flex-col gap-2 mt-4 text-[18px] text-white/90">
              <span className="text-white/60">Идентификационный номер:</span>
              <span className="font-mono">{user.id}</span>
              <span className="text-white/60 mt-2">Почта:</span>
              <span className="font-mono">{user.email}</span>
            </div>

            <div className="mt-8 max-h-[450px] overflow-y-auto pr-2">
              <h2 className="font-semibold text-[22px] mb-3 sticky top-0 bg-dark-1 z-10">Последние действия</h2>
              {loading ? (
                <span className="text-[16px] text-white/60">Загрузка активности...</span>
              ) : activities.length === 0 ? (
                <span className="text-[16px] text-white/40">Нет действий</span>
              ) : (
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
              )}
            </div>
          </>
        )}

        {activeTab === "security" && (
          <>
            <h1 className="font-bold text-[30px]">Безопасность</h1>
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

        {activeTab === "recordings" && (
          <>
            <h1 className="font-bold text-[30px]">Мои записи</h1>
            <div className="mt-8 max-h-[650px] overflow-y-auto pr-2">
              <h2 className="font-semibold text-[22px] mb-3 sticky top-0 bg-dark-1 z-10">Список записей</h2>
              {recordingsLoading ? (
                <span className="text-[16px] text-white/60">Загрузка записей...</span>
              ) : recordings.length === 0 ? (
                <span className="text-[16px] text-white/40">Нет записей</span>
              ) : (
                <div className="flex flex-col gap-4">
                  <ul className="flex flex-col gap-2">
                    {recordings.map((rec, i) => (
                      <li
                        key={i}
                        className="bg-gray-2 rounded-lg p-5 border border-white/10 shadow-md text-white/90 flex flex-col gap-4"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">
                            Запись от{" "}
                            <span className="text-white font-semibold">
                              {new Date(rec.created_at).toLocaleString("ru-RU")}
                            </span>
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(rec.file_url);
                                toast.success("Ссылка скопирована!");
                              }}
                              className="text-sm bg-gray-3 hover:bg-gray-4 transition px-3 py-1 rounded text-white font-semibold"
                            >
                              📋 Скопировать
                            </button>
                            <a
                              href={rec.file_url}
                              download
                              className="text-sm bg-blue-1 hover:bg-blue-2 transition px-3 py-1 rounded text-white font-semibold"
                            >
                              ⬇ Скачать
                            </a>
                            <button
                              onClick={async () => {
                                if (window.confirm("Удалить запись?")) {
                                  try {
                                    await RecordingService.deleteRecording(rec.id);
                                    toast.success("Запись удалена");
                                    getRecordings(recordingsPage);
                                  } catch {
                                    toast.error("Ошибка удаления");
                                  }
                                }
                              }}
                              className="text-sm bg-red-600 hover:bg-red-700 transition px-3 py-1 rounded text-white font-semibold"
                            >
                              🗑 Удалить
                            </button>
                          </div>
                        </div>

                        <div className="w-full">
                          <video
                            controls
                            className="w-full max-h-[480px] rounded shadow-lg"
                            preload="metadata"
                          >
                            <source src={rec.file_url} type="video/mp4" />
                            Ваш браузер не поддерживает видео.
                          </video>
                        </div>
                      </li>
                    ))}
                  </ul>


                  <div className="flex justify-center items-center gap-2 mt-2">
                    <button
                      onClick={() => setRecordingsPage(p => Math.max(1, p - 1))}
                      disabled={recordingsPage === 1}
                      className="text-sm px-3 py-1 bg-gray-2 rounded hover:bg-gray-3 disabled:opacity-40"
                    >
                      Назад
                    </button>
                    <span className="text-white/70 text-sm">
                      Страница {recordingsPage} из {Math.ceil(recordingsCount / pageSize)}
                    </span>
                    <button
                      onClick={() => setRecordingsPage(p => p + 1)}
                      disabled={recordingsPage >= Math.ceil(recordingsCount / pageSize)}
                      className="text-sm px-3 py-1 bg-gray-2 rounded hover:bg-gray-3 disabled:opacity-40"
                    >
                      Вперёд
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Profile;
