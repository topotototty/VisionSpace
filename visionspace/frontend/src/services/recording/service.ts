import { apiClientWithAuth } from "services/api/service";

class RecordingService {
  public async getMyRecordings(page = 1, pageSize = 10) {
    return await apiClientWithAuth
      .get(`users/recordings/?page=${page}&page_size=${pageSize}`)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        return { count: 0, results: [] };
      })
      .catch((error) => {
        console.error("Ошибка при получении записей:", error);
        return { count: 0, results: [] };
      });
  }

  public async deleteRecording(id: number) {
    return await apiClientWithAuth.delete(`users/recordings/${id}/`);
  }
}

export default new RecordingService();
