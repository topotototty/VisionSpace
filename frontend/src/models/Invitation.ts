import { IConference } from "./Conference"
import { IUser } from "./User"


export interface IInvitation {
    id: string;
    conference: IConference;
    participant: IUser;
    created_at: string;
    participant_role: string
    invitation_status: string
}