// hooks/useActivity.ts
import { useEffect, useState } from "react";
import ActivityService from "services/activities/service";

export interface IUserActivity {
  timestamp: string;
  action: string;
}

export const useActivity = () => {
  const [activities, setActivities] = useState<IUserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const getActivities = async () => {
    try {
      const data = await ActivityService.getUserActivities();
      setActivities(data);
    } catch (error) {
      console.error("Ошибка получения активности", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getActivities();
  }, []);

  return { activities, loading, reload: getActivities };
};
