// src/pages/Dashboard.tsx

import React from "react";
import { useAuth } from "hooks/useAuth";
// ... другие импорты ...

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Загрузка...</p>;

  // Если неавторизован
  if (!user) {
    return <p>Вы не авторизованы</p>;
  }

  return (
    <section style={{ padding: "1rem" }}>
      <h1>Панель администратора</h1>

      {user.role === "MODERATOR" && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Раздел для модераторов</h2>
        </div>
      )}

      {user.role === "TECH_SUPPORT" && (
        <div>
          <h2>Раздел для техподдержки</h2>
          <p>Здесь будет функционал для техподдержки...</p>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
