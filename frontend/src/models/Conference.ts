import { ConferenceStatus } from "lib/conferences";
import { IUser } from "models/User";


export interface IConference {
    id: string,
    event: string,
    type: string, // fast, repetitive
    title: string,
    duration: string
    description: string,
    started_at: string,
    status: string,
    creator: IConferenceCreator
}


export interface IConferenceParticipants {
    conference: IConference;
    participants: IUser[];
}


export interface IConferenceCreator {
    id: string;
    firstname: string;
    lastname: string;
}


export interface IConferenceStatus {
    status: "CREATED" | "STARTED" | "FINISHED" | "CANCELLED";
}

export interface ICreateMeetProps {
    title: string
    description: string
    started_at: string
    ended_at: string
    invited_users: string[]
}

export interface IJoinMeetinProps {
    conference: string
}


export interface IFilters {
    started_at: string | null; // date
    type: string | null; // fast, scheduled, repetive
    creator: string | null; // id, firstname, lastname
    status: ConferenceStatus | null; // CREATED, STARTED, FINISHED, CANCELLED
    search: string | null; // search by title, description, creator
    ordering: string | null; // asc, desc
    showFuture: boolean | null; // show future conferences
    showPast: boolean | null; // show past conferences
}


export interface IParameters {
    title: string;
    participants: string[];
    time: string[];
    properties: string[];
}


export interface ILimitsForm {
    start_date: string;
    end_date: string | null
}

export interface IPropertiesForm {
    interval: string;
    periodicity: number | string[]
    limits: ILimitsForm
}