import { FC, useMemo } from "react";
import { IConference } from "models/Conference";
import { DateTime } from "luxon";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  CartesianGrid,
} from "recharts";

interface Props {
  conferences: IConference[] | null;
}

const COLORS = ["#22c55e", "#3b82f6", "#eab308", "#ef4444"];

const ConferenceAnalytics: FC<Props> = ({ conferences }) => {
  const stats = useMemo(() => {
    if (!conferences) return null;

    const now = DateTime.now();
    const todayStr = now.toISODate();
    const tomorrowStr = now.plus({ days: 1 }).toISODate();
    const yesterdayStr = now.minus({ days: 1 }).toISODate();

    const total = conferences.length;
    const byStatus = {
      CREATED: conferences.filter(c => c.status === "CREATED").length,
      STARTED: conferences.filter(c => c.status === "STARTED").length,
      FINISHED: conferences.filter(c => c.status === "FINISHED").length,
      CANCELED: conferences.filter(c => c.status === "CANCELED").length,
    };

    const byDate = {
      today: conferences.filter(c => c.started_at.startsWith(todayStr)).length,
      tomorrow: conferences.filter(c => c.started_at.startsWith(tomorrowStr)).length,
      yesterday: conferences.filter(c => c.started_at.startsWith(yesterdayStr)).length,
    };

    const uniqueCreators = new Set(conferences.map(c => c.creator.id)).size;

    const totalDurationHours = conferences.reduce((sum, conf) => {
      const [h, m, s] = conf.duration.split(":").map(Number);
      return sum + h + m / 60 + s / 3600;
    }, 0);

    const last7days: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const day = now.minus({ days: i }).toFormat("dd.MM");
      last7days[day] = 0;
    }

    conferences.forEach(c => {
      const day = DateTime.fromISO(c.started_at).toFormat("dd.MM");
      if (last7days[day] !== undefined) {
        last7days[day]++;
      }
    });

    const barData = Object.entries(last7days).map(([day, count]) => ({
      date: day,
      value: count,
    }));

    return {
      total,
      byStatus,
      byDate,
      uniqueCreators,
      totalDurationHours: totalDurationHours.toFixed(1),
      barData,
    };
  }, [conferences]);

  if (!stats) return null;

  const statusData = Object.entries(stats.byStatus).map(([status, value]) => ({
    name: status,
    value,
  }));

  return (
    <div className="w-full flex flex-col gap-8 text-white">
      <h2 className="text-2xl font-semibold">Аналитика по конференциям</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <StatCard title="Всего конференций" value={stats.total} />
        <StatCard title="Создано" value={stats.byStatus.CREATED} />
        <StatCard title="Активны" value={stats.byStatus.STARTED} />
        <StatCard title="Завершены" value={stats.byStatus.FINISHED} />
        <StatCard title="Отменены" value={stats.byStatus.CANCELED} />
        <StatCard title="Сегодня" value={stats.byDate.today} />
        <StatCard title="Завтра" value={stats.byDate.tomorrow} />
        <StatCard title="Вчера" value={stats.byDate.yesterday} />
        <StatCard title="Создателей" value={stats.uniqueCreators} />
        <StatCard title="Общая длит. (ч)" value={stats.totalDurationHours} />
      </div>

      {/* Графики рядом, без фонов */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Круговая диаграмма */}
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={40}
                label
              >
                {statusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Столбчатая диаграмма */}
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard: FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className="rounded-xl border border-white border-opacity-10 p-4 flex flex-col justify-center items-start shadow-md">
    <p className="text-xs text-gray-400 mb-1">{title}</p>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

export default ConferenceAnalytics;
