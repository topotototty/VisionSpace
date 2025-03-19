import { IConference } from "models/Conference";



export function formatDate(date: Date): string {
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}


export function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(year, month - 1, day);
}


export function filterConferencesByDate(conferences: IConference[], up: boolean = false): Map<string, IConference[]> {
    // Есть один словарь с датами, если даты нет в словаре, значит добавление нового поля и туда добавление конфы в словарь
    const _dictionary = new Map<string, IConference[]>();

    // сортировать по увеличению дат
    if (up)
        conferences.sort((a: IConference, b: IConference) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime());

    conferences.forEach((conference: IConference) => {
        const date = new Date(conference.started_at).toLocaleDateString("ru-RU",
            {
                day: "numeric",
                month: "numeric",
                year: "numeric"
            }
        );

        if (!_dictionary.has(date)) {
            _dictionary.set(date, [conference]);
        } else {
            _dictionary.get(date)?.push(conference);
        }
    })

    return _dictionary
  }


export function filterConferencesByTag(conferences: IConference[]) {
    // Сортировка по status законченности конференции
    const _pastConferences: IConference[] = [];
    const _futureConferences: IConference[] = [];

    conferences.forEach((conference: IConference) => {
        if (conference.status === "ENDED" || conference.status === "FINISHED" || conference.status === "CANCELED") {
          _pastConferences.push(conference);
        } else {
          _futureConferences.push(conference);
        }
    })
    return [_futureConferences, _pastConferences]
}


export function reverseList(list: any[]) {
    return list.reverse();
}


export function isValidTime(time: string) {
    const [hours, minutes] = time.split(":");
    return hours && minutes && !isNaN(Number(hours)) && !isNaN(Number(minutes));
};


export function isValidDate(date: Date | null) {
    return date instanceof Date && !isNaN(date.getTime());
};


export function formatISODate(date: Date, time: string) {
    if (isValidDate(date) && isValidTime(time)) {
        const [hours, minutes] = time.split(":").map(Number);
        date!.setHours(hours);
        date!.setMinutes(minutes);
        return date!.toISOString();
    }
    return "";
}


// Функция для генерации массива времени
export function generateTimeOptions() {
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minutes = 0; minutes < 60; minutes += 30) {
            const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            times.push(time);
        }
    }
    return times;
};


export function getPlural(n: number, one: string, few: string, many: string): string {
    if (n % 10 === 1 && n % 100 !== 11) return one; 
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return few; 
    return many;
}


export function durationToText(duration: string): string {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    const result: string[] = [];

    if (hours > 0) result.push(`${hours} ${getPlural(hours, 'час', 'часа', 'часов')}`);
    if (minutes > 0) result.push(`${minutes} ${getPlural(minutes, 'минута', 'минуты', 'минут')}`);
    if (seconds > 0) result.push(`${seconds} ${getPlural(seconds, 'секунда', 'секунды', 'секунд')}`);

    return result.length > 0 ? result.join(' ') : '0 секунд';
}