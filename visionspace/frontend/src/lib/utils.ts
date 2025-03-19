import { clsx, type ClassValue } from "clsx"
import { IUser } from "models/User";
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function isIUser(obj: unknown): obj is IUser {
    if (typeof obj !== "object" || obj === null) return false;

    const user = obj as IUser;
    return (
        typeof user.id === "string" &&
        typeof user.firstname === "string" &&
        typeof user.lastname === "string" &&
        typeof user.email === "string" &&
        typeof user.last_login === "string" &&
        typeof user.role === "string"
    );
}


export function validateUrl(url: string) {
  if (
    url.includes("https://") ||
    url.includes("http://")) {

    if (url.includes(`${location.origin}/meeting/`)) {
        return url.split(`${location.origin}/meeting/`)[1];
    }
  } else if (url.length === 36) {
      return url;
  } else {
      return false;
  }
}


export function getBadgeText(type: string) {
	switch (type) {
		case "FAST":
			return "Быстрая";
		case "SCHEDULED":
			return "Запланированная";
		case "REPETITIVE":
			return "Повторяющаяся";
		default:
			return "Неизвестный тип";
	}
}


export function getBadgeColor(type: string) {
	switch (type) {
		case "FAST":
			return "bg-orange-500";
		case "SCHEDULED":
			return "bg-blue-500";
		case "REPETITIVE":
			return "bg-green-500";
  	}
}


export function getConferenceColor(status: string) {
	switch (status) {
		case "CREATED":
			return "blue-500";
		case "CANCELED":
			return "gray-500";
		case "STARTED":
			return "green-600";
		case "FINISHED":
			return "red-500";
		default:
			return "gray-500";
	}
}