import * as React from 'react'
import {
  format,
  isSameDay,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  getMonth,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfDay,
  Locale,
} from 'date-fns'
import './DateTimePicker.scss' // Или отдельный файл стилей

type Props = {
  selected: Date
  onChange: (date: Date) => void
  locale?: Locale
  // Начало недели (0 - воскресенье, 1 - понедельник и т.д.)
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

const DatePicker: React.FC<Props> = ({
  selected,
  onChange,
  locale,
  weekStartsOn = 1,
}) => {
  // Месяц, который сейчас отображаем в календаре
  const [viewingDate, setViewingDate] = React.useState(selected)

  // Определяем первую и последнюю неделю месяца
  const firstDayOfFirstWeek = startOfWeek(startOfMonth(viewingDate), { weekStartsOn })
  const lastDayOfFirstWeek = endOfWeek(startOfMonth(viewingDate), { weekStartsOn })
  const daysOfFirstWeek = eachDayOfInterval({
    start: firstDayOfFirstWeek,
    end: lastDayOfFirstWeek,
  })
  const lastDayOfLastWeek = endOfWeek(endOfMonth(viewingDate), { weekStartsOn })
  const daysInWeeksOfMonth = eachDayOfInterval({
    start: firstDayOfFirstWeek,
    end: lastDayOfLastWeek,
  })

  // Переход к предыдущему / следующему месяцу
  const handleChangeMonth = (toNextMonth = true) => {
    const next = toNextMonth ? addMonths(viewingDate, 1) : subMonths(viewingDate, 1)
    setViewingDate(next)
  }

  const handleDateClick = (day: Date) => {
    onChange(day)
  }

  // "Сегодня" (полночь)
  const today = startOfDay(new Date())

  return (
    <div className="date-picker">
      <div className="date-picker-header">
        {/* Кнопка "предыдущий месяц" */}
        <button
          className="date-picker-btn date-picker-header-btn"
          onClick={() => handleChangeMonth(false)}
        >
          &lt;
        </button>

        <div className="date-picker-header-title">
          {format(viewingDate, 'MMMM yyyy', { locale })}
        </div>

        {/* Кнопка "следующий месяц" */}
        <button
          className="date-picker-btn date-picker-header-btn"
          onClick={() => handleChangeMonth(true)}
        >
          &gt;
        </button>
      </div>

      <div className="date-picker-items">
        {/* Шапка дней недели */}
        {daysOfFirstWeek.map(day => (
          <div
            key={'week-' + day.toString()}
            className="date-picker-item date-picker-item-weekday"
          >
            {format(day, 'EEEEEE', { locale })}
          </div>
        ))}

        {/* Все дни в сетке календаря */}
        {daysInWeeksOfMonth.map(day => {
          const classes: string[] = ['date-picker-item', 'date-picker-btn']

          // Если день совпадает с выбранным
          if (isSameDay(day, selected)) {
            classes.push('date-picker-item-current')
          }
          // Если день не в текущем месяце (серым)
          if (getMonth(day) !== getMonth(viewingDate)) {
            classes.push('date-picker-item-outside-month')
          }
          // Запрещаем прошедшие даты: если day < today, то disabled
          const isTodayOrFuture = startOfDay(day) >= today
          if (!isTodayOrFuture) {
            classes.push('date-picker-item-disabled')
          }

          return (
            <button
              key={day.toString()}
              className={classes.join(' ')}
              onClick={() => handleDateClick(day)}
              disabled={!isTodayOrFuture}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default DatePicker
