// services/activity/service.ts

import { apiClientWithAuth } from "services/api/service";

interface IUserActivity {
  timestamp: string;
  action: string;
}

class ActivityService {
  // Получить активность текущего пользователя
  public async getUserActivities(): Promise<IUserActivity[]> {
    return await apiClientWithAuth
      .get("users/me/activities/")
      .then((response) => {
        if (response.status === 200) {
          return response.data; // массив действий пользователя
        }
        return [];
      })
      .catch((error) => {
        console.error("Ошибка при получении активности:", error);
        return [];
      });
  }
}

export default new ActivityService();
