import React from "react";
import { useAuth } from "hooks/useAuth";
import { useConferences } from "hooks/useConferences";
import ConferenceAnalytics from "components/Analytics/ConferenceAnalytics";
import { ShieldCheck, BarChart, Database } from "lucide-react";

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
        <div className="mt-4 space-y-6">
          <h2 className="text-lg font-semibold">Раздел для модераторов</h2>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <a
              href="/api/admin/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-xl shadow hover:bg-gray-700 transition"
            >
              <ShieldCheck className="w-5 h-5" />
              Django Admin
            </a>

            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-[#1f2937] text-white rounded-xl shadow hover:bg-[#111827] transition"
            >
              <BarChart className="w-5 h-5" />
              Grafana
            </a>

            <a
              href="http://localhost:8086"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-[#1f2937] text-white rounded-xl shadow hover:bg-[#121212] transition"
            >
              <Database className="w-5 h-5" />
              InfluxDB
            </a>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <ConferenceAnalytics conferences={conferences} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
