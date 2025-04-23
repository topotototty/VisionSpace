import React from "react";
import { useAuth } from "hooks/useAuth";
import { useConferences } from "hooks/useConferences";
import ConferenceAnalytics from "components/Analytics/ConferenceAnalytics";

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const {
    conferences,
    loading: conferencesLoading,
  } = useConferences();

  if (loading || conferencesLoading) return <p>Загрузка...</p>;
  if (!user) return <p>Вы не авторизованы</p>;

  return (
    <div className="w-full h-full min-h-screen p-4 overflow-y-auto">
      <h1 className="text-2xl font-bold">Панель администратора</h1>

      {user.role === "MODERATOR" && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Раздел для модераторов</h2>
          <a
            href="/api/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Перейти в админ-панель
          </a>

          <div className="mt-6">
              <ConferenceAnalytics conferences={conferences} />
          </div>
        </div>
      )}

      {user.role === "TECH_SUPPORT" && (
        <div>
          <h2 className="text-lg font-semibold">Раздел для техподдержки</h2>
          <p>Здесь будет функционал для техподдержки...</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
