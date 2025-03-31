import { IInvitation } from "models/Invitation";
import { apiClientWithAuth } from "services/api/service";


class InvitationsService { 

    public get = async (id: string) => {
        // Получение информации о конференции
        const response = await apiClientWithAuth.post(
            `conferences/id/${id}/`,
            {}
        )
        return response.data
    }


    public getMy = async (): Promise<IInvitation[]> => {

        const response = await apiClientWithAuth.get(
            `invitations/`,
            {}
        )
        return response.data
    }

    public getAll = async () => {
        // Получение списка конференции
        const response = await apiClientWithAuth.get(
            'invitations/admin/',
            {}
        )
        return response.data;
    }


    public create = async (data) => { 
        // Создание конференции
        const response = await apiClientWithAuth.post('invitations/', data)
        if (response.status === 201) {
            console.log('Приглашение создано');
        }
        return response.data;
    }


    public update = async (id: string, data) => {
        // Обновление конференции
        const response = await apiClientWithAuth.put(
            `invitations/${id}`,
            data
        )
        return response.data;
    }


    public delete = async (id: string) => {
        // Удаление конференции
        const response = await apiClientWithAuth.delete(`invitations/${id}`)
        return response.data
    }


    public changeStatus = (id: string, status: string) => {
        // Изменение статуса конференции
        apiClientWithAuth.post(
            `invitations/${status}/`,
            {
                "id": id
            }
        ).catch(error => {
            console.log(error);
        })
    }
}


export default new InvitationsService()