import { LoginMode } from "lib/login"


/**
 * Включение режима отладки
 * @constant
 */
export const DEBUG = true


export const sidebarLinks = [
    {
        label: 'Главная',
        route: '/',
        icon: '/icons/home.svg',
        permissions: []
    },
    {
        label: 'Конференции',
        route: '/meetings',
        icon: '/icons/meetings.svg',
        permissions: ["MEMBER"]
    },
    // {
    //     label: 'Плагины',
    //     route: '/plugins',
    //     icon: '/icons/plugin-svgrepo-com.svg',
    //     permissions: []
    // },
    {
        label: 'Панель управления',
        route: '/dashboard',
        icon: '/icons/plugin-svgrepo-com.svg',
        permissions: ["MODERATOR", "TECH_SUPPORT"]
    },
    // {
    //     label: 'Календарь',
    //     route: '/calendar',
    //     icon: '/icons/calendar.svg',
    // },
]


export const navbarLinks = [
    {
        label: 'Главная',
        route: '/',
    },
    {
        label: 'Конференции',
        route: '/meetings',
    },
    {
        label: 'Профиль',
        route: '/profile'
    },
    // {
    //     label: 'Календарь',
    //     route: '/calendar',
    // },
    // {
    //     label: 'Плагины',
    //     route: '/plugins',
    // },
    // {
    //     label: 'Плагин Outlook',
    //     route: '/plugins/outlook',
    // },
    {
        label: 'Панель управления',
        route: '/dashboard',
    },
    {
        label: 'Не найдено',
        route: '',
    }
]


export const jistiConfigOverwrite = {
    startWithAudioMuted: true,
    startWithVideoMuted: true,
	prejoinPageEnabled: false,
    disableVideo: true,
	DEFAULT_BACKGROUND: "#1e1d2b",
	hideLoginButton: true,
	readOnlyName: true,
	subject: "",
}


export const jistiInterfaceConfigOverwrite = {
    APP_NAME: "Vision Space Meet",
	PROVIDER_NAME: "Vision Space",
	AUDIO_LEVEL_PRIMARY_COLOR: "rgba(91,202,221,0.4)",
	AUDIO_LEVEL_SECONDARY_COLOR: "rgba(91,202,221,0.2)",
	HIDE_INVITE_MORE_HEADER: true,
	DEFAULT_BACKGROUND: "#1e1d2b",
	GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
	DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
	DISPLAY_WELCOME_FOOTER: false,
	SHOW_PROMOTIONAL_CLOSE_PAGE: false,


    TOOLBAR_BUTTONS: [
        'microphone', 'camera', 'desktop', 'chat',
        'tileview', 'fullscreen', 'videoquality', 
        'filmstrip', 'settings', 'hangup'
    ],
}


export const jitsiDomain = "vision-video-node1.hprspc.com"


/**
 * Базовый URL для Backend API
 * @constant
 */
// export const BASE_API_URL = `${location.origin}/api/v1/`
// 
export const BASE_API_URL = DEBUG ? 'http://127.0.0.1:8000/api/v1/' : `${location.origin}/api/v1/`


/**
 * Количество времени в секундах, на которое выдаётся refresh-токен
 * @constant
 */
export const REFRESH_TOKEN_LIFETIME = 60 * 60 * 24 * 1 // 1 days


/**
 * Права доступа для ролей
 * @constant
 */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
    MODERATOR: ["MEMBER", "TECH_SUPPORT", "MODERATOR"],
    TECH_SUPPORT: ["MEMBER", "TECH_SUPPORT"],
    MEMBER: ["MEMBER"],
}


/**
 * Режим работы авторизации сайта (basic/keycloak)
 * @constant
 */
export const AUTH_MODE = LoginMode.BASIC