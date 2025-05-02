import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "components/ui/select";
  import { useEffect, useState } from "react";
  import { ru } from "date-fns/locale/ru";
  import { DateTimePicker } from "components/ui/datetime-picker";
  import { toast } from "react-toastify";
  
  type DateTimeFormData = {
    started_at: string;
    duration: string;
    type: string;
  };
  
  type DateTimeFormProps = DateTimeFormData & {
    updateFields: (fields: Partial<DateTimeFormData>) => void;
  };
  
  export function DateTimeForm({
    started_at,
    duration,
    updateFields,
  }: DateTimeFormProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      started_at ? new Date(started_at) : new Date()
    );
  
    useEffect(() => {
      updateFields({
        started_at: selectedDate?.toISOString(),
        type: "SCHEDULED",
      });
    }, [selectedDate]);
  
    return (
      <div className="text-base font-medium grid grid-cols-1">
        <div className="flex flex-col">
          <span className="text-base font-medium pb-2">
            Выберите дату и время начала конференции
          </span>
          <DateTimePicker
            value={selectedDate}
            locale={ru}
            granularity="minute"
            defaultPopupValue={new Date()}
            onChange={(date) => {
                const now = new Date();
                now.setSeconds(0, 0);
                if (date && date < now) {
                toast.error("Нельзя выбрать прошедшую дату и время");
                return;
                }
                setSelectedDate(date);
            }}
            className="w-full bg-transparent 
                text-white hover:bg-opacity-50 
                hover:bg-gray-3 hover:text-white
                border border-white border-opacity-10 rounded-lg"
            yearRange={1}
            />
        </div>
  
        <div className="flex flex-col">
          <span className="text-base font-medium pb-2">
            Продолжительность конференции
          </span>
          <div className="w-full">
            <Select
              onValueChange={(value) => updateFields({ duration: value })}
              defaultValue={duration || "00:15:00"}
            >
              <SelectTrigger className="w-full text-white *:border-none *:outline-none">
                <SelectValue placeholder="Выберите время" />
              </SelectTrigger>
              <SelectContent className="bg-gray-2 text-white">
                <SelectGroup>
                  <SelectItem value="00:15:00">15 минут</SelectItem>
                  <SelectItem value="00:30:00">30 минут</SelectItem>
                  <SelectItem value="01:00:00">1 час</SelectItem>
                  <SelectItem value="01:30:00">1.5 часа</SelectItem>
                  <SelectItem value="02:00:00">2 часа</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }
  