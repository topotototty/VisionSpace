import { IConference, IConferenceParticipants } from "models/Conference";
import { apiClient, apiClientWithAuth } from "services/api/service";


class ConferencesService { 
    // Получение всех конференций пользователя
    public getConferences = async (): Promise<IConference[]> => {
        return await apiClientWithAuth.get(
            'conferences/', {}
        ).then(response => {
            if (response.status === 200) {
                return response.data;
            }
        }).catch(error => console.log(error));
    }


    public getConferencesWithFilters = async (filters: string): Promise<IConference[]> => {
        return await apiClientWithAuth.get(
            'conferences/?' + filters, {}
        ).then(response => {
            if (response.status === 200) {
                return response.data;
            }
        }).catch(error => console.log(error));
    }


    // Получение конференции по id
    public getConferenceById = (id: string): Promise<IConferenceParticipants> => {
        return apiClientWithAuth.get(
            `conferences/id/${id}/`,
            {}
        ).then(response => response.data).catch(error => console.log(error))
    }


    public getConferenceToken = (id: string) => {
        return apiClientWithAuth.post(
            `conferences/id/${id}/`,
            {}
        ).then(response => response.data).catch(error => console.log(error))
    }


    public getConferenceTokenAsGuest = (id: string, userName: string) => {
        return apiClient.post(
            `conferences/id/${id}/`,
            {
                "username": userName
            }
        ).then(response => response.data).catch(error => console.log(error))
    }


    public createFastConference = (data) => {
        return apiClientWithAuth.post(
            'conferences/fast/', data
        ).then(response => response.data).catch(error => console.log(error))
    }


    public create = (data) => {
        return apiClientWithAuth.post(
            'conferences/', data
        ).then(response => response.data).catch(error => console.log(error))
    }


    public createRepetitive = (data) => {
        return apiClientWithAuth.post(
            'conferences/repetitive/', data
        ).then(response => response.data).catch(error => console.log(error))
    }


    public update = (data) => {
        return apiClientWithAuth.put(
            `conferences/`, data
        ).then(response => response.data).catch(error => console.log(error))
    }


    public delete = async (id: string) => {
        return await apiClientWithAuth.delete(
            `conferences/${id}/`,
            {}
        ).then(response => response.data).catch(error => console.log(error))
    }


    public setStatus = (id: string, status: string) => {
        return apiClientWithAuth.post(
            `conferences/status/${id}/${status}/`,
            {}
        ).then(response => response.data).catch(error => console.log(error))
    }    
}


export default new ConferencesService()