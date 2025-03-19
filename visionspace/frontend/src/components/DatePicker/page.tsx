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
  Locale,
} from 'date-fns'
import './index.scss'

type Props = {
  selected: Date
  onChange: (date: Date) => any
  locale?: Locale
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

const DatePicker: React.FC<Props> = ({
  selected,
  onChange,
  locale,
  weekStartsOn = 1,
}) => {
  const [viewingDate, setViewingDate] = React.useState(selected)

  const firstDayOfFirstWeek = startOfWeek(startOfMonth(viewingDate), {
    weekStartsOn,
  })
  const lastDayOfFirstWeek = endOfWeek(startOfMonth(viewingDate), {
    weekStartsOn,
  })
  const daysOfFirstWeek = eachDayOfInterval({
    start: firstDayOfFirstWeek,
    end: lastDayOfFirstWeek,
  })
  const lastDayOfLastWeek = endOfWeek(endOfMonth(viewingDate), { weekStartsOn })
  const daysInWeeksOfMonth = eachDayOfInterval({
    start: firstDayOfFirstWeek,
    end: lastDayOfLastWeek,
  })

  const handleChangeMonth = (changeToNextMonth = true) => {
    const nextViewingDate = changeToNextMonth
      ? addMonths(viewingDate, 1)
      : subMonths(viewingDate, 1)

    setViewingDate(() => nextViewingDate)
  }

  const handleChangeDate = (date: Date) => {
    onChange(date)
  }

  return (
    <div className="date-picker">
      <div className="date-picker-header">
        <button
          className="date-picker-btn date-picker-header-btn"
          onClick={() => handleChangeMonth(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            className="date-picker-header-btn-icon"
          >
            <path
              fillRule="evenodd"
              d="M9.78 12.78a.75.75 0 01-1.06 0L4.47 8.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L6.06 8l3.72 3.72a.75.75 0 010 1.06z"
            ></path>
          </svg>
        </button>
        <div className="date-picker-header-title">
          {format(viewingDate, 'MMMM yyyy', { locale })}
        </div>
        <button
          className="date-picker-btn date-picker-header-btn"
          onClick={() => handleChangeMonth()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            className="date-picker-header-btn-icon"
          >
            <path
              fillRule="evenodd"
              d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"
            ></path>
          </svg>
        </button>
      </div>

      <div className="date-picker-items">
        {daysOfFirstWeek.map(day => (
          <div
            key={day.toString()}
            className="date-picker-item date-picker-item-weekday"
          >
            {format(day, 'EEEEEE', { locale })}
          </div>
        ))}
        {daysInWeeksOfMonth.map(day => {
          const classes: string[] = ['date-picker-item', 'date-picker-btn']

          if (isSameDay(day, selected)) classes.push('date-picker-item-current')

          if (getMonth(day) !== getMonth(viewingDate))
            classes.push('date-picker-item-outside-month')

          return (
            <button
              key={day.toString()}
              className={classes.join(' ')}
              onClick={() => handleChangeDate(day)}
            >
              {format(day, 'd', { locale })}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default DatePicker