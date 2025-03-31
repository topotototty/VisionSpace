import { IConference, IFilters } from "models/Conference"
import { filterConferencesByDate, filterConferencesByTag } from "lib/date"
import { createContext, FC, useContext, useEffect, useState } from "react"
import ConferencesService from "services/conference/service"
import { useAuth } from "hooks/useAuth"
import { DateTime } from "luxon"
import { toast } from "react-toastify"

interface ConferencesContextType {
    conferences: IConference[] | null
    filters: IFilters
    fillteredConferences: IConference[] | null
    setFilter: (filter: keyof IFilters, value: string | boolean | null) => void
    setFilterMany: (filters: IFilters) => void
    loading: boolean
    getConferences: () => void
    deleteConference: (id: string) => void
    createFast: (title: string) => void
    createScheduled: (data: any) => void
    createRepetitive: (data: any) => void

    // Statuses
    setActive: (id: string) => void
    setFinished: (id: string) => void
    setCanceled: (id: string) => void

    getConferencesByDate: (date: string) => IConference[]
    getConferencesByDates: (conferences: IConference[]) => Map<string, IConference[]>
    getConferencesByTags: (tag: number) => IConference[]
}


const ConferencesContext = createContext<ConferencesContextType | undefined>(undefined);


export const useConferences = () => {
    const context = useContext(ConferencesContext);
    if (context === undefined) {
        throw new Error("useConferences must be used within an ConferencesProvider");
    }

    return context;
}


export const ConferencesProvider: FC<{children: React.ReactNode}> = ({children}) => {
    const [conferences, setConferences] = useState<IConference[] | null>(null);
    const [fillteredConferences, setFillteredConferences] = useState<IConference[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [filters, setFilters] = useState<IFilters>({
        started_at: null,
        type: null,
        creator: null,
        status: null,
        search: null,
        ordering: null,
        showFuture: true,
        showPast: null,
    });
    const {user} = useAuth();


    const checkFilters = () => {
        // Проверяем, есть ли хотя бы один фильтр и он не пустой или не undefined или не пустая строка
        const hasFilters = Object.values(filters).some(value => value !== null);
        return hasFilters;
    }


    // const filtersToQueryParams = (filters: any) => {
    //     // Преобразуем объект фильтров в строку запроса
    //     const queryParams = new URLSearchParams();
    //     for (const key in filters) {
    //         if (filters[key] !== null) {
    //             queryParams.append(key, filters[key]);
    //         }
    //     }
    //     return queryParams.toString();
    // }

    useEffect(() => {
        applyFilters();
    }, [filters])


    const getConferences = () => {
        if (user) {
            // if (checkFilters()) {
                // return ConferencesService.getConferencesWithFilters(
                //     filtersToQueryParams(filters)
                // ).then((conferences) => {
                //     setConferences(conferences);
                //     setLoading(false);
                // });
            // } else {
                return ConferencesService.getConferences().then((conferences) => {
                    setConferences(conferences);
                    setLoading(false);
                });
            // }
        } else {
            setConferences(null);
            setFillteredConferences(null);
        }
    }


    const setFilter = (filter: keyof IFilters, value: string | boolean | null) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filter]: value
        }));
        applyFilters();
    }


    const setFilterMany = (filters: IFilters) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            ...filters
        }));
        applyFilters();
    }


    useEffect(() => {
        if (conferences && checkFilters() === true) {
            applyFilters();
        } else {
            setFillteredConferences(conferences);
        }
    }, [conferences])


    const applyFilters = () => {
        if (conferences) {
            let filtered = conferences;

            if (filters.search) {
                const searchLover = filters.search.trim().toLowerCase();
                // console.log("🔍 Поиск по:", searchLover);
                filtered = filtered.filter(conf => {
                    const id = conf.id.toLowerCase() || '';
                    const title = conf.title.toLowerCase() || '';
                    const description = conf.description.toLowerCase() || '';
                    const event_id = conf.event.toLowerCase() || '';
                    const creator_id = conf.creator.id.toLowerCase() || '';
                    const creator_name = conf.creator.firstname.toLowerCase() || '';
                    const creator_surname = conf.creator.lastname.toLowerCase() || '';

                    return id.includes(searchLover) ||
                        title.includes(searchLover) ||
                        description.includes(searchLover) ||
                        event_id.includes(searchLover) ||
                        creator_id.includes(searchLover) ||
                        creator_name.includes(searchLover) ||
                        creator_surname.includes(searchLover);
                });
            }
    
            if (filters.type) {
                filtered = filtered.filter(conf => conf.type === filters.type);
            }
    
            if (filters.status) {
                filtered = filtered.filter(conf => conf.status === filters.status);
            }
    
            if (filters.started_at) {
                const filterDate = new Date(filters.started_at).toISOString().split('T')[0];
                filtered = filtered.filter(conf => {
                    const confDate = new Date(conf.started_at).toISOString().split('T')[0];
                    return confDate === filterDate;
                });
            }
    
    
            if (filters.showFuture === true) {
                const now = DateTime.now().startOf('day');
                filtered = filtered.filter(conf => {
                    const confDate = DateTime.fromISO(conf.started_at);
                    return confDate > now && (conf.status === "CREATED" || conf.status === "STARTED");
                });
            }
    
            if (filters.showPast === true) {
                const now = DateTime.now();
                filtered = filtered.filter(conf => {
                    const [hours, minutes, seconds] = conf.duration.split(':').map(Number);
                    const confDate = DateTime.fromISO(conf.started_at);

                    const confEndDate = confDate.plus({ hours, minutes, seconds });
                    return confEndDate < now || (conf.status === "FINISHED" || conf.status === "CANCELLED");
                });
            }

            // Добавить потом ordering и оставшиеся фильтры
            setFillteredConferences(filtered);
        }
    }


    useEffect(() => {
        getConferences();
    }, [user, loading]);


    // Нужен таймер простоя, когда мы ничего не делаем, тогда отправлять запрос раз в 15 секунд, если запрос уже отправлялся, то делать проверку на простой через 30 секунд
    useEffect(() => {
        const timeInterval = setInterval(() => {
            if (user) getConferences()
        }, 30000); // Интервал 30 секунд
        return () => clearInterval(timeInterval);
    }, [user]);



    const getConferencesByDate = (date: string) => {
        const filteredConferences = filterConferencesByDate(conferences || []);
        return filteredConferences.get(date) || []
    }


    const getConferencesByDates = (conferences: IConference[]) => {
        const filteredConferences = filterConferencesByDate(conferences || [], filters.showFuture === true);
        return filteredConferences;
    }


    const getConferencesByTags = (tag: number) => {
        const filteredConferences = filterConferencesByTag(conferences || []);
        return filteredConferences[tag];
    }


    // Создание быстрой конференций
    const createFast = (title: string) => {
        ConferencesService.createFastConference(
            {
                "title": title,
            }
        ).then(data => {
            navigator.clipboard.writeText(window.location.href + `meeting/${data.id}`)
            toast.success("Конференция создана")
            toast.info("Ссылка скопирована в буфер обмена")
            getConferences();
        }).catch(error => console.log(error))
    }


    const createRepetitive = (data: any) => {
        ConferencesService.createRepetitive(
            data
        ).then(data => {
            navigator.clipboard.writeText(window.location.href + `meeting/${data.id}`)
            toast.success("Конференция создана")
            toast.info("Ссылка скопирована в буфер обмена")
            getConferences();
        }).catch(error => console.log(error))
    }


    const createScheduled = (data: any) => {
        ConferencesService.create(
            data
        ).then(data => {
            navigator.clipboard.writeText(window.location.href + `meeting/${data.id}`)
            toast.success("Конференция создана")
            toast.info("Ссылка скопирована в буфер обмена")
            getConferences();
        }).catch(error => console.log(error))
    }


    // Манипуляции с статусами конференций
    const setActive = (id: string) => {
        setLoading(true)
        ConferencesService.setStatus(
            id,
            "STARTED")
        .catch(error => console.log(error))
        .finally(() => {
            setLoading(false)
        })
    }


    const setCanceled = (id: string) => {
        setLoading(true)
        ConferencesService.setStatus(
            id,
            "CANCELED"
        )
        .catch(error => console.log(error))
        .finally(() => {
            setLoading(false)
        })
    }


    const setFinished = (id: string) => {
        setLoading(true)
        ConferencesService.setStatus(
            id,
            "FINISHED"
        )
        .catch(error => console.log(error))
        .finally(() => {
            setLoading(false)
        })
    }

    const deleteConference = (id: string) => {
        setLoading(true);
        try {
            ConferencesService.delete(id).then(() => {
                setConferences((prevConferences) => prevConferences?.filter(conf => conf.id !== id) || null);
                getConferences();
                setLoading(false);
            })
        } catch (error) {
            console.error("Ошибка при удалении конференции:", error);
        } finally {
            setLoading(false);
        }
    };


    return <ConferencesContext.Provider value={
        {
            conferences,
            loading,
            filters,
            setFilter,
            setFilterMany,
            fillteredConferences,
            getConferences,
            getConferencesByDate,
            getConferencesByDates,
            getConferencesByTags,

            createFast,
            createScheduled,
            createRepetitive,

            setActive,
            setCanceled,
            setFinished,

            deleteConference
        }
    }>
        {children}
    </ConferencesContext.Provider>
}