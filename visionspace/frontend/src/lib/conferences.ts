

export enum ConferenceStatus {
    CREATED = 'CREATED',
    STARTED = 'STARTED',
    FINISHED = 'FINISHED',
    CANCELED = 'CANCELED'
}


export function getValueLowerCase(value: string) {
    return value.toLowerCase();
}