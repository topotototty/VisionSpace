import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "components/ui/select";
import { IPropertiesForm } from "models/Conference";
import { useEffect, useState } from "react";




type PropertiesFormData = {
    properties: IPropertiesForm
}

type PropertiesFormProps = PropertiesFormData & {
    updateFields: (fields: Partial<PropertiesFormData>) => void
}


export function PropertiesForm({ properties, updateFields }: PropertiesFormProps) {
    // daily
    // "properties": {
    //     "interval": "daily",  # Вариант интервала (Ежедневно, Еженедельно, Ежемесячно, Ежегодно)
    //     "periodicity": 0,  # можно сделать integer поскольку условия взаимоисключаемы (либо через n дней, либо только в раб. дни)
    //     "limits": {
    //         "start_date": "2025.01.12",  # Дата начала
    //         "end_date": "2025.05.16"  # Завершить на дате.
    //     }
    // }

    // weekly
    // "properties": {
    //     "interval": "weekly",  # Вариант интервала (Ежедневно, Еженедельно, Ежемесячно, Ежегодно)
    //     "periodicity": 4,  # Повторять каждую n-ю неделю
    //     "limits": {
    //         "start_date": "2025.01.12",  # Дата начала
    //         "end_date": "2025.11.12"  # Завершить на дате.
    //     }
    // }

    // monthly
    // "properties": {
    //     "interval": "yearly",  # Вариант интервала (Ежедневно, Еженедельно, Ежемесячно, Ежегодно)
    //     "periodicity": [
    //         [
    //             12,  # Число для повтора
    //             1   # Число месяца
    //         ],
    //     ],
    //     "limits": {
    //         "start_date": "2025.01.12",  # Дата начала
    //         "end_date": "2026.01.12"  # Завершить на дате.
    //     }
    // }
    const [interval, setInterval] = useState(properties["interval"] ? properties["interval"] : "daily");



    useEffect(() => {
        const newProperties: IPropertiesForm = {
            interval: interval,
            periodicity: 0,
            limits: {
                start_date: "2025.01.12",
                end_date: "2025.05.16"
            }
        }

        updateFields({
            properties: newProperties
        })
    }, [interval])


    return (
        <>
            <div className="w-full flex flex-col">
                <label className="relative font-medium">
                    <span className="text-base font-medium pb-2">Выберите тип конференции</span>
                    <Select defaultValue={interval} onValueChange={setInterval}>
                        <SelectTrigger className="w-full text-white text-opacity-60 px-4">
                            <SelectValue placeholder="Выберите тип конференции" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-2 text-white">
                            <SelectItem value="daily">
                                <div className="flex items-center gap-2">
                                    <img src="/icons/calendar.svg" alt="calendar" style={{ filter: 'invert(100%)' }} width={20} height={20} />
                                    <p>Ежедневная</p>
                                </div>
                            </SelectItem>
                            <SelectItem value="weekly">
                                <div className="flex items-center gap-2">
                                    <img src="/icons/calendar.svg" alt="calendar" style={{ filter: 'invert(100%)' }} width={20} height={20} />
                                    <p>Еженедельная</p> 
                                </div>
                            </SelectItem>
                            <SelectItem value="monthly">
                                <div className="flex items-center gap-2">
                                    <img src="/icons/calendar.svg" alt="calendar" style={{ filter: 'invert(100%)' }} width={20} height={20} />
                                    <p>Ежемесячная</p>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </label>
            </div>
        </>
    )
}
